import { AxiosRequestLogData } from './types';

const SIZE_UNITS = ['B', 'kB', 'MB', 'GB', 'TB'];
const SPEED_UNITS = ['B/s', 'kB/s', 'MB/s', 'GB/s', 'TB/s'];
const MAX_UNIT_MULTIPLIER = 12.0;

const getStatusCodeColor = (statusCode: number) => {
  if ((statusCode >= 100 && statusCode <= 199) || statusCode === 9006) return '&3';
  if (statusCode >= 200 && statusCode <= 299) return '&a';
  if (statusCode >= 300 && statusCode <= 399) return '&7';
  if (statusCode >= 400 && statusCode <= 499) return '&4';
  if ((statusCode >= 500 && statusCode <= 599) || statusCode === 9005 || statusCode === 0) return '&c';
  return '&1';
};

const getReqTimeColor = (time: number) => {
  if (time < 270) return '&f';
  if (time < 387) return '&9';
  if (time < 504) return '&b';
  if (time < 738) return '&3';
  if (time < 1206) return '&a';
  if (time < 2142) return '&2';
  if (time < 4014) return '&6';
  if (time < 7758) return '&e';
  if (time < 15246) return '&4';
  return '&c';
};

const getHeaderSizeColor = (size: number) => {
  if (size < 27) return '&1';
  if (size < 479) return '&f';
  if (size < 931) return '&9';
  if (size < 1383) return '&b';
  if (size < 1835) return '&3';
  if (size < 2287) return '&a';
  if (size < 2739) return '&2';
  if (size < 3191) return '&6';
  if (size < 3643) return '&e';
  if (size < 4095) return '&4';
  return '&c';
};

const getDataSizeColor = (size: number) => {
  if (size < 2) return '&1';
  if (size < 9775) return '&f';
  if (size < 29325) return '&9';
  if (size < 68425) return '&b';
  if (size < 146625) return '&3';
  if (size < 303025) return '&a';
  if (size < 615825) return '&2';
  if (size < 1241425) return '&6';
  if (size < 2492625) return '&e';
  if (size < 4995025) return '&4';
  return '&c';
};

const getSpeedColor = (bps: number) => {
  if (bps <= 0) return '&1';
  if (bps > 500000) return '&f';
  if (bps > 200000) return '&9';
  if (bps > 100000) return '&b';
  if (bps > 50000) return '&3';
  if (bps > 20000) return '&a';
  if (bps > 10000) return '&2';
  if (bps > 5000) return '&6';
  if (bps > 2500) return '&e';
  if (bps > 1000) return '&4';
  return '&c';
};

export const getIPFromHeaders = (headers: Headers) => {
  let ip = headers.get('X-Original-Forwarded-For') || '';
  if (!ip.length) ip = headers.get('X-Forwarded-For') || '';
  return ip;
};

export const showAxiosStatus = (statusCode: number) => `&8[${getStatusCodeColor(statusCode)}${statusCode}&8]`;

const showAxiosTime = (ms: number) => {
  let tstr = getReqTimeColor(ms);
  if (ms < 1000) tstr += `${ms.toFixed(0)}ms`;
  else if (ms < 10000) tstr += `${(ms / 1000).toFixed(2)}s`;
  else tstr += `${(ms / 1000).toFixed(1)}s`;
  return tstr;
};

const showBytes = (bytes: number) => {
  if (bytes <= 0) return '0B';
  const logBytes = Math.floor(Math.log10(bytes));
  const divider = logBytes > MAX_UNIT_MULTIPLIER ? 10.0 ** MAX_UNIT_MULTIPLIER : 10.0 ** (3 * Math.floor(logBytes / 3));
  const unitIdx = Math.floor(logBytes / 3) > 4 ? 4 : Math.floor(logBytes / 3);
  let precision = 0;
  if (bytes >= 1000) {
    if (logBytes % 3 === 0) precision = 2;
    else if (logBytes % 3 === 1) precision = 1;
  }
  return `${(bytes / divider).toFixed(precision)}${SIZE_UNITS[unitIdx]}`;
};

const showSpeed = (data: AxiosRequestLogData) => {
  if (data.time <= 0) return '&1---';
  const bytesPerSec = (data.txBytes + data.txHeaderBytes + data.rxHeaderBytes + data.rxBytes) / (data.time * 0.001);
  const logBytes = Math.floor(Math.log10(bytesPerSec));
  const divider = logBytes > MAX_UNIT_MULTIPLIER ? 10.0 ** MAX_UNIT_MULTIPLIER : 10.0 ** (3 * Math.floor(logBytes / 3));
  const unitIdx = Math.floor(logBytes / 3) > 4 ? 4 : Math.floor(logBytes / 3);
  let precision = 0;
  if (bytesPerSec >= 1000) {
    if (logBytes % 3 === 0) precision = 2;
    else if (logBytes % 3 === 1) precision = 1;
  }
  return `${getSpeedColor(bytesPerSec)}${(bytesPerSec / divider).toFixed(precision)}${SPEED_UNITS[unitIdx]}`;
};

export const showReqInfo = (data: AxiosRequestLogData) =>
  `&8[&dt&5:${showAxiosTime(data.time)}&5, `
  + `&dTx&5:${getHeaderSizeColor(data.txHeaderBytes)}${showBytes(data.txHeaderBytes)}`
  + `&5+${getDataSizeColor(data.txBytes)}${showBytes(data.txBytes)}&5, `
  + `&dRx&5:${getHeaderSizeColor(data.rxHeaderBytes)}${showBytes(data.rxHeaderBytes)}`
  + `&5+${getDataSizeColor(data.rxBytes)}${showBytes(data.rxBytes)}&5, `
  + `&ds&5:${showSpeed(data)}&8]`;
