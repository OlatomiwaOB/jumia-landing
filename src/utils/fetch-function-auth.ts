import axios, { AxiosError } from 'axios';
import { logout } from './auth-utils';
import { getClientIdentifiers } from '@/config/client-config';

const sourceCode = getClientIdentifiers().sourceCode
const axiosInstanceNoAuth = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_REACT_APP_API_URL ??
    'https://corestack.app/mmcp/api/v1',
  headers: {
    'x-source-code': sourceCode,
    'x-client-id': process.env.NEXT_PUBLIC_CLIENT_ID || 'TST03054745785188010772',
    'x-client-secret': process.env.NEXT_PUBLIC_CLIENT_SECRET || 'TST03722175625334233555707073458615741827171811840881'
  },
});

export default axiosInstanceNoAuth