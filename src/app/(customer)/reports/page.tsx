
'use client';
import { usePageMetadata } from "@/hooks/usePageMetadata";

export default function ReportsPage() {
    usePageMetadata('Reports', 'Access and manage your reports');

    return (
        <div className="flex flex-col items-center justify-center py-16 mt-20 gap-3">
            <p className="text-2xl font-medium text-dark-gray">Coming Soon</p>
            <p className="text-sm text-medium-gray text-center max-w-[300px]">
                We're working hard to bring you a seamless way to access and manage your reports.
            </p>
        </div>
    );
}