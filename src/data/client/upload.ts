import { API_ENDPOINTS } from './api-endpoints';
import { Attachment } from '@/types';
import axiosInstance from '@/utils/fetch-function';

export const uploadClient = {
  upload: async (variables: any) => {
    let formData = new FormData();
    variables.forEach((attachment: any) => {
      formData.append('file', attachment);
    });
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosInstance.post<Attachment>(
      API_ENDPOINTS.ATTACHMENTS,
      formData,
      options
    );
  },
};
 