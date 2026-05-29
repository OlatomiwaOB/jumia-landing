'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';

interface UserInfo {
    id: number;
    username: string;
    fullname: string;
    userRole: string;
}

interface ApproveUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserInfo | null;
}

export const ApproveUserModal: React.FC<ApproveUserModalProps> = ({ isOpen, onClose, user }) => {
    const [verifyStatus, setVerifyStatus] = useState<string>('');
    const [reviewComment, setReviewComment] = useState<string>('');
    const [otp, setOtp] = useState('');

    const approveUserMutation = useMutation({
        mutationFn: (payload: any) =>
            axiosOperations.post('/usermanager/authorizeUser', payload, { params: { otp } }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success(verifyStatus === 'Y' ? 'User approved successfully' : 'User rejected successfully');
                onClose();
                setVerifyStatus('');
                setReviewComment('');
                setOtp('');
            } else {
                toast.error(data?.data?.desc || 'Operation failed');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) { toast.error('Please enter a valid 6-digit OTP'); return; }
        if (verifyStatus === 'R' && !reviewComment) { toast.error('Review comment is required for rejection'); return; }
        approveUserMutation.mutate([{
            id: user?.id,
            verifyStatus,
            requestType: 'USER',
            referenceNo: user?.username,
            comment: reviewComment,
            otp,
        }]);
    };

    const isApproving = verifyStatus === 'Y';
    const isRejecting = verifyStatus === 'R';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                <DialogTitle className="sr-only">Approve User</DialogTitle>

                <div className="px-6 pt-4">
                    <h2 className="text-md font-bold text-dark-gray">Approve User</h2>
                    <p className="text-xs text-medium-gray mt-0.5">Approve or reject this user account</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-white rounded-2xl p-4 space-y-4">
                        {user && (
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                                    {user.fullname?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-dark-gray">{user.fullname}</p>
                                    <p className="text-xs text-medium-gray">{user.username} · {user.userRole}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label>Decision <span className='text-red-500'>*</span></Label>
                            <Select value={verifyStatus} onValueChange={setVerifyStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Y">Approve</SelectItem>
                                    <SelectItem value="R">Reject</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>OTP <span className='text-red-500'>*</span></Label>
                            <Input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                            />
                            <p className="text-xs text-medium-gray">{otp.length}/6 digits</p>
                        </div>

                        <div className="space-y-1.5">
                            <Label>
                                Review Comment {isRejecting && <span className="text-red-500">*</span>}
                            </Label>
                            <Textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder={isApproving
                                    ? "Add an optional note for approval..."
                                    : "Provide a reason for rejection..."}
                                rows={3}
                                maxLength={500}
                            />
                            <div className="flex justify-between text-xs text-medium-gray">
                                <span>{isRejecting ? 'Required for rejection' : 'Optional'}</span>
                                <span>{reviewComment.length}/500</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-1 justify-end">
                        <Button type="button" variant="outline" onClick={onClose} disabled={approveUserMutation.isPending}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={approveUserMutation.isPending || !verifyStatus || !otp}
                            className={`${isRejecting ? 'bg-red-600 hover:bg-red-700' : ''}`}
                        >
                            <CheckCircle className="w-4 h-4" />
                            {approveUserMutation.isPending ? 'Processing...' : isRejecting ? 'Reject User' : 'Approve User'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};