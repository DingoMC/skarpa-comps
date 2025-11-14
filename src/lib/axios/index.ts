import axios, { AxiosError, ResponseType } from 'axios';
import { calculateDataSize, calculateRxHeaderSize, calculateTxHeaderSize } from './bytes';
import { LoggerObject, ParamAcceptable } from './types';
import URLQueryParser from './parser/queryParser';
import URLPathParser from './parser/pathParser';

const DEFAULT_TIMEOUT = 60000;

const callLoggerAPI = async (data: LoggerObject) => {
  const { url, method, startTime, statusCode, rxHeaderBytes, txHeaderBytes, rxBytes, txBytes } = data;
  const end = new Date().getTime();
  const time = end - startTime;
  try {
    await axios.post(
      '/api/internal/logger',
      {
        url,
        method,
        time,
        statusCode,
        txHeaderBytes,
        rxHeaderBytes,
        rxBytes,
        txBytes,
      },
      {
        headers: {
          'Next-Internal-API': '1',
        },
      }
    );
  } catch (error) {
    // Log error
  }
};

interface AxiosRequestOptions {
  /**
   * Request URL
   */
  url: string;
  /**
   * HTTP Method
   * @default 'GET'
   */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /**
   * Request Body
   * @default undefined
   */
  data?: any;
  /**
   * Include `Authorization` header token
   * @default undefined
   */
  authorization?: string;
  /**
   * Time in `ms` after which request is canceled
   * @default 60000
   */
  requestTimeout?: number;
  /**
   * Custom Request Headers object
   * @default undefined
   */
  customHeaders?: { [key: string]: string };
  /**
   * URL Query Params. Values which are null, empty or undefined will be ignored.
   * For example `{a: 1, b: 2}` will convert to `?a=1&b=2`
   * @default undefined
   */
  params?: { [key: string]: ParamAcceptable };
  /**
   * URL Path Params. Can be either passed as a key-value object or array of values.
   * Object example: `{a: 'yes', b: 12}`, URL format: `/foo/{a}/bar/{b}`.
   * Array example: `['yes', 12]`, URL format: `/foo/{1}/bar/{2}`.
   * @default undefined
   */
  pathParams?: { [key: string]: ParamAcceptable } | ParamAcceptable[];
  /**
   * Response type. It is autodetected by default
   * @default undefined
   */
  responseType?: ResponseType;
  /**
   * Function which triggers when request is successful
   * @param _data Response data
   * @param _httpCode HTTP status code
   * @default undefined
   */
  onSuccess?: (_data: any, _httpCode: number) => void;
  /**
   * Function which triggers when request has failed. This includes 4xx and 5xx errors
   * @param _err AxiosError object
   */
  onError?: (_err: AxiosError) => void;
}

/**
 * Axios Request Wrapper
 * @param param0 Request options
 * @returns `error` - AxiosError if errored, `data` - response data, `code` - HTTP Status Code
 */
export default async function axiosRequest({
  url,
  method,
  data,
  authorization,
  requestTimeout,
  customHeaders,
  responseType,
  params,
  pathParams,
  onError,
  onSuccess,
}: AxiosRequestOptions) {
  const startTime = new Date().getTime();
  const headers: { [key: string]: string } = {};
  const rMethod = method || 'GET';
  const queryParser = new URLQueryParser();
  const pathParser = new URLPathParser();
  if (authorization && authorization.length) headers.Authorization = authorization;
  if (customHeaders) {
    Object.entries(customHeaders).forEach(([k, v]) => {
      headers[k] = v;
    });
  }
  const loggerObject: LoggerObject = {
    url: queryParser.parse(pathParser.parse(url, pathParams), params),
    method: rMethod,
    statusCode: 0,
    startTime,
    txBytes: data ? calculateDataSize(data) : 0,
    rxBytes: 0,
    txHeaderBytes: calculateTxHeaderSize(headers, queryParser.parse(pathParser.parse(url, pathParams), params), rMethod),
    rxHeaderBytes: 0,
  };
  try {
    const response = await axios({
      url: pathParser.parse(url, pathParams),
      method: rMethod,
      data,
      timeout: requestTimeout ?? DEFAULT_TIMEOUT,
      headers,
      params,
      responseType,
      transformResponse: responseType === 'text' ? [(v) => v] : undefined,
    });
    loggerObject.rxHeaderBytes = calculateRxHeaderSize(
      response.headers as { [key: string]: string },
      response.status.toFixed(0),
      response.statusText
    );
    loggerObject.rxBytes = response.data ? calculateDataSize(response.data) : 0;
    if (onSuccess !== undefined) onSuccess(response.data, response.status);
    loggerObject.statusCode = response.status;
    await callLoggerAPI({ ...loggerObject });
    return { error: null, data: response.data, code: response.status };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      loggerObject.statusCode = error.response?.status ?? 0;
      if (error.response) {
        loggerObject.rxHeaderBytes = calculateRxHeaderSize(
          error.response.headers as { [key: string]: string },
          error.response.status.toFixed(0),
          error.response.statusText
        );
        if (error.response.data) loggerObject.rxBytes = calculateDataSize(error.response.data);
      }
      if (onError !== undefined) onError(error);
      await callLoggerAPI({ ...loggerObject });
      return { error, data: error.response?.data ?? null, code: error.response?.status ?? 0 };
    }
    await callLoggerAPI({ ...loggerObject });
    return { error: new AxiosError(`Unknown error: ${JSON.stringify(error)}`), data: null, code: 0 };
  }
}
