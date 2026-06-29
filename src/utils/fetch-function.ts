import axios, { AxiosError } from 'axios';
import { logout } from './auth-utils';

import { getClientIdentifiers } from '@/config/client-config';

const sourceCode = getClientIdentifiers()
console.log("SOURCE CODE", sourceCode)


const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_REACT_APP_API_URL ??
    'https://corestack.app/mmcp/api/v1',
  headers: {
    'x-source-code': sourceCode?.sourceCode,
    'x-client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
    'x-client-secret': process.env.NEXT_PUBLIC_CLIENT_SECRET
  },
});
async function getSessionToken() {
  const token = window.localStorage.getItem('token_store_admin');
  if (token) {
    return token;
  }
}
async function getToken() {
  if (typeof window !== 'undefined' && window.localStorage.getItem('token_store_admin')) {
    const storedSession = window.localStorage.getItem('token_store_admin');
    return storedSession ? storedSession : await getSessionToken();
  }
  return null;
}

axiosInstance.interceptors.request.use(async function (config) {
  const token = await getToken();

  if (token && !config.url?.includes('admin-login')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error: AxiosError) {
    if (error.response?.request.responseURL?.includes('admin-login')) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      logout();
    } else {
      return Promise.reject(error);
    }
  }
);
export default axiosInstance;
