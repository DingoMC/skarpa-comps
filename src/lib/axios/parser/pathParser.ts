import URLParser from '.';
import { ParamAcceptable } from '../types';

class URLPathParser extends URLParser {
  public parse(url: string, params?: { [key: string]: ParamAcceptable } | ParamAcceptable[]): string {
    if (!params) return url;
    if (Array.isArray(params)) {
      if (!params.length) return url;
      let newUrl = url;
      params.forEach((p, idx) => {
        if (typeof p === 'string') newUrl = newUrl.replace(`{${(idx + 1).toFixed(0)}}`, p);
        else if (typeof p === 'number') newUrl = newUrl.replace(`{${(idx + 1).toFixed(0)}}`, p.toFixed(0));
      });
      return newUrl;
    }
    let newUrl = url;
    Object.entries(params).forEach(([k, v]) => {
      if (typeof v === 'string') newUrl = newUrl.replace(`{${k}}`, v);
      else if (typeof v === 'number') newUrl = newUrl.replace(`{${k}}`, v.toFixed(0));
    });
    return newUrl;
  }
}

export default URLPathParser;
