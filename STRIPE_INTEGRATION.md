# Stripe Integration Guide

This checkout page has been prepared for Stripe payment integration. Follow these steps to complete the integration:

## 1. Install Stripe Dependencies

```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

## 2. Environment Variables

Add these environment variables to your `.env.local`:

```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 3. Update the API Route

In `src/app/api/create-payment-intent/route.ts`:

1. Uncomment the Stripe imports and initialization
2. Uncomment the actual PaymentIntent creation code
3. Remove the mock response section
4. Add your actual Stripe secret key from environment variables

## 4. Create Stripe Elements Component

Create `src/components/StripeCheckoutForm.tsx`:

```tsx
'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

interface Props {
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

export default function StripeCheckoutForm({ onPaymentSuccess, onPaymentError }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      onPaymentError(error.message || 'Payment failed');
    } else {
      onPaymentSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        disabled={!stripe || isLoading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 mt-4"
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
```

## 5. Update the Checkout Page

In the checkout page (`src/app/shop/[slug]/checkout/page.tsx`):

1. Add Stripe imports at the top:
```tsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from '../../../../components/StripeCheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
```

2. Replace the placeholder Stripe Elements section with:
```tsx
<Elements stripe={stripePromise} options={{ clientSecret }}>
  <StripeCheckoutForm
    onPaymentSuccess={() => {
      // Handle successful payment
      console.log('Payment successful');
    }}
    onPaymentError={(error) => {
      setPaymentError(error);
    }}
  />
</Elements>
```

3. Update the `handlePlaceOrder` function to properly handle Stripe payment confirmation.

## 6. Webhook Handling (Optional but Recommended)

Create `src/app/api/webhooks/stripe/route.ts` to handle Stripe webhooks:

```tsx
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Update order status in your database
      // updateOrderStatus(paymentIntent.metadata.orderId, 'paid');
      break;
    
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object);
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
```

## 7. Environment Variables for Next.js

Make sure your environment variables are properly prefixed:
- Client-side variables: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Server-side variables: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

## 8. Testing

Use Stripe's test card numbers:
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- Requires 3D Secure: `4000 0025 0000 3155`

## Current Implementation Status

✅ **Completed:**
- Payment method selection UI
- PaymentIntent creation API endpoint (mock)
- Error handling and loading states
- Order processing flow
- Payment state management

🔄 **Ready for Implementation:**
- Stripe Elements integration (placeholder ready)
- Actual payment processing
- Webhook handling
- Production deployment

The current implementation uses mock responses so you can test the UI flow. Once you add your Stripe keys and complete the integration steps above, it will process real payments.

## Security Notes

- Never expose your Stripe secret key in client-side code
- Always validate payments server-side via webhooks
- Use HTTPS in production
- Implement proper error handling and retry logic