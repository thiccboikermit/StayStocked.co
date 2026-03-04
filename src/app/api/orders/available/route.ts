import { NextResponse } from 'next/server';
import { getAvailableOrdersForStockers } from '../../../../lib/auth';

export async function GET() {
  try {
    // Get all available orders for stockers
    const availableOrders = getAvailableOrdersForStockers();

    // Sort by creation date (newest first) and add some basic property info
    const sortedOrders = availableOrders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(order => ({
        id: order.id,
        propertyId: order.propertyId,
        propertyName: order.propertyName || 'Property Name',
        propertyAddress: order.propertyAddress || 'Property Address',
        guestName: order.guestName,
        checkInDate: order.checkInDate,
        numberOfGuests: order.numberOfGuests,
        items: Array.isArray(order.items) ? order.items : [],
        total: order.total,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery,
        notes: order.notes,
      }));

    return NextResponse.json({ orders: sortedOrders });
  } catch (error) {
    console.error('Failed to fetch available orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available orders' },
      { status: 500 }
    );
  }
}