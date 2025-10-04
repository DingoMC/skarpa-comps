import { C_AMP } from '@/lib/console';
import URLParser from '.';
import { ParamAcceptable } from '../types';

class URLQueryParser extends URLParser {
  public parse(url: string, params?: { [key: string]: ParamAcceptable } | ParamAcceptable[]): string {
    let full = url;
    if (Array.isArray(params) && params.length) {
      full += '?';
      full += params
        .map((v, i) => {
          if (v === null || v === undefined) return null;
          if (typeof v === 'number') return `${(i + 1).toFixed(0)}=${v.toFixed(0)}`;
          return `${(i + 1).toFixed(0)}=${v}`;
        })
        .filter((v) => v !== null)
        .join(C_AMP);
    }
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
  }
}

export default URLQueryParser;
