import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, assignOrderToStocker } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { orderId, stockerId } = await request.json();

    if (!orderId || !stockerId) {
      return NextResponse.json(
        { error: 'Order ID and stocker ID are required' },
        { status: 400 }
      );
    }

    // Get the order to verify it's available for claiming
    const order = getOrderById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.status !== 'confirmed' || order.stockerId) {
      return NextResponse.json(
        { error: 'Order is not available for claiming' },
        { status: 400 }
      );
    }

    // Assign the order to the stocker
    const updatedOrder = assignOrderToStocker(orderId, stockerId);
    
    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Failed to claim order' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      order: updatedOrder,
      message: 'Order successfully claimed' 
    });
  } catch (error) {
    console.error('Failed to claim order:', error);
    return NextResponse.json(
      { error: 'Failed to claim order' },
      { status: 500 }
    );
  }
}