import { decodeToken, verifyToken } from '@/lib/auth';
import { sectionByPath, siteMapByPath } from '@/lib/siteMap';
import { NextRequest, NextResponse } from 'next/server';

export const middlewareRespond = (request: NextRequest, redirect: string | null) => {
  const response = redirect !== null ? NextResponse.redirect(new URL(redirect, request.url)) : NextResponse.next();
  return response;
};

// Replace dynamic fragments with `[id]`
export const clearDynamicRoute = (pathname: string) => pathname.replaceAll(/\/[0-9a-z]{25}/g, '/[id]');

export const getMiddlewareActions = async (request: NextRequest) => {
  const token = request.cookies.get('token')?.value;
  const hasToken = token !== undefined
  const tokenValid = await verifyToken(token);
  const decodedToken = decodeToken(token);
  const userLevel = decodedToken?.authLevel ?? null;
  const pathname = clearDynamicRoute(request.nextUrl.pathname);
  const section = sectionByPath.get(pathname);
  const page = siteMapByPath.get(pathname);
  let redirect: string | null;
  const canAccessSection = section.authLevel === undefined || section.authLevel(userLevel);
  const canAccessPage = page.authLevel === undefined || page.authLevel(userLevel);
  if (hasToken) {
    if (tokenValid) redirect = canAccessPage && canAccessSection ? null : '/';
    else redirect = '/logout';
  } else redirect = canAccessPage && canAccessSection ? null : '/';
  return { clear: !tokenValid, redirect };
};
