// pages/operations/roles/assign-permissions.tsx
'use client'
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';
import useGetLookup from '@/app/hooks/useGetLookup';

interface Role {
    id: number;
    roleCode: string;
    roleName: string;
    roleDescription: string;
    status: string;
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
        <label className="flex items-center space-x-2 cursor-pointer">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="h-4 w-4 rounded border-accent/30 text-accent focus:ring-accent"
            />
            <span className="text-sm text-accent-foreground">{label}</span>
        </label>
    );
};

export default function AssignPermissionsPage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const permissionOptions = useGetLookup('PERMISSION_CODE');
    const statusOptions = useGetLookup('STATUS');

    // Fetch roles
    const { data: rolesData, isLoading: rolesLoading } = useQuery({
        queryKey: ['roles-for-assign'],
        queryFn: () =>
            axiosOperations.request({
                method: 'GET',
                url: '/role/getRoles',
                params: {
                    pageNumber: 1,
                    pageSize: 100,
                },
            }).then(res => res.data),
    });

    const roles: Role[] = rolesData?.data || [];

    // Fetch existing permissions for selected role
    const { data: rolePermissionsData, refetch: refetchPermissions } = useQuery({
        queryKey: ['role-permissions', selectedRole?.roleCode],
        queryFn: () =>
            axiosOperations.request({
                method: 'GET',
                url: '/rolePermission/getRolePermissions',
                params: {
                    roleCode: selectedRole?.roleCode,
                },
            }).then(res => res.data),
        enabled: !!selectedRole?.roleCode,
    });

    // Update selected permissions when role permissions are fetched
    useEffect(() => {
        if (rolePermissionsData?.data) {
            const permissions = rolePermissionsData.data.map((p: any) => p.permissionCode);
            setSelectedPermissions(permissions);
        } else if (selectedRole) {
            setSelectedPermissions([]);
        }
    }, [rolePermissionsData, selectedRole]);

    const handleRoleChange = (roleCode: string) => {
        const role = roles.find(r => r.roleCode === roleCode);
        setSelectedRole(role || null);
    };

    const handlePermissionChange = (permissionId: string, isChecked: boolean) => {
        if (isChecked) {
            setSelectedPermissions(prev => [...prev, permissionId]);
        } else {
            setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
        }
    };

    // Save permission mutation
    const savePermissionMutation = useMutation({
        mutationFn: (permissionCode: string) =>
            axiosOperations.request({
                method: 'POST',
                url: '/rolePermission/save',
                data: {
                    id: 0,
                    roleCode: selectedRole?.roleCode,
                    permissionCode,
                    status: 'ACTIVE',
                },
            }),
    });

    // Delete permission mutation
    const deletePermissionMutation = useMutation({
        mutationFn: (permissionCode: string) =>
            axiosOperations.request({
                method: 'POST',
                url: '/rolePermission/delete',
                data: {
                    roleCode: selectedRole?.roleCode,
                    permissionCode,
                },
            }),
    });

    const onSubmit = async () => {
        if (!selectedRole) {
            toast.error('Please select a role');
            return;
        }

        if (selectedPermissions.length === 0) {
            toast.error('Please select at least one permission');
            return;
        }

        setIsSubmitting(true);

        try {
            // Get existing permissions from API response
            const existingPermissions = rolePermissionsData?.data?.map((p: any) => p.permissionCode) || [];

            // Determine added and removed permissions
            const addedPermissions = selectedPermissions.filter(p => !existingPermissions.includes(p));
            const removedPermissions = existingPermissions.filter((p: string) => !selectedPermissions.includes(p));

            // Process additions
            const savePromises = addedPermissions.map(code => savePermissionMutation.mutateAsync(code));
            // Process removals
            const deletePromises = removedPermissions.map((code: string) => deletePermissionMutation.mutateAsync(code));

            await Promise.all([...savePromises, ...deletePromises]);

            toast.success('Permissions assigned successfully');
            router.back();
        } catch (error) {
            console.error('Error assigning permissions:', error);
            toast.error('Error assigning permissions');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6 max-w-4xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="hover:bg-accent/10"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-accent-foreground mb-2">
                            Assign Permissions
                        </h1>
                        <p className="text-accent-foreground/70">
                            Assign permissions to a user role
                        </p>
                    </div>
                </div>

                <Card className="border-accent/20 shadow-sm">
                    <CardHeader className="border-b border-accent/10">
                        <CardTitle className="text-lg font-semibold text-accent-foreground">
                            Permission Assignment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {/* Role Selection */}
                        <div className="space-y-2 mb-6">
                            <Label htmlFor="role" className="text-accent-foreground">
                                Select Role *
                            </Label>
                            <Select
                                value={selectedRole?.roleCode || ''}
                                onValueChange={handleRoleChange}
                            >
                                <SelectTrigger id="role" className="border-accent/20">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.roleCode}>
                                            {role.roleName} ({role.roleCode})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Permissions Section */}
                        {selectedRole && (
                            <div className="space-y-3 mt-6">
                                <Label className="text-accent-foreground font-medium">
                                    Permissions
                                </Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-accent/5 rounded-lg border border-accent/20 max-h-96 overflow-y-auto">
                                    {permissionOptions?.map((permission: any) => (
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
                                            Loading permissions...
                                        </p>
                                    )}
                                </div>
                                {selectedPermissions.length === 0 && (
                                    <p className="text-xs text-red-500">
                                        Please select at least one permission
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-accent/10">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="border-accent/20 hover:bg-accent/10"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={onSubmit}
                                disabled={!selectedRole || isSubmitting || selectedPermissions.length === 0}
                                className="bg-accent hover:bg-accent/90 text-white"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Permissions'
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}