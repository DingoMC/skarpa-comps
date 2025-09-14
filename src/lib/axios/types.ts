export type ParamAcceptable = string | number | null | undefined;

export type HTTPMethod = 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH';

export type LoggerObject = {
  url: string,
  method: HTTPMethod,
  statusCode: number,
  startTime: number,
  txHeaderBytes: number,
  rxHeaderBytes: number,
  txBytes: number,
  rxBytes: number,
};
