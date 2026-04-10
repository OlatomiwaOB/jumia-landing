import { NextRequest, NextResponse } from 'next/server';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { encodeURL, findReference, validateTransfer } from '@solana/pay';
import BigNumber from 'bignumber.js';


async function generateUrl(
  recipient: PublicKey,
  amount: BigNumber,
  reference: PublicKey,
  label: string,
  message: string,
  memo: string,
) {
  const url: URL = encodeURL({
    recipient,
    amount,
    reference,
    label,
    message,
    memo,
  });
  return { url };
}

const paymentRequests = new Map<string, { recipient: PublicKey; amount: BigNumber; memo: string }>();

// CONSTANTS
const myWallet = '36fSLvzoUZ8QihDGRwJTMBZX6NaPP5Fm1vrK3w9F1RRB'; // Replace with your wallet address
const recipient = new PublicKey(myWallet);
const amount = new BigNumber(0.001); // 0.0001 SOL
const label = 'Help2Pay Ecommerce Store';
const memo = 'You have a pending order on H2P store';
const quicknodeEndpoint = 'https://soft-frequent-season.solana-devnet.quiknode.pro/35b6f19eaf9d6820960220b7c764c9893d18a0e4/'; // Replace with your QuickNode endpoint


async function verifyTransaction(reference: PublicKey) {
  // 1 - Check that the payment request exists
  const paymentData = paymentRequests.get(reference.toBase58());
  if (!paymentData) {
    throw new Error('Payment request not found');
  }
  const { recipient, amount, memo } = paymentData;
  
  // 2 - Establish a Connection to the Solana Cluster
  const connection = new Connection(quicknodeEndpoint, 'confirmed');
  console.log('recipient', recipient.toBase58());
  console.log('amount', amount);
  console.log('reference', reference.toBase58());
  console.log('memo', memo);

  // 3 - Find the transaction reference
  const found = await findReference(connection, reference);
  console.log(found.signature);

  // 4 - Validate the transaction
  const response = await validateTransfer(
    connection,
    found.signature,
    {
      recipient,
      amount,
      splToken: undefined,
      reference,
      //memo
    },
    { commitment: 'confirmed' }
  );
  
  // 5 - Delete the payment request from local storage and return the response
  if (response) {
    paymentRequests.delete(reference.toBase58());
  }
  return response;
}

// Handle POST requests - Generate Payment
export async function POST(req: NextRequest) {
  try {
    // Your payment generation logic here
    const reference = new Keypair().publicKey;
    const message = `QuickNode Demo - Order ID #0${Math.floor(Math.random() * 999999) + 1}`;
    const urlData = await generateUrl(
      recipient,
      amount,
      reference,
      label,
      message,
      memo
    );

    const ref = reference.toBase58();
    paymentRequests.set(ref, { recipient, amount, memo });
    const { url } = urlData;
    
    return NextResponse.json({
      success: true,
      url: url?.toString(),
      ref
    }, { status: 200 });
  } catch (error) {
    console.error('Error generating payment:', error);
    return NextResponse.json(
      { error: 'Failed to generate payment' },
      { status: 500 }
    );
  }
}

// Handle GET requests - Verify Payment
export async function GET(req: NextRequest) {
  try {
    // Get reference from URL search params
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');
    
    if (!reference) {
      return NextResponse.json(
        { error: 'Missing reference query parameter' },
        { status: 400 }
      );
    }

    // Verify the transaction
    const referencePublicKey = new PublicKey(reference);
    const response = await verifyTransaction(referencePublicKey);
    
    if (response) {
      return NextResponse.json(
        { status: 'verified' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { status: 'not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}