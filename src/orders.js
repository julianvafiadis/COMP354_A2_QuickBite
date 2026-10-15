import { randomUUID } from 'node:crypto';
import { restaurants } from './data.js';
import { ApiError } from './http.js';
import { getCart } from './cart.js';

export function pickupOptions(restaurantId, now = new Date()) {
    const restaurant = restaurants.find(
        (restaurant) => restaurant.id === restaurantId,
    );
    if (!restaurant) throw new ApiError('Restaurant not found.', 404);
    if (!restaurant.open) return [];
    const interval = 15 * 60 * 1000;
    const first =
        Math.ceil((now.getTime() + restaurant.pickupMinutes * 60000) / interval) *
        interval;
    return Array.from({ length: 8 }, (_, index) =>
        new Date(first + index * interval).toISOString(),
    );
}

export function validateCheckout(store, sessionId, input, now = new Date()) {
    const name =
        typeof input.customerName === 'string' ? input.customerName.trim() : '';
    const email =
        typeof input.customerEmail === 'string' ? input.customerEmail.trim() : '';
    if (name.length < 2 || name.length > 80)
        throw new ApiError('Enter a name between 2 and 80 characters.');
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw new ApiError('Enter a valid email address.');
    const cart = getCart(store, sessionId);
    if (!cart.items.length)
        throw new ApiError('Your bag is empty. Add an item first.');
    const restaurant = cart.restaurant;
    if (!restaurant?.open || cart.items.some((item) => !item.available))
        throw new ApiError(
            'An item or restaurant is no longer available. Update your bag.',
            409,
        );
    if (!pickupOptions(restaurant.id, now).includes(input.pickupAt))
        throw new ApiError('That pickup time has expired. Choose a current time.');
    return { cart, restaurant, name, email };
}

export function confirmOrder(store, sessionId, input, now = new Date()) {
    const { cart, restaurant, name, email } = validateCheckout(store, sessionId, input, now);
    const order = {
        id: randomUUID(),
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        address: restaurant.address,
        customerName: name,
        customerEmail: email,
        pickupAt: input.pickupAt,
        createdAt: now.toISOString(),
        status: 'Received',
        items: cart.items.map(({ id, name, priceCents, quantity }) => ({
            id,
            name,
            priceCents,
            quantity,
        })),
        totalCents: cart.totalCents,
    };
    const nextState = structuredClone(store.state);
    nextState.carts[sessionId] = [];
    nextState.orders.push(order);
    store.save(nextState);
    return order;
}
