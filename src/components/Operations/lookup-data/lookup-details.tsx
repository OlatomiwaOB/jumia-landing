'use client'
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface LookupData {
    id: number;
    entityCode: string;
    countryCode: string;
    categoryCode: string;
    lookupCode: string;
    lookupName: string;
    lookupDesc: string;
    status: string;
    usageAccess: string;
}

interface LookupViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lookup: LookupData | null;
}

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
        case 'INACTIVE': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-0.5">
        <p className="text-xs text-medium-gray">{label}</p>
        <p className="text-xs font-semibold text-dark-gray">{value || 'N/A'}</p>
    </div>
);

export const LookupViewModal: React.FC<LookupViewModalProps> = ({ open, onOpenChange, lookup }) => {
    if (!lookup) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[100vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                <DialogTitle className="sr-only">Lookup Details</DialogTitle>

                <div className="px-6 pt-5 pb-4">
                    <h2 className="text-base font-semibold text-dark-gray mb-4">Lookup Details</h2>

                    <div className="bg-white rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[#F5F5F5]">
                            <p className="text-sm font-bold text-dark-gray">{lookup.lookupName}</p>
                            <Badge className={`text-xs px-3 py-0.5 border font-medium rounded-full ${getStatusColor(lookup.status)}`}>{lookup.status}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-x-6">
                            <Field label="Lookup Code" value={lookup.lookupCode} />
                            <Field label="Category Code" value={lookup.categoryCode} />
                            <Field label="Country Code" value={lookup.countryCode} />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-4">
                            <Field label="Usage Access" value={lookup.usageAccess} />
                        </div>
                        <div className="pt-3 border-t border-[#F5F5F5]">
                            <p className="text-xs text-medium-gray mb-1">Description</p>
                            <p className="text-sm text-dark-gray">{lookup.lookupDesc || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};