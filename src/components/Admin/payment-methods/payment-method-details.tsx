'use client'
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Star } from 'lucide-react';
import { PaymentMethod } from '@/types';

interface PaymentMethodViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    method: PaymentMethod | null;
}

const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-0.5">
        <p className="text-xs text-medium-gray">{label}</p>
        <p className="text-xs truncate font-semibold text-dark-gray">{value || 'N/A'}</p>
    </div>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl p-4 space-y-4">
        <p className="text-sm font-semibold text-dark-gray">{title}</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </div>
);

export const PaymentMethodViewModal: React.FC<PaymentMethodViewModalProps> = ({ open, onOpenChange, method }) => {
    if (!method) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[100vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                <DialogTitle className="sr-only">Payment Method Details</DialogTitle>

                <div className="px-6 pt-5 pb-4">
                    <h2 className="text-base font-semibold text-dark-gray mb-4">Payment Method Details</h2>

                    <div className="bg-white rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[#F5F5F5]">
                            <div className="w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center p-2 border border-gray-200">
                                {method.logo ? (
                                    <img src={method.logo} alt={method.name} className="w-full h-full object-contain" />
                                ) : (
                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-dark-gray flex items-center gap-1.5">
                                    {method.name}
                                    {method.isRecommended && <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />}
                                </p>
                                <p className="text-xs text-medium-gray font-mono">{method.code}</p>
                            </div>
                            <Badge className={`text-xs px-3 py-0.5 border font-medium rounded-full ml-auto ${method.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                {method.status}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-x-6">
                            <Field label="Payment Type" value={method.paymentType?.replace(/_/g, " ")} />
                            <Field label="Service Provider" value={method.serviceProvider?.replace(/_/g, " ")} />
                            <Field label="Country" value={method.country} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SectionCard title="Fee Details">
                                <Field label="Fee" value={method.feeType === 'PERCENT' ? `${method.fee}%` : `₦${method.fee}`} />
                                <Field label="Fee Type" value={method.feeType} />
                                <Field label="Cap Limit" value={`₦${method.capLimit}`} />
                            </SectionCard>

                            <SectionCard title="Display Information">
                                <Field label="Description" value={method.description} />
                                <Field label="Subtitle" value={method.subTitle} />
                                {method.isRecommended && <Field label="Recommended Title" value={method.recommendedTitle || ''} />}
                            </SectionCard>
                        </div>

                        {method.features && method.features.length > 0 && (
                            <div className="bg-white rounded-2xl p-4">
                                <p className="text-sm font-semibold text-dark-gray mb-3">Features</p>
                                <div className="flex flex-wrap gap-2">
                                    {method.features.map((feature, idx) => (
                                        <Badge key={idx} className="text-xs px-3 py-1 bg-[#E9CCF4] text-[#9200C7] border border-gray-200 rounded-full">
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};