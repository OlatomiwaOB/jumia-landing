import axios, { AxiosError } from 'axios';


const axiosCustomer = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_REACT_APP_API_URL ??
    'https://corestack.app/mmcp/api/v1',
  headers: {
    'x-source-code': process.env.NEXT_PUBLIC_SOURCE_CODE || 'FORTITUDE',
    'x-client-id': process.env.NEXT_PUBLIC_CLIENT_ID || 'TST03054745785188010772',
    'x-client-secret': process.env.NEXT_PUBLIC_CLIENT_SECRET || 'TST03722175625334233555707073458615741827171811840881'
  },
});

export default axiosCustomer;
