import { C_ACC, C_ACK, C_BLK, C_CALL, C_FWD, C_MDFWD, C_MIDWR, C_RDR, C_REQ, CConsole } from '@/lib/console';

const getIP = (headers: Headers) => {
  let ip = headers.get('X-Original-Forwarded-For') || '';
  if (!ip.length) ip = headers.get('X-Forwarded-For') || '';
  return ip;
};

const shouldIgnoreLog = (headers: Headers) => {
  return headers.get('Next-URL') !== null;
};

export const logCallRequest = (url: string, headers: Headers) => {
  if (shouldIgnoreLog(headers)) return;
  const logger = CConsole.getInstance();
  logger.displayF(`${logger.timestamp()}${C_MIDWR}${C_CALL} &2${getIP(headers)} ${C_REQ} &3${url}`);
};

export const logACKRedirect = (url: string, headers: Headers, redirect: string) => {
  if (shouldIgnoreLog(headers)) return;
  const logger = CConsole.getInstance();
  logger.displayF(`${logger.timestamp()}${C_MIDWR}${C_ACK} &2${getIP(headers)} ${C_BLK} &9${url} ${C_RDR} &3${redirect}`);
};

export const logACKAccess = (url: string, headers: Headers) => {
  if (shouldIgnoreLog(headers)) return;
  const logger = CConsole.getInstance();
  logger.displayF(`${logger.timestamp()}${C_MIDWR}${C_ACK} &2${getIP(headers)} ${C_ACC} &3${url}`);
};

export const logACKForward = (url: string, headers: Headers) => {
  if (shouldIgnoreLog(headers)) return;
  const logger = CConsole.getInstance();
  logger.displayF(`${logger.timestamp()}${C_MIDWR}${C_FWD} &2${getIP(headers)} ${C_MDFWD} &3${url}`);
};
