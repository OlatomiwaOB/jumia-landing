import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import { errorResponse } from '@/utils/error-response';

export const useHandleImageUpload = () => {
  const formData = new FormData();
  const mutateFile = useMutation({
    mutationFn: async ({ image, fileType }: { image: File; fileType?: string }) => {
      if (image) formData.append('image', image);
      if (fileType) formData.append('fileType', fileType);
      const response = await axiosInstance.post(
        'fileuploadservice/uploadfile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-source-code': 'MMCP',
            'x-client-id': 'TST03054745785188010772',
            'x-client-secret':
              'TST03722175625334233555707073458615741827171811840881',
          },
        }
      );
      return response;
    },
    onError: (error) => errorResponse(error),
  });
  return mutateFile;
};


