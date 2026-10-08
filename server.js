import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ApiError, sendJson } from './src/http.js';
import { listRestaurants } from './src/restaurants.js';

const publicFolder = fileURLToPath(new URL('./public', import.meta.url));
const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
};

export function createApp() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      const route = url.pathname;
      const method = request.method;
      if (!route.startsWith('/api/')) {
        if (method !== 'GET' && method !== 'HEAD')
          throw new ApiError('Method not allowed.', 405);
        const filename =
          route === '/' ? 'index.html' : decodeURIComponent(route).slice(1);
        const target = path.resolve(publicFolder, filename);
        const type = contentTypes[path.extname(target)];
        if (!target.startsWith(publicFolder + path.sep) || !type)
          throw new ApiError('File not found.', 404);
        const content = await readFile(target);
        response.writeHead(200, {
          'Content-Type': type + '; charset=utf-8',
          'X-Content-Type-Options': 'nosniff',
        });
        response.end(method === 'HEAD' ? undefined : content);
        return;
      }

      if (method !== 'GET' || route !== '/api/restaurants')
        throw new ApiError('API endpoint not found.', 404);
      sendJson(response, 200, { restaurants: listRestaurants() });
    } catch (error) {
      const status = error.status || (error.code === 'ENOENT' ? 404 : 500);
      if (status === 500) console.error(error);
      sendJson(response, status, {
        error:
          status === 500
            ? 'Something went wrong. Please try again.'
            : error.message,
      });
    }
  });
  return { server };
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const port = Number(process.env.PORT || 3000);
  createApp().server.listen(port, '127.0.0.1', () =>
    console.log(`QuickBite is ready at http://localhost:${port}`),
  );
}

