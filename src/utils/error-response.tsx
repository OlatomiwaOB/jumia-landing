// import { toast } from 'react-toastify';
// import { logout } from './auth-utils';

import { toast } from "sonner";


export const errorResponse = function (error: any) {
  if (error.response?.status === 403 || error.response?.data?.desc === 'E18') {
    // toast.error('Token expired!, Logging you out');
    // setTimeout(() => {
    //   logout();
    // }, 5000);
  } else if (error.response?.status === 500) {
    toast.error('Internal Server Error');
  } else if (error.response?.data?.desc) {
    toast.error(error.response.data?.desc);
  } else if (error.response?.data?.error) {
    toast.error(error.response.data?.error);
  } else if (error.message === 'Network Error') {
    toast.error(error.message);
  } else if (TypeError()) {
    return;
  } else {
    toast.error(error.message);
  }
};
