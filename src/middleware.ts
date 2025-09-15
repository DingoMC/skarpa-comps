import Cookies from 'js-cookie';
import { NextRequest } from 'next/server';
import { getMiddlewareActions, middlewareRespond } from './modules/middleware/access';
import { logACKAccess, logACKRedirect, logCallRequest } from './modules/middleware/log';

export async function middleware(request: NextRequest) {
  logCallRequest(request.nextUrl.pathname, request.headers);
  // logout should work always to clear data
  if (request.nextUrl.pathname === '/logout') {
    logACKAccess(request.nextUrl.pathname, request.headers);
    return middlewareRespond(request, null);
  }
  const { clear, redirect } = await getMiddlewareActions(request);
  // Log action
  if (redirect !== null) logACKRedirect(request.nextUrl.pathname, request.headers, redirect);
  else logACKAccess(request.nextUrl.pathname, request.headers);
  // Should we clear cookies
  if (clear) {
    Cookies.remove('token');
    request.cookies.clear();
  }
  // Send response
  return middlewareRespond(request, redirect);
}

export const config = {
  matcher: [
    {
      source: '/((?!api|public|images/*|_next/static|_next/image|static|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
