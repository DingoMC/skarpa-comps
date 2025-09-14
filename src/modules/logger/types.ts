export interface AxiosRequestLogData {
  url: string;
  method: string;
  statusCode: number;
  time: number;
  rxHeaderBytes: number;
  txHeaderBytes: number;
  rxBytes: number;
  txBytes: number;
}
