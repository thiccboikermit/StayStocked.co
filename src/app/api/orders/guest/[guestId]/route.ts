import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByGuestId } from '../../../../../lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guestId: string }> }
) {
  try {
    const { guestId } = await params;

    if (!guestId) {
      return NextResponse.json(
        { error: 'Guest ID is required' },
        { status: 400 }
      );
    }

    // Get all orders for this guest
    const orders = getOrdersByGuestId(guestId);

    // Sort by creation date (newest first) and format for response
    const sortedOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(order => ({
        id: order.id,
        propertyId: order.propertyId,
        propertyName: order.propertyName || 'Property',
        status: order.status,
        items: Array.isArray(order.items) ? order.items : [],
        total: order.total,
        createdAt: order.createdAt,
        completedAt: order.completedAt,
        stockingPhotos: order.stockingPhotos || [],
        notes: order.notes,
        guestInfo: order.guestInfo,
        // Include booking/stay details if available
        checkInDate: order.checkInDate,
        numberOfGuests: order.numberOfGuests,
      }));

    return NextResponse.json({ orders: sortedOrders });
  } catch (error) {
    console.error('Failed to fetch guest orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guest orders' },
      { status: 500 }
    );
  }
}