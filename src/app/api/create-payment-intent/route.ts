import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET!);

        const { amount, currency } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }

        const amountInCents = Math.round(amount * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: (currency || 'usd').toLowerCase(),
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err: any) {
        console.error('Stripe PaymentIntent error:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to create payment intent' },
            { status: 500 }
        );
    }
}