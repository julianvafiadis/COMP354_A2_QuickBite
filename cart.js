import { menuItems } from './data.js';

const carts = new Map();

export function getCart(sessionId) {
  const items = carts.get(sessionId) || [];
  const totalCents = items.reduce(
    (total, item) => total + item.priceCents * item.quantity,
    0,
  );
  return { items, totalCents };
}

export function addItem(sessionId, itemId) {
  const item = menuItems.find((item) => item.id === itemId);
  if (!item || !item.available) throw new Error('Item not available.');
  const items = carts.get(sessionId) || [];
  if (items.length && items[0].restaurantId !== item.restaurantId)
    throw new Error('Choose items from one restaurant.');
  const existing = items.find((line) => line.id === itemId);
  if (existing) existing.quantity += 1;
  else items.push({ ...item, quantity: 1 });
  carts.set(sessionId, items);
  return getCart(sessionId);
}

export function removeItem(sessionId, itemId) {
  const items = getCart(sessionId).items.filter((item) => item.id !== itemId);
  carts.set(sessionId, items);
  return getCart(sessionId);
}
