'use client';
import ReportForm from '@/components/Admin/reports/report-form';
import React from 'react';

export default function ReportsPage(): React.ReactElement {
    return (
        <div className='flex flex-col h-full bg-gray-50/50 min-h-screen'>
            <div className="p-6">
                <ReportForm />
            </div>
        </div>
    );
}