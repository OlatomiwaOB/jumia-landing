'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Link2 } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import useOperations from '@/store/operationsStore';
import { toast } from 'sonner';

interface UserInfo {
    id: number;
    username: string;
    fullname: string;
    email: string;
    mobileNo: string;
    userRole: string;
    status: string;
}

interface LinkUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-0.5">
        <p className="text-xs text-medium-gray">{label}</p>
        <p className="text-sm font-semibold text-dark-gray">{value || 'N/A'}</p>
    </div>
);

export const LinkUserModal: React.FC<LinkUserModalProps> = ({ isOpen, onClose }) => {
    const { operations } = useOperations();
    const [selectedUsername, setSelectedUsername] = useState('');
    const [comment, setComment] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);

    const { data: usersData, isLoading: isLoadingUsers } = useQuery({
        queryKey: ['available-users'],
        queryFn: () => axiosOperations.request({
            url: '/usermanager/getUserMasterList',
            method: 'GET',
            params: { pageNumber: 1, pageSize: 50, name: '', role: '', mobileNo: '' }
        }),
        enabled: isOpen
    });

    const users: UserInfo[] = usersData?.data?.userInfoList || [];

    const linkUserMutation = useMutation({
        mutationFn: (linkData: any) => axiosOperations.post('/usermanager/linkstaffstore', linkData),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('User linked successfully');
                onClose();
                setSelectedUsername('');
                setComment('');
                setSelectedUser(null);
            } else {
                toast.error(data?.data?.desc || 'Failed to link user');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to link user');
        }
    });

    const handleUsernameChange = (username: string) => {
        setSelectedUsername(username);
        const user = users.find(u => u.username === username);
        setSelectedUser(user || null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUsername) { toast.error('Please select a username'); return; }
        linkUserMutation.mutate({
            username: selectedUsername,
            storeCode: operations?.storeCode || '',
            merchantCode: operations?.merchantCode || '',
            merchantGroupCode: operations?.merchantGroupCode || '',
            entityCode: operations?.entityCode || '',
            comment,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-white p-0 gap-0">
                <DialogTitle className="sr-only">Link Existing User</DialogTitle>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-base font-bold text-dark-gray">Link Existing User</h2>
                        <p className="text-xs text-medium-gray mt-0.5">Link an existing user to your store</p>
                    </div>
                    <button onClick={onClose} className="text-medium-gray hover:text-dark-gray transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs text-medium-gray">Username *</Label>
                            <Select value={selectedUsername} onValueChange={handleUsernameChange}>
                                <SelectTrigger className="bg-white border-gray-200 rounded-xl h-10">
                                    <SelectValue placeholder="Select username" />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingUsers ? (
                                        <SelectItem value="loading" disabled>Loading users...</SelectItem>
                                    ) : users.length === 0 ? (
                                        <SelectItem value="no-users" disabled>No users found</SelectItem>
                                    ) : (
                                        users.map((user) => (
                                            <SelectItem key={user.id} value={user.username}>
                                                {user.username} — {user.fullname}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs text-medium-gray">Full Name</Label>
                            <Input
                                value={selectedUser?.fullname || ''}
                                disabled
                                placeholder="Full name will appear here"
                                className="bg-white border-gray-200 rounded-xl h-10 text-dark-gray"
                            />
                        </div>

                        {selectedUser && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-1 border-t border-gray-200">
                                <Field label="Email" value={selectedUser.email} />
                                <Field label="Phone" value={selectedUser.mobileNo} />
                                <Field label="Role" value={selectedUser.userRole} />
                                <Field label="Status" value={selectedUser.status} />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label className="text-xs text-medium-gray">Comment <span className="text-gray-400">(optional)</span></Label>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add any comments about this user linkage..."
                                rows={3}
                                className="bg-white border-gray-200 rounded-xl resize-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                        <Button type="button" variant="outline" onClick={onClose} disabled={linkUserMutation.isPending} className="flex-1 rounded-xl border-gray-200">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={linkUserMutation.isPending || !selectedUsername} className="flex-1 rounded-xl gap-2">
                            <Link2 className="w-4 h-4" />
                            {linkUserMutation.isPending ? 'Linking...' : 'Link User'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};