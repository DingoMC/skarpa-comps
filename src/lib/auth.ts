import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from './types/auth';

interface TokenData extends TokenPayload {
  exp: number;
  iat: number;
}

export const decodeToken = (token?: string | null) => {
  if (token === undefined || token === null || !token.length) return null;
  const decoded = jwtDecode<TokenData>(token);
  const { exp, iat, user, authLevel } = decoded;
  if (exp === undefined || iat === undefined || user === undefined || authLevel === undefined) {
    return null;
  }
  return { exp, iat, user, authLevel };
};

export const verifyToken = async (token?: string | null) => {
  if (token === undefined || token === null || !token.length) return false;
  try {
    jwt.verify(token, process.env.JWT_SECRET as string, { complete: true });
    const decoded = decodeToken(token);
    if (decoded === null) return false;
    // Check expiry
    const now = Date.now() / 1000;
    const iatMin = now - 86400;
    if (decoded.iat < iatMin || decoded.exp < now) return false;
    // Check user id
    await fetch(`/api/internal/validate-user?userId=${decoded.user.id}`, { headers: { 'Next-Internal-API': '1' } });
    return true;
  } catch {
    return false;
  }
};
