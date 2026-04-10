import Cookie from 'js-cookie';
import { parse } from 'cookie';
import {
  AUTH_CRED_RIDERS,
  RIDERS,
  PERMISSIONS_RIDERS,
  TOKEN_RIDERS
} from './constants';
import { toast } from 'sonner';

export const allowedRoles = [RIDERS];

export function setAuthCredentials(token: string, permissions: any) {
  Cookie.set(AUTH_CRED_RIDERS, JSON.stringify({ token, permissions }));
}

export function getAuthCredentials(context?: any): {
  token: string | null;
  permissions: string[] | null;
} {
  let authCred;
  if (context) {
    authCred = parseSSRCookie(context)[AUTH_CRED_RIDERS];
  } else {
    authCred = Cookie.get(AUTH_CRED_RIDERS);
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
//   console.log(_cookies[TOKEN_RIDERS]);
//   console.log(_cookies[PERMISSIONS_RIDERS]);
  return (
    !!_cookies[TOKEN_RIDERS] &&
    Array.isArray(_cookies[PERMISSIONS_RIDERS]) &&
    !!_cookies[PERMISSIONS_RIDERS].length
  );
}

export const logout = () => {
//   console.log('riders logout called');

  Cookie.remove(AUTH_CRED_RIDERS);
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('riders_store');
    window.localStorage.removeItem(TOKEN_RIDERS);
    window.location.reload();
  }
  toast.success('Logout successfully');
};
