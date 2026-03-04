// iCal parsing and date validation utilities

export interface BookedDate {
  start: Date;
  end: Date;
  summary?: string;
  uid?: string;
}

export interface CalendarAvailability {
  bookedDates: BookedDate[];
  lastUpdated: Date;
}

/**
 * Parse iCal content and extract booked date ranges
 */
export function parseICalContent(icalContent: string): BookedDate[] {
  const bookedDates: BookedDate[] = [];
  const lines = icalContent.split('\n').map(line => line.trim());
  
  let currentEvent: Partial<BookedDate> = {};
  let inEvent = false;
  
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      currentEvent = {};
    } else if (line === 'END:VEVENT' && inEvent) {
      if (currentEvent.start && currentEvent.end) {
        bookedDates.push(currentEvent as BookedDate);
      }
      inEvent = false;
      currentEvent = {};
    } else if (inEvent) {
      if (line.startsWith('DTSTART')) {
        const dateStr = line.split(':')[1];
        currentEvent.start = parseICalDate(dateStr);
      } else if (line.startsWith('DTEND')) {
        const dateStr = line.split(':')[1];
        currentEvent.end = parseICalDate(dateStr);
      } else if (line.startsWith('SUMMARY:')) {
        currentEvent.summary = line.substring(8);
      } else if (line.startsWith('UID:')) {
        currentEvent.uid = line.substring(4);
      }
    }
  }
  
  return bookedDates;
}

/**
 * Parse iCal date format to JavaScript Date
 */
function parseICalDate(dateStr: string): Date {
  // Handle both date-only (YYYYMMDD) and datetime (YYYYMMDDTHHMMSS) formats
  if (dateStr.length === 8) {
    // Date only format: YYYYMMDD
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; // Month is 0-indexed
    const day = parseInt(dateStr.substring(6, 8));
    return new Date(year, month, day);
  } else if (dateStr.length >= 15) {
    // DateTime format: YYYYMMDDTHHMMSSZ or YYYYMMDDTHHMMSS
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    const hour = parseInt(dateStr.substring(9, 11));
    const minute = parseInt(dateStr.substring(11, 13));
    const second = parseInt(dateStr.substring(13, 15));
    
    return new Date(year, month, day, hour, minute, second);
  }
  
  return new Date();
}

/**
 * Fetch and parse iCal feed from URL
 */
export async function fetchICalFeed(url: string): Promise<CalendarAvailability> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch iCal feed: ${response.statusText}`);
    }
    
    const icalContent = await response.text();
    const bookedDates = parseICalContent(icalContent);
    
    return {
      bookedDates,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Error fetching iCal feed:', error);
    throw error;
  }
}

/**
 * Validate if the requested dates are available for booking
 */
export function validateBookingDates(
  checkIn: Date,
  checkOut: Date,
  bookedDates: BookedDate[],
  bufferHours = 4 // Default 4-hour buffer for cleaning
): { isValid: boolean; conflicts: BookedDate[]; error?: string } {
  
  // Basic validation
  if (checkIn >= checkOut) {
    return {
      isValid: false,
      conflicts: [],
      error: 'Check-out date must be after check-in date'
    };
  }
  
  if (checkIn < new Date()) {
    return {
      isValid: false,
      conflicts: [],
      error: 'Check-in date cannot be in the past'
    };
  }
  
  const conflicts: BookedDate[] = [];
  const bufferMs = bufferHours * 60 * 60 * 1000; // Convert hours to milliseconds
  
  // Check for conflicts with existing bookings
  for (const booking of bookedDates) {
    const bookingStart = new Date(booking.start.getTime() - bufferMs);
    const bookingEnd = new Date(booking.end.getTime() + bufferMs);
    
    // Check if the requested dates overlap with any existing booking (including buffer)
    if (
      (checkIn >= bookingStart && checkIn < bookingEnd) ||
      (checkOut > bookingStart && checkOut <= bookingEnd) ||
      (checkIn <= bookingStart && checkOut >= bookingEnd)
    ) {
      conflicts.push(booking);
    }
  }
  
  return {
    isValid: conflicts.length === 0,
    conflicts,
    error: conflicts.length > 0 ? 'Selected dates conflict with existing bookings or cleaning windows' : undefined
  };
}

/**
 * Get available date ranges for a property
 */
export function getAvailableDateRanges(
  bookedDates: BookedDate[],
  startDate: Date = new Date(),
  endDate: Date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
  bufferHours = 4
): Array<{ start: Date; end: Date }> {
  
  const availableRanges: Array<{ start: Date; end: Date }> = [];
  const bufferMs = bufferHours * 60 * 60 * 1000;
  
  // Sort booked dates by start time
  const sortedBookings = [...bookedDates].sort((a, b) => a.start.getTime() - b.start.getTime());
  
  let currentDate = new Date(startDate);
  
  for (const booking of sortedBookings) {
    const bookingStart = new Date(booking.start.getTime() - bufferMs);
    
    if (currentDate < bookingStart) {
      availableRanges.push({
        start: new Date(currentDate),
        end: new Date(bookingStart)
      });
    }
    
    currentDate = new Date(Math.max(currentDate.getTime(), booking.end.getTime() + bufferMs));
  }
  
  // Add final range if there's availability after the last booking
  if (currentDate < endDate) {
    availableRanges.push({
      start: new Date(currentDate),
      end: new Date(endDate)
    });
  }
  
  return availableRanges.filter(range => range.end.getTime() - range.start.getTime() > 24 * 60 * 60 * 1000); // At least 1 day
}

/**
 * Convert BookedDate array to format expected by booking management
 */
export function convertBookedDatesToBookings(bookedDates: BookedDate[]): Array<{ start: Date; end: Date; summary?: string; uid?: string }> {
  return bookedDates.map(booking => ({
    start: booking.start,
    end: booking.end,
    summary: booking.summary,
    uid: booking.uid
  }));
}

/**
 * Refresh iCal calendar for a property and update bookings
 * Returns the updated bookings array
 */
export async function refreshPropertyCalendar(propertyId: string, iCalUrl: string): Promise<Array<{ start: Date; end: Date; summary?: string; uid?: string }>> {
  try {
    // Fetch fresh calendar data
    const calendarData = await fetchICalFeed(iCalUrl);
    
    // Convert to booking format
    const bookingData = convertBookedDatesToBookings(calendarData.bookedDates);
    
    // Import the booking management functions dynamically to avoid circular dependency
    const { updateBookingsFromICal } = await import('./auth');
    
    // Update stored bookings
    const updatedBookings = updateBookingsFromICal(propertyId, bookingData);
    
    console.log(`Refreshed calendar for property ${propertyId}: ${updatedBookings.length} bookings found`);
    
    return bookingData;
  } catch (error) {
    console.error('Failed to refresh property calendar:', error);
    throw error;
  }
}

/**
 * Check if calendar data is stale and needs refreshing
 * Returns true if data is older than the specified hours (default: 1 hour)
 */
export function shouldRefreshCalendar(lastUpdated: Date, maxAgeHours = 1): boolean {
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
  return Date.now() - lastUpdated.getTime() > maxAgeMs;
}
