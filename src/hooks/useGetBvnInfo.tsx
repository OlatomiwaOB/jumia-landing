import axiosInstance from '@/utils/fetch-function';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const entityCode = process.env.NEXT_PUBLIC_ENTITY_CODE || 'H2P'

export const useGetBvnInfo = () => {
  const mutation = useMutation({
    mutationFn: (bvn: string) => {
      return axiosInstance.request({
        url: `verifyme/identity?entityId=${entityCode}&bvn=${bvn}`,
        method: 'POST',
      });
    },
    onError: () => {
      toast.error('An error occurred while validating BVN');
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