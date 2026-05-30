'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';
import useGetLookup from '@/app/hooks/useGetLookup';
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { Checkbox } from '@/components/ui/checkbox';

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

const FormSection = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
    <div className="border-b border-gray-100 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1 mt-1">
                <h2 className="text-sm font-semibold text-dark-gray">{title}</h2>
                <p className="text-xs text-medium-gray mt-1">{subtitle}</p>
            </div>
            <div className="md:col-span-2">
                {children}
            </div>
        </div>
    </div>
);

const FormField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <Label>
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {children}
    </div>
);
//     id,
//     label,
//     checked,
//     onChange,
// }: {
//     id: string;
//     label: string;
//     checked: boolean;
//     onChange: (checked: boolean) => void;
// }) => {
//     return (
//         <div className="flex items-center space-x-2">
//             <input
//                 type="checkbox"
//                 id={id}
//                 checked={checked}
//                 onChange={(e) => onChange(e.target.checked)}
//                 className="h-4 w-4 rounded border-[#F5F5F5] text-faded-accent focus:ring-faded-accent/50"
//             />
//             <label htmlFor={id} className="text-sm text-dark-gray cursor-pointer">
//                 {label}
//             </label>
//         </div>
//     );
// };

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
            <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={onChange}
            />
            <label htmlFor={id} className="text-sm text-dark-gray cursor-pointer">
                {label}
            </label>
        </div>
    );
};

export default function EditRolePage() {
    usePageMetadata('Role & Permission', 'Edit role permissions and details.');
    // const { usePermissionGuard } = usePermission();
    // usePermissionGuard('MANAGE_ROLES', {
    //     redirectToNotPermitted: true,
    //     toastMessage: "You don't have permission to manage roles"
    // });

    const router = useRouter();
    const searchParams = useSearchParams();
    const roleId = searchParams.get('id');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [status, setStatus] = useState<string>('ACTIVE');
    const [isFormInitialized, setIsFormInitialized] = useState(false);
    const isInitialLoad = useRef(true);

    const permissionOptions = useGetLookup('PERMISSION_CODE');

    const statusOptions = [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
    ];

    const { data: roleData, isLoading: isLoadingRole } = useQuery({
        queryKey: ['role-detail', roleId],
        queryFn: () =>
            axiosOperations.request({
                method: 'GET',
                url: '/role/getRoles',
                params: {
                    pageNumber: 1,
                    pageSize: 1000,
                },
            }).then(res => {
                const roles = res.data || [];
                return roles.find((r: Role) => r.id === Number(roleId)) || null;
            }),
        enabled: !!roleId,
    });

    const role: Role | null = roleData || null;

    useEffect(() => {
        if (role && permissionOptions && isInitialLoad.current && !isFormInitialized) {
            const validPermissions = (role.permissionCodes || []).filter(permissionId =>
                permissionOptions.some(permission => permission.id === permissionId)
            );
            setSelectedPermissions(validPermissions);
            setStatus(role.status || 'ACTIVE');
            setIsFormInitialized(true);
            isInitialLoad.current = false;
        }
    }, [role, permissionOptions, isFormInitialized]);

    const handlePermissionChange = (permissionId: string, isChecked: boolean) => {
        const newPermissions = isChecked
            ? [...selectedPermissions, permissionId]
            : selectedPermissions.filter(id => id !== permissionId);
        setSelectedPermissions(newPermissions);
    };

    const updateRoleMutation = useMutation({
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
                toast.error(data?.responseMessage || 'Failed to update role');
                return;
            }
            toast.success('Role updated successfully');
            router.push('/operations/roles');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Error updating role');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedPermissions.length === 0) {
            toast.error('At least one permission is required');
            return;
        }

        updateRoleMutation.mutate(selectedPermissions);
    };

    if (isLoadingRole) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-faded-accent/10 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-text animate-spin" />
                    </div>
                    <p className="text-medium-gray">Loading role data...</p>
                </div>
            </div>
        );
    }

    if (!role) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-medium-gray">Role not found</p>
                    <Button onClick={() => router.push('/operations/roles')} className="mt-4">
                        Back to Roles
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl">
                <div className="mb-4">
                    <Button variant="link" onClick={() => router.push('/operations/roles')}>
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </div>

                <div className='container mx-auto px-20 py-6'>
                    <div className="mb-6">
                        <h1 className="text-md lg:text-lg font-medium text-dark-gray">Edit Role</h1>
                        <p className="text-xs lg:text-sm font-normal text-medium-gray">Update role permissions and details</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className='bg-white px-6 py-4 rounded-2xl'>
                            <FormSection title="Role Information" subtitle="Role details and description.">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <FormField label="Role Code">
                                        <Input value={role.roleCode} disabled />
                                        <p className="text-xs text-medium-gray mt-1">Role code cannot be changed</p>
                                    </FormField>
                                    <FormField label="Role Name">
                                        <Input value={role.roleName} disabled />
                                        <p className="text-xs text-medium-gray mt-1">Role name cannot be changed</p>
                                    </FormField>
                                    <div className="col-span-2">
                                        <FormField label="Description">
                                            <Input value={role.roleDescription || ''} disabled />
                                            <p className="text-xs text-medium-gray mt-1">Description cannot be changed</p>
                                        </FormField>
                                    </div>
                                    <FormField label="Status" required>
                                        <Select value={status} onValueChange={setStatus}>
                                            <SelectTrigger>
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
                                    </FormField>
                                </div>
                            </FormSection>

                            <FormSection title="Permissions" subtitle={`Assign permissions to this role (${selectedPermissions.length} selected).`}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto"
                                    style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
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
                                        <p className="text-sm text-medium-gray col-span-full text-center py-4">
                                            No permissions available
                                        </p>
                                    )}
                                </div>
                                {selectedPermissions.length === 0 && (
                                    <p className="mt-2 text-xs text-red-500">
                                        At least one permission is required
                                    </p>
                                )}
                            </FormSection>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()} className="gap-2">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={updateRoleMutation.isPending || selectedPermissions.length === 0}>
                                {updateRoleMutation.isPending ? 'Updating...' : 'Update Role'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}