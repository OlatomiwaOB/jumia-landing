import axios, { AxiosError } from 'axios';
import { logout } from './auth-utils-riders';

const axiosRiders = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_REACT_APP_API_URL ??
    'https://corestack.app/mmcp/api/v1',
  headers: {
    'x-source-code': process.env.NEXT_PUBLIC_SOURCE_CODE || 'HELP2PAY',
    'x-client-id': process.env.NEXT_PUBLIC_CLIENT_ID || 'TST03054745785188010772',
    'x-client-secret': process.env.NEXT_PUBLIC_CLIENT_SECRET || 'TST03722175625334233555707073458615741827171811840881'
  },
});
async function getSessionToken() {
  const token = window.localStorage.getItem('token_riders');
  if (token) {
    return token;
  }
}
async function getToken() {
  if (typeof window !== 'undefined' && window.localStorage.getItem('token_riders')) {
    const storedSession = window.localStorage.getItem('token_riders');
    return storedSession ? storedSession : await getSessionToken();
  }
  return null;
}

axiosRiders.interceptors.request.use(async function (config) {
  const token = await getToken();

  if (token && !config.url?.includes('token_riders')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosRiders.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error: AxiosError) {
    if (error.response?.request.responseURL?.includes('token_riders')) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      logout();
    } else {
      return Promise.reject(error);
    }
  }
);
export default axiosRiders;
