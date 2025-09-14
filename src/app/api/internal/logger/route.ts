import { C_AXIOS, CConsole } from '@/lib/console';
import { AxiosRequestLogData } from '@/modules/logger/types';
import { getIPFromHeaders, showAxiosStatus, showReqInfo } from '@/modules/logger/utils';

export async function POST(request: Request) {
  if (request.headers.get('Next-Internal-API') !== '1') return Response.json({ message: 'Not logged' }, { status: 200 });
  const rawData = await request.json();
  const { url, method, statusCode } = rawData as AxiosRequestLogData;
  const log =
    `${CConsole.timestamp()}${C_AXIOS}${showAxiosStatus(statusCode)}${showReqInfo(rawData as AxiosRequestLogData)} `
    + `&2${getIPFromHeaders(request.headers)} &d-> &5${method} &3${url}`;
  CConsole.displayF(log);
  return Response.json({ message: 'OK' }, { status: 200 });
}
