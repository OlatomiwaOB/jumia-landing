import Cookie from 'js-cookie';
import { parse } from 'cookie';
import {
  AUTH_CRED_CUSTOMER,
  CUSTOMER,
  PERMISSIONS_CUSTOMER,
  TOKEN,
  TOKEN_CUSTOMER
} from './constants';
import { toast } from 'sonner';

export const allowedRoles = [CUSTOMER];

export function setAuthCredentials(token: string, permissions: any) {
  Cookie.set(AUTH_CRED_CUSTOMER, JSON.stringify({ token, permissions }));
}

export function getAuthCredentials(context?: any): {
  token: string | null;
  permissions: string[] | null;
} {
  let authCred;
  if (context) {
    authCred = parseSSRCookie(context)[AUTH_CRED_CUSTOMER];
  } else {
    authCred = Cookie.get(AUTH_CRED_CUSTOMER);
  }
  if (authCred) {
    return JSON.parse(authCred);
  }
  return { token: null, permissions: null };
}

export function parseSSRCookie(context: any) {
  return parse(context.req.headers.cookie ?? '');
}

export function hasAccess(
  _allowedRoles: string[],
  _userPermissions: string[] | undefined | null
) {
  if (_userPermissions) {
    return Boolean(
      _allowedRoles?.find((aRole) => _userPermissions.includes(aRole))
    );
  }
  return false;
}

export function isAuthenticated(_cookies: any) {
  // console.log(_cookies[TOKEN]);
  // console.log(_cookies[PERMISSIONS_CUSTOMER]);
  return (
    !!_cookies[TOKEN] &&
    Array.isArray(_cookies[PERMISSIONS_CUSTOMER]) &&
    !!_cookies[PERMISSIONS_CUSTOMER].length
  );
}

export const logout = () => {
  // console.log('logout called');

  Cookie.remove(AUTH_CRED_CUSTOMER);
  if (typeof window !== 'undefined') {
    // window.location.href = `/admin-login`;
    window.localStorage.removeItem('customer_store');
    window.localStorage.removeItem(TOKEN_CUSTOMER);
    window.location.reload();
  }
  toast.success('Logout successfully');
};
