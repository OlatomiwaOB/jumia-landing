'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image'
import notPermitted from '@/components/images/notPermitted.png'

export default function NotPermittedPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [pageInfo, setPageInfo] = useState({
        page: ''
    });

    useEffect(() => {
        const page = searchParams.get('page') || 'previous';
        setPageInfo({ page });
    }, [searchParams]);

    const handleGoBack = () => {
        if (window.history.length > 1) {
            router.back();
            router.back()
        } else {
            router.push('/admin/dashboard');
        }
    };

    const formatPageName = (page: string) => {
        return page
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="relative max-w-xl w-full mx-4">
                <div className="relative">
                    <div className="">
                        <Image
                            src={notPermitted}
                            alt='not-permitted'
                            width={600}
                            height={600}
                            className=''
                        />
                    </div>

                    <div className="mb-6 flex items-center gap-3">
                        <p className="text-gray-600">
                            You don't have permission to access the
                        </p>
                        <p className="font-mono text-lg font-semibold text-accent">
                            {formatPageName(pageInfo.page)}
                        </p>
                        <p className="text-gray-600">
                            page.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handleGoBack}
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back 2 Steps
                        </Button>

                        <Link href="/admin/dashboard">
                            <Button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70">
                                <Home className="w-4 h-4" />
                                Return to Dashboard
                            </Button>
                        </Link>
                    </div>

                    <p className="mt-6 text-xs text-gray-400 dark:text-gray-600">
                        Need access? Contact your system administrator to request permissions.
                    </p>
                </div>
            </div>
        </div>
    );
}