import axiosInstance from '@/utils/fetch-function';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface IdentityValidationPayload {
    entityId: string;
    idNo: string;
    idType: 'BVN' | 'NIN';
    firstname?: string;
    lastname?: string;
}

export const useValidateIdentity = () => {
    const mutation = useMutation({
        mutationFn: (payload: IdentityValidationPayload) => {
            return axiosInstance.request({
                url: 'verifyme/validate-identity',
                method: 'POST',
                data: payload,
            });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.responseMessage || 'An error occurred while validating identity');
        },
    });

    return {
        mutate: mutation.mutate,
        mutateAsync: mutation.mutateAsync,
        data: mutation.data,
        error: mutation.error,
        isPending: mutation.isPending,
        isError: mutation.isError,
        isSuccess: mutation.isSuccess,
        reset: mutation.reset,
    };
};