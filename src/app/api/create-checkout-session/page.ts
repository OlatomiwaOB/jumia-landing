// pages/api/create-checkout-session.js (or your Express/Next route)
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET!);

export default async function POST(request: NextRequest) {
    const { amount, currency } = await request.json();

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency,
                    unit_amount: amount, // in smallest unit e.g. kobo/cents
                    product_data: { name: 'Payment' },
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled`,
    });

    return NextResponse.json({ url: session.url });
}