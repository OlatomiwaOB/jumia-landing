// components/Operations/subscriptions/subscription-view.tsx
'use client'
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface SubscriptionFeature {
    featureCode: string;
    name: string;
    value: string;
}

interface SubscriptionPlan {
    id: number;
    tierCode: string;
    name: string;
    description: string;
    subscriptionType: string;
    amount: number;
    currencyCode: string;
    status: string;
    features: SubscriptionFeature[];
}

interface SubscriptionPlanViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plan: SubscriptionPlan | null;
}

const getTierColor = (tierCode: string): string => {
    switch (tierCode?.toUpperCase()) {
        case 'BASIC': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'STANDARD': return 'bg-green-100 text-green-700 border-green-200';
        case 'PREMIUM': return 'bg-purple-100 text-purple-700 border-purple-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const getTypeColor = (type: string): string => {
    switch (type?.toUpperCase()) {
        case 'YEARLY': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'WEEKLY': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'MONTHLY': return 'bg-blue-100 text-blue-700 border-blue-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
        case 'INACTIVE': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const formatCurrency = (amount: number): string => {
    return `₦${(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
};

const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-0.5">
        <p className="text-xs text-medium-gray">{label}</p>
        <p className="text-xs font-semibold text-dark-gray">{value || 'N/A'}</p>
    </div>
);

export const SubscriptionPlanViewModal: React.FC<SubscriptionPlanViewModalProps> = ({ open, onOpenChange, plan }) => {
    if (!plan) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[100vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                <DialogTitle className="sr-only">Subscription Plan Details</DialogTitle>

                <div className="px-6 pt-5 pb-4">
                    <h2 className="text-base font-semibold text-dark-gray mb-4">Subscription Plan Details</h2>

                    {/* Summary Card */}
                    <div className="bg-white rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[#F5F5F5]">
                            <div>
                                <p className="text-sm font-bold text-dark-gray">{plan.name}</p>
                            </div>
                            <Badge className={`text-xs px-3 py-0.5 border font-medium rounded-full ml-auto ${getStatusColor(plan.status)}`}>{plan.status}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-x-6">
                            <Field label="Tier" value={plan.tierCode} />
                            <Field label="Type" value={plan.subscriptionType} />
                            <Field label="Amount" value={formatCurrency(plan.amount)} />
                            <Field label="Features" value={`${plan.features?.length || 0}`} />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-2xl p-4 mb-4">
                        <p className="text-sm font-semibold text-dark-gray mb-2">Description</p>
                        <p className="text-sm text-dark-gray">{plan.description || 'N/A'}</p>
                    </div>

                    {/* Features */}
                    <div className="bg-white rounded-2xl p-4">
                        <p className="text-sm font-semibold text-dark-gray mb-3">Features ({plan.features?.length || 0})</p>
                        {plan.features && plan.features.length > 0 ? (
                            <div className="space-y-2">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-xs font-medium text-dark-gray">{feature.name}</p>
                                            <p className="text-[10px] text-medium-gray">{feature.featureCode}</p>
                                        </div>
                                        <span className={`text-xs font-medium ${feature.value === 'YES' || feature.value === 'UNLIMITED' ? 'text-green-600' :
                                            feature.value === 'NO' ? 'text-red-600' : 'text-dark-gray'
                                            }`}>
                                            {feature.value === 'YES' ? (
                                                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                            ) : feature.value === 'NO' ? (
                                                <XCircle className="w-3.5 h-3.5 text-red-600" />
                                            ) : (
                                                feature.value
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-medium-gray text-center py-4">No features configured</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};