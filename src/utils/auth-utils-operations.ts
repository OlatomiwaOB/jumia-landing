import Cookie from 'js-cookie';
import { parse } from 'cookie';
import {
  AUTH_CRED_OPERATIONS,
  OPERATIONS,
  PERMISSIONS_OPERATIONS,
  TOKEN_OPERATIONS
} from './constants';
import { toast } from 'sonner';

export const allowedRoles = [OPERATIONS];

export function setAuthCredentials(token: string, permissions: any) {
  Cookie.set(AUTH_CRED_OPERATIONS, JSON.stringify({ token, permissions }));
}

export function getAuthCredentials(context?: any): {
  token: string | null;
  permissions: string[] | null;
} {
  let authCred;
  if (context) {
    authCred = parseSSRCookie(context)[AUTH_CRED_OPERATIONS];
  } else {
    authCred = Cookie.get(AUTH_CRED_OPERATIONS);
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
  // console.log(_cookies[TOKEN_OPERATIONS]);
  // console.log(_cookies[PERMISSIONS_OPERATIONS]);
  return (
    !!_cookies[TOKEN_OPERATIONS] &&
    Array.isArray(_cookies[PERMISSIONS_OPERATIONS]) &&
    !!_cookies[PERMISSIONS_OPERATIONS].length
  );
}

export const logout = () => {
  // console.log('platform admin logout called');

  Cookie.remove(AUTH_CRED_OPERATIONS);
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('operations_store');
    window.localStorage.removeItem(TOKEN_OPERATIONS);
    window.location.reload();
  }
  toast.success('Logout successfully');
};
