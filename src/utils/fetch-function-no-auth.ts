import axios, { AxiosError } from 'axios';
import { getClientIdentifiers } from '@/config/client-config';

const sourceCode = getClientIdentifiers()
console.log("SOURCE CODE", sourceCode)

const axiosCustomer = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_REACT_APP_API_URL ??
    'https://corestack.app/mmcp/api/v1',
  headers: {
    'x-source-code': sourceCode?.sourceCode,
    'x-client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
    'x-client-secret': process.env.NEXT_PUBLIC_CLIENT_SECRET
  },
});

export default axiosCustomer;
