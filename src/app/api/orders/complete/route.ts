import { NextRequest, NextResponse } from 'next/server';
import { completeOrderWithPhotos, getOrderById } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { orderId, stockerId, photoUrls } = await request.json();

    if (!orderId || !stockerId || !photoUrls || !Array.isArray(photoUrls)) {
      return NextResponse.json(
        { error: 'Order ID, stocker ID, and photo URLs are required' },
        { status: 400 }
      );
    }

    // Get the order to verify the stocker owns it
    const order = getOrderById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.stockerId !== stockerId) {
      return NextResponse.json(
        { error: 'Order is not assigned to this stocker' },
        { status: 403 }
      );
    }

    if (order.status !== 'shopping') {
      return NextResponse.json(
        { error: 'Order is not in progress' },
        { status: 400 }
      );
    }

    // Complete the order with photos
    const updatedOrder = completeOrderWithPhotos(orderId, photoUrls);
    
    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Failed to complete order' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      order: updatedOrder,
      message: 'Order completed successfully' 
    });
  } catch (error) {
    console.error('Failed to complete order:', error);
    return NextResponse.json(
      { error: 'Failed to complete order' },
      { status: 500 }
    );
  }
}