// app/rexpay-success/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RexpaySuccessPage() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const orderNo = searchParams.get('orderNo');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading order details
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Loading Order Details</h2>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <CardTitle className="text-2xl font-bold text-green-600">
                            Payment Successful!
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <p>Your order has been placed successfully.</p>
                        {orderNo && (
                            <p className="font-medium">
                                Order Number: <span className="text-accent">{orderNo}</span>
                            </p>
                        )}
                        <div className="space-y-2 pt-4">
                            <Button asChild className="w-full">
                                <Link href="/orders">View Orders</Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/">Continue Shopping</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <CardTitle className="text-2xl font-bold text-red-600">
                        Payment Failed
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p>There was an issue with your payment. Please try again.</p>
                    <div className="space-y-2 pt-4">
                        <Button asChild className="w-full">
                            <Link href="/checkout">Try Again</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/">Continue Shopping</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}