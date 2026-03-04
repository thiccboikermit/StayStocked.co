import { NextRequest, NextResponse } from 'next/server';
import { getOrdersForStocker } from '../../../../../lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stockerId: string }> }
) {
  try {
    const { stockerId } = await params;

    if (!stockerId) {
      return NextResponse.json(
        { error: 'Stocker ID is required' },
        { status: 400 }
      );
    }

    // Get all orders for this stocker
    const orders = getOrdersForStocker(stockerId);

    // Sort by status and creation date
    const sortedOrders = orders
      .sort((a, b) => {
        // Prioritize by status: shopping > delivered > cancelled
        const statusOrder: Record<string, number> = { 
          shopping: 0, 
          delivered: 1, 
          cancelled: 2, 
          pending: 3, 
          confirmed: 4 
        };
        const aIndex = statusOrder[a.status] ?? 5;
        const bIndex = statusOrder[b.status] ?? 5;
        
        if (aIndex !== bIndex) {
          return aIndex - bIndex;
        }
        
        // Then by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .map(order => ({
        id: order.id,
        propertyId: order.propertyId,
        propertyName: order.propertyName || 'Property Name',
        propertyAddress: order.propertyAddress || 'Property Address',
        guestName: order.guestName || order.guestInfo?.name || 'Guest',
        checkInDate: order.checkInDate,
        numberOfGuests: order.numberOfGuests,
        items: Array.isArray(order.items) ? order.items : [],
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        completedAt: order.completedAt,
        stockingPhotos: order.stockingPhotos || [],
        notes: order.notes,
      }));

    return NextResponse.json({ orders: sortedOrders });
  } catch (error) {
    console.error('Failed to fetch stocker orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stocker orders' },
      { status: 500 }
    );
  }
}