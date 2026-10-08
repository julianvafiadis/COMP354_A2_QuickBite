export class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export function sendJson(response, status, data) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(data));
}

export async function readJson(request) {
  if (!request.headers['content-type']?.startsWith('application/json'))
    throw new ApiError('Use application/json.', 415);
  let text = '';
  for await (const chunk of request) {
    text += chunk;
    if (Buffer.byteLength(text) > 16384)
      throw new ApiError('Request is too large.', 413);
  }
  try {
    const body = JSON.parse(text);
    if (!body || Array.isArray(body) || typeof body !== 'object')
      throw new Error();
    return body;
  } catch {
    throw new ApiError('Provide a valid JSON object.');
  }
}
