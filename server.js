import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { ApiError, readJson, sendJson } from './src/http.js';
import { createStore } from './src/store.js';
import { getMenu } from './src/menu.js';
import { getCart, addItem, setQuantity, clearCart } from './src/cart.js';
import { pickupOptions, confirmOrder } from './src/orders.js';
import { listRestaurants } from './src/restaurants.js';

const publicFolder = fileURLToPath(new URL('./public', import.meta.url));
const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
};

export function createApp({
  dataPath = process.env.DATA_PATH || 'data/quickbite.json',
} = {}) {
  const store = createStore(dataPath);
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

      const cookie = request.headers.cookie
        ?.split(';')
        .map((value) => value.trim())
        .find((value) => value.startsWith('qb_session='));
      let sessionId = cookie?.slice('qb_session='.length);
      if (!/^[a-f0-9-]{36}$/.test(sessionId || '')) {
        sessionId = randomUUID();
        response.setHeader(
          'Set-Cookie',
          `qb_session=${sessionId}; HttpOnly; SameSite=Lax; Path=/`,
        );
      }
      const origin = request.headers.origin;
      if (
        method !== 'GET' && origin &&
        origin !== `http://${request.headers.host}`
      ) throw new ApiError('Requests must come from QuickBite.', 403);
      const body = method === 'POST' || method === 'PATCH'
        ? await readJson(request)
        : {};
      const menuMatch = route.match(/^\/api\/restaurants\/([^/]+)\/menu$/);
      const itemMatch = route.match(/^\/api\/cart\/items\/([^/]+)$/);
      let result;
      if (method === 'GET' && route === '/api/restaurants')
        result = { restaurants: listRestaurants() };
      else if (method === 'GET' && menuMatch)
        result = getMenu(menuMatch[1]);
      else if (method === 'GET' && route === '/api/cart')
        result = getCart(store, sessionId);
      else if (method === 'POST' && route === '/api/cart/items')
        result = addItem(store, sessionId, body.itemId, body.quantity ?? 1);
      else if (method === 'PATCH' && itemMatch)
        result = setQuantity(store, sessionId, itemMatch[1], body.quantity);
      else if (method === 'DELETE' && itemMatch)
        result = setQuantity(store, sessionId, itemMatch[1], 0);
      else if (method === 'DELETE' && route === '/api/cart')
        result = clearCart(store, sessionId);
      else if (method === 'GET' && route === '/api/pickup-options')
        result = { pickupOptions: pickupOptions(url.searchParams.get('restaurantId')) };
      else if (method === 'POST' && route === '/api/orders')
        result = { order: confirmOrder(store, sessionId, body) };
      else throw new ApiError('API endpoint not found.', 404);
      sendJson(response, method === 'POST' && route === '/api/orders' ? 201 : 200, result);
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
  return { server, store };
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