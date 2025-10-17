import { Role } from '@prisma/client';
import { jwtVerify } from 'jose';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { SUPER_ADMIN_AUTH_LEVEL, USER_AUTH_LEVEL } from './constants';
import { TokenPayload } from './types/auth';

interface TokenData extends TokenPayload {
  exp: number;
  iat: number;
}

export const setToken = (token: string) => {
  Cookies.set('token', token, { expires: 1 });
};

export const removeToken = () => {
  Cookies.remove('token');
};

export const decodeToken = (token?: string | null) => {
  if (token === undefined || token === null || !token.length) return null;
  const decoded = jwtDecode<TokenData>(token);
  const { exp, iat, user, authLevel } = decoded;
  if (exp === undefined || iat === undefined || user === undefined || authLevel === undefined) {
    return null;
  }
  return { exp, iat, user, authLevel };
};

export const verifyTokenAuthLevel = async (targetAuthLevel: number, token?: string | null) => {
  if (token === undefined || token === null || !token.length) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    await jwtVerify(token, secret);
    const decoded = decodeToken(token);
    if (decoded === null) return false;
    if (targetAuthLevel >= SUPER_ADMIN_AUTH_LEVEL) return true;
    if (decoded.authLevel < targetAuthLevel) return false;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const verifyToken = async (token?: string | null, requiredAuthLevel?: number) => {
  if (token === undefined || token === null || !token.length) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    await jwtVerify(token, secret);
    const decoded = decodeToken(token);
    if (decoded === null) return false;
    if (requiredAuthLevel !== undefined && decoded.authLevel < requiredAuthLevel) return false;
    // Check expiry
    const now = Date.now() / 1000;
    const iatMin = now - 86400;
    if (decoded.iat < iatMin || decoded.exp < now) return false;
    // Check user id
    const resp = await fetch(`${process.env.NEXT_PUBLIC_APPLICATION_URL ?? ''}/api/internal/validate-user?userId=${decoded.user.id}`, {
      headers: { 'Next-Internal-API': '1' },
    });
    if (resp.status !== 200) return false;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const filterRoles = (roles: Role[], targetAuthLevel?: number) => {
  if (!targetAuthLevel || targetAuthLevel < USER_AUTH_LEVEL) return [];
  if (targetAuthLevel >= SUPER_ADMIN_AUTH_LEVEL) return roles;
  return roles.filter((r) => r.authLevel < targetAuthLevel);
};
