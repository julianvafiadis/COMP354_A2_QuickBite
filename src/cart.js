import { restaurants, menuItems } from './data.js';
import { ApiError } from './http.js';

export function getCart(store, sessionId) {
  const lines = store.state.carts[sessionId] || [];
  const items = lines.map((line) => {
    const item = menuItems.find((item) => item.id === line.itemId);
    return {
      ...item,
      quantity: line.quantity,
      lineTotalCents: item.priceCents * line.quantity,
    };
  });
  const restaurant =
    restaurants.find(
      (restaurant) => restaurant.id === items[0]?.restaurantId,
    ) || null;
  return {
    restaurant,
    items,
    totalCents: items.reduce((total, item) => total + item.lineTotalCents, 0),
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
  };
}

export function addItem(store, sessionId, itemId, quantity = 1) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20)
    throw new ApiError('Choose a quantity from 1 to 20.');
  const item = menuItems.find((item) => item.id === itemId);
  if (!item) throw new ApiError('Menu item not found.', 404);
  const restaurant = restaurants.find(
    (restaurant) => restaurant.id === item.restaurantId,
  );
  if (!item.available || !restaurant.open)
    throw new ApiError('This item is unavailable.', 409);
  const cart = getCart(store, sessionId);
  if (cart.restaurant && cart.restaurant.id !== restaurant.id)
    throw new ApiError(
      'Your bag belongs to another restaurant. Empty it before switching.',
      409,
    );
  const existing = cart.items.find((item) => item.id === itemId);
  const nextQuantity = (existing?.quantity || 0) + quantity;
  const lines = store.state.carts[sessionId] || [];
  if (!existing) {
    const nextState = structuredClone(store.state);
    nextState.carts[sessionId] = [...lines, { itemId, quantity }];
    store.save(nextState);
    return getCart(store, sessionId);
  }
  return setQuantity(store, sessionId, itemId, nextQuantity);
}

export function setQuantity(store, sessionId, itemId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 20)
    throw new ApiError('Quantity must be a whole number from 0 to 20.');
  const nextState = structuredClone(store.state);
  const lines = nextState.carts[sessionId] || [];
  const item = lines.find((line) => line.itemId === itemId);
  if (!item) throw new ApiError('This item is not in your bag.', 404);
  item.quantity = quantity;
  nextState.carts[sessionId] = lines.filter((line) => line.quantity > 0);
  store.save(nextState);
  return getCart(store, sessionId);
}

export function clearCart(store, sessionId) {
  const nextState = structuredClone(store.state);
  nextState.carts[sessionId] = [];
  store.save(nextState);
  return getCart(store, sessionId);
}
