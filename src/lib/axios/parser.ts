import { C_AMP } from '../console';
import { ParamAcceptable } from './types';

export const parsePathParams = (url: string, pathParams?: { [key: string]: ParamAcceptable } | ParamAcceptable[]) => {
  if (!pathParams) return url;
  if (Array.isArray(pathParams)) {
    if (!pathParams.length) return url;
    let newUrl = url;
    pathParams.forEach((p, idx) => {
      if (typeof p === 'string') newUrl = newUrl.replace(`{${(idx + 1).toFixed(0)}}`, p);
      else if (typeof p === 'number') newUrl = newUrl.replace(`{${(idx + 1).toFixed(0)}}`, p.toFixed(0));
    });
    return newUrl;
  }
  let newUrl = url;
  Object.entries(pathParams).forEach(([k, v]) => {
    if (typeof v === 'string') newUrl = newUrl.replace(`{${k}}`, v);
    else if (typeof v === 'number') newUrl = newUrl.replace(`{${k}}`, v.toFixed(0));
  });
  return newUrl;
};

export const parseFullUrl = (url: string, params?: { [key: string]: ParamAcceptable }) => {
  let full = url;
  if (params && Object.values(params).filter((v) => v !== null && v !== undefined).length) {
    full += '?';
    full += Object.entries(params)
      .map(([k, v]) => {
        if (v === null || v === undefined) return null;
        if (typeof v === 'number') return `${k}=${v.toFixed(0)}`;
        return `${k}=${v}`;
      })
      .filter((v) => v !== null)
      .join(C_AMP);
  }
  return full;
};
