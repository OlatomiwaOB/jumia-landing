import Cookie from 'js-cookie';
import { parse } from 'cookie';
import {
  AUTH_CRED,
  BUSINESS_MANAGER,
  PERMISSIONS,
  STORE_OWNER,
  TOKEN,
} from './constants';
import { toast } from 'sonner';

export const allowedRoles = [BUSINESS_MANAGER];

export function setAuthCredentials(token: string, permissions: any) {
  Cookie.set(AUTH_CRED, JSON.stringify({ token, permissions }));
}

export function getAuthCredentials(context?: any): {
  token: string | null;
  permissions: string[] | null;
} {
  let authCred;
  if (context) {
    authCred = parseSSRCookie(context)[AUTH_CRED];
  } else {
    authCred = Cookie.get(AUTH_CRED);
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
  // console.log(_cookies[PERMISSIONS]);
  return (
    !!_cookies[TOKEN] &&
    Array.isArray(_cookies[PERMISSIONS]) &&
    !!_cookies[PERMISSIONS].length
  );
}

export const logout = () => {
  // console.log('logout called');

  Cookie.remove(AUTH_CRED);
  if (typeof window !== 'undefined') {
    window.location.href = `/admin-login`;
    window.localStorage.removeItem('token_store_admin');
    window.localStorage.removeItem('store_admin');
    window.localStorage.removeItem('user_store');
  }
  toast.success('Logout successfully');
};
