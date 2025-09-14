/* eslint-disable @typescript-eslint/no-explicit-any */
// Returns request headers size in bytes (also includes Request Line)
export const calculateTxHeaderSize = (headers: { [key: string]: string }, url: string, method: string) => {
  let total = 0;
  // Add request line
  const requestLine = `${method.toUpperCase()} ${url} HTTP/1.1\r\n`;
  total += Buffer.byteLength(requestLine, 'utf8');
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(headers)) {
    // Each header line is: key + ": " + value + "\r\n"
    total += Buffer.byteLength(key, 'utf8');
    total += 2; // ": "
    total += Buffer.byteLength(value, 'utf8');
    total += 2; // "\r\n"
  }
  // Add final \r\n after headers
  total += 2;
  return total;
};

// Returns response headers size in bytes (also includes Response Line)
export const calculateRxHeaderSize = (headers: { [key: string]: string }, statusCode: string, statusMessage: string) => {
  let total = 0;
  // Status line: HTTP/1.1 200 OK\r\n
  const statusLine = `HTTP/1.1 ${statusCode} ${statusMessage}\r\n`;
  total += Buffer.byteLength(statusLine, 'utf8');
  // Headers
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(headers)) {
    total += Buffer.byteLength(key, 'utf8'); // key
    total += 2; // ": "
    total += Buffer.byteLength(value, 'utf8'); // value
    total += 2; // "\r\n"
  }
  // Final \r\n after headers
  total += 2;
  return total;
};

const estimateFormDataSize = (formData: FormData) => {
  let size = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const [name, value] of formData.entries()) {
    let fieldSize = 0;
    fieldSize += '--boundary\r\n'.length;
    fieldSize += `Content-Disposition: form-data; name="${name}"`.length;
    if (value instanceof File) {
      fieldSize += `; filename="${value.name}"\r\n`.length;
      fieldSize += `Content-Type: ${value.type}\r\n\r\n`.length;
      fieldSize += value.size;
    } else {
      fieldSize += '\r\n\r\n'.length;
      fieldSize += new TextEncoder().encode(value).length;
    }
    fieldSize += '\r\n'.length;
    size += fieldSize;
  }
  size += '--boundary--\r\n'.length; // closing boundary
  return size;
};

export const calculateDataSize = (data: any) => {
  if (typeof FormData !== 'undefined' && data instanceof FormData) {
    return estimateFormDataSize(data);
  }
  return (new TextEncoder().encode(JSON.stringify(data)).length);
};
