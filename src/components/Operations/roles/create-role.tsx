'use client'
import { useForm, Controller } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';
import useGetLookup from '@/app/hooks/useGetLookup';

interface CreateRoleFormData {
    roleCode: string;
    roleName: string;
    roleDescription: string;
    status: string;
}

interface CreateRoleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function CreateRoleModal({ open, onOpenChange, onSuccess }: CreateRoleModalProps) {
    const statusOptions = useGetLookup('STATUS');

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<CreateRoleFormData>({
        defaultValues: {
            roleCode: '',
            roleName: '',
            roleDescription: '',
            status: '',
        },
    });

    const { mutate: createRole, isPending } = useMutation({
        mutationFn: (formData: CreateRoleFormData) =>
            axiosOperations.request({
                method: 'POST',
                url: '/role/save',
                data: {
                    id: 0,
                    roleCode: formData.roleCode,
                    roleName: formData.roleName,
                    roleDescription: formData.roleDescription,
                    status: formData.status,
                },
            }),
        onSuccess: (response) => {
            if (response?.data?.responseCode !== '000') {
                toast.error(response?.data?.responseMessage || 'Failed to create role');
                return;
            }
            toast.success('Role created successfully');
            reset();
            onOpenChange(false);
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Error creating role');
        },
    });

    const onSubmit = (data: CreateRoleFormData) => {
        createRole(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-accent-foreground">Create New Role</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="roleCode" className="text-accent-foreground">
                                Role Code *
                            </Label>
                            <Input
                                id="roleCode"
                                {...register('roleCode', { required: 'Role code is required' })}
                                placeholder="Enter role code (e.g., ADMIN, MANAGER)"
                                className="border-accent/20 focus:border-accent"
                            />
                            {errors.roleCode && (
                                <p className="text-xs text-red-500">{errors.roleCode.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="roleName" className="text-accent-foreground">
                                Role Name *
                            </Label>
                            <Input
                                id="roleName"
                                {...register('roleName', { required: 'Role name is required' })}
                                placeholder="Enter role name"
                                className="border-accent/20 focus:border-accent"
                            />
                            {errors.roleName && (
                                <p className="text-xs text-red-500">{errors.roleName.message}</p>
                            )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="roleDescription" className="text-accent-foreground">
                                Role Description
                            </Label>
                            <Textarea
                                id="roleDescription"
                                {...register('roleDescription')}
                                placeholder="Enter role description"
                                rows={3}
                                className="border-accent/20 focus:border-accent"
                            />
                        </div>

                        {/* <div className="space-y-2">
                            <Label htmlFor="status" className="text-accent-foreground">
                                Status *
                            </Label>
                            <Controller
                                control={control}
                                name="status"
                                rules={{ required: 'Status is required' }}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id="status" className="border-accent/20">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions?.map((option: any) => (
                                                <SelectItem key={option.id} value={option.id}>
                                                    {option.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.status && (
                                <p className="text-xs text-red-500">{errors.status.message}</p>
                            )}
                        </div> */}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-accent/10">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-accent/20 hover:bg-accent/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-accent hover:bg-accent/90 text-white"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Role'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}