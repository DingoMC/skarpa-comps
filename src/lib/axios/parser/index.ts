import { ParamAcceptable } from "../types";

abstract class URLParser {
  public abstract parse(url: string, params?: { [key: string]: ParamAcceptable } | ParamAcceptable[]): string;
}

export default URLParser;
