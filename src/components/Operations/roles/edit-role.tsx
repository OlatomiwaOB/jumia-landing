'use client'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import useGetLookup from '@/app/hooks/useGetLookup';

interface Permission {
    id: string;
    name: string;
}

interface Role {
    id: number;
    roleCode: string;
    roleName: string;
    roleDescription: string;
    status: string;
    permissionCodes?: string[];
}

interface RoleEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: Role | null;
    onSuccess: () => void;
}

const PermissionCheckbox = ({
    id,
    label,
    checked,
    onChange,
}: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) => {
    return (
        <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label}
            </label>
        </div>
    );
};

export default function RoleEditModal({ open, onOpenChange, role, onSuccess }: RoleEditModalProps) {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<string>('');
    const isInitialLoad = useRef(true);

    const permissionOptions = useGetLookup('PERMISSION_CODE');
    const statusOptions = [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
    ]

    useEffect(() => {
        if (role && open && permissionOptions && isInitialLoad.current) {
            const validPermissions = (role.permissionCodes || []).filter(permissionId =>
                permissionOptions.some(permission => permission.id === permissionId)
            );
            setSelectedPermissions(validPermissions);
            setStatus(role.status || 'ACTIVE');
            isInitialLoad.current = false;
        }

        if (!open) {
            isInitialLoad.current = true;
        }
    }, [role, open, permissionOptions]);

    const updateRolePermissionsMutation = useMutation({
        mutationFn: (permissionCodes: string[]) => {
            return axiosOperations.request({
                method: 'POST',
                url: '/role/save',
                data: {
                    id: role?.id,
                    roleCode: role?.roleCode,
                    roleName: role?.roleName,
                    roleDescription: role?.roleDescription,
                    permissionCodes: permissionCodes,
                    status: status,
                },
            });
        },
        onSuccess: (data: any) => {
            if (data?.responseCode && data.responseCode !== '000') {
                toast.error(data?.responseMessage || 'Failed to update permissions');
                throw new Error(data?.responseMessage);
            }
            toast.success('Permissions updated successfully');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error updating permissions');
        }
    });

    const handlePermissionChange = (permissionId: string, isChecked: boolean) => {
        const newPermissions = isChecked
            ? [...selectedPermissions, permissionId]
            : selectedPermissions.filter(id => id !== permissionId);
        setSelectedPermissions(newPermissions);
    };

    const handleSubmit = async () => {
        if (selectedPermissions.length === 0) {
            toast.error('At least one permission is required');
            return;
        }

        const initialPermissions = role?.permissionCodes || [];
        const hasChanges =
            selectedPermissions.length !== initialPermissions.length ||
            selectedPermissions.some(p => !initialPermissions.includes(p)) ||
            initialPermissions.some(p => !selectedPermissions.includes(p));

        if (!hasChanges && status === (role?.status || 'ACTIVE')) {
            toast.info('No changes to save');
            onOpenChange(false);
            return;
        }

        setIsSubmitting(true);

        try {
            await updateRolePermissionsMutation.mutateAsync(selectedPermissions);

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Error updating permissions:', error);
            toast.error('Error updating permissions');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!role) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-accent-foreground">
                        Edit Role Permissions
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
                        <div>
                            <p className="text-xs text-accent-foreground/70">Role Code</p>
                            <p className="text-md font-semibold text-accent-foreground font-mono">
                                {role.roleCode}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-accent-foreground/70">Role Name</p>
                            <p className="text-md font-semibold text-accent-foreground">
                                {role.roleName}
                            </p>
                        </div>
                    </div>

                    {role.roleDescription && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-accent-foreground mb-2">Description</h3>
                            <p className="text-sm text-accent-foreground/80 p-3 bg-accent/5 rounded-lg border border-accent/20">
                                {role.roleDescription}
                            </p>
                        </div>
                    )}

                    <div className="mb-6">
                        <Label className="text-sm font-semibold text-accent-foreground">
                            Status
                        </Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm font-semibold text-accent-foreground">
                            Permissions ({selectedPermissions.length} selected)
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4 p-4 bg-accent/5 rounded-lg border border-accent/20 max-h-64 overflow-y-auto">
                            {permissionOptions?.map((permission: Permission) => (
                                <PermissionCheckbox
                                    key={permission.id}
                                    id={`permission-${permission.id}`}
                                    label={permission.name}
                                    checked={selectedPermissions.includes(permission.id)}
                                    onChange={(checked) => handlePermissionChange(permission.id, checked)}
                                />
                            ))}
                            {(!permissionOptions || permissionOptions.length === 0) && (
                                <p className="text-sm text-accent-foreground/50 col-span-full text-center py-4">
                                    No permissions available
                                </p>
                            )}
                        </div>
                        {selectedPermissions.length === 0 && (
                            <p className="mt-1 text-xs text-red-500">
                                At least one permission is required
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end pt-4 mt-4 border-t border-accent/10">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="mr-4"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || selectedPermissions.length === 0}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Permissions'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}