'use server'
import {Stripe} from 'stripe'
// create stripe checkout session
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,{
    apiVersion: '2025-07-30.basil',
    typescript: true
})
export async function createCheckoutSession(
    email: string,
    priceId: string,
    user_id: string,
    subscription_type: string
  ) {
   
    return JSON.stringify(
      await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_URL}/successPage`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/premium`,
        customer_email: email,
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: {
          user_id,
          subscription_type,
        },
        mode: 'payment',
        subscription_data:{
            metadata:{
                user_id,
                subscription_type
            }
        }
      })
    );
  }