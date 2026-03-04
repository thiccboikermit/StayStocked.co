import { NextRequest, NextResponse } from 'next/server';

// TODO: Install and import Stripe
// import Stripe from 'stripe';

// TODO: Initialize Stripe with your secret key
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16',
// });

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'usd', metadata } = await req.json();

    // Validate the amount
    if (!amount || amount < 50) { // Stripe minimum is $0.50
      return NextResponse.json(
        { error: 'Amount must be at least $0.50' },
        { status: 400 }
      );
    }

    // TODO: Replace this with actual Stripe PaymentIntent creation
    /*
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        propertyId: metadata?.propertyId || '',
        guestId: metadata?.guestId || '',
        itemCount: metadata?.itemCount?.toString() || '0',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
    */

    // Temporary mock response for development
    const mockClientSecret = `pi_mock_${Date.now()}_secret_mock${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Mock PaymentIntent created:', {
      amount,
      currency,
      metadata,
      clientSecret: mockClientSecret
    });

    return NextResponse.json({
      clientSecret: mockClientSecret,
      paymentIntentId: `pi_mock_${Date.now()}`,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}