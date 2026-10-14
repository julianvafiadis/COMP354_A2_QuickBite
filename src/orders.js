import { randomUUID } from 'node:crypto';

export function validateCheckout(cart, input) {
    const name = typeof input.customerName === 'string'
        ? input.customerName.trim()
        : '';
    const email = typeof input.customerEmail === 'string'
        ? input.customerEmail.trim()
        : '';
    if (name.length < 2) throw new Error('Enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw new Error('Enter a valid email address.');
    if (!cart.items.length) throw new Error('The cart is empty.');
    const pickup = new Date(input.pickupAt);
    if (!Number.isFinite(pickup.getTime()) || pickup <= new Date())
        throw new Error('Choose a future pickup time.');
    return {
        customerName: name,
        customerEmail: email,
        pickupAt: pickup.toISOString(),
    };
}

export function createOrder(store, cart, input) {
    const details = validateCheckout(cart, input);
    const order = {
        id: randomUUID(),
        ...details,
        items: structuredClone(cart.items),
        totalCents: cart.items.reduce(
            (total, item) => total + item.priceCents * item.quantity,
            0,
        ),
        status: 'Received',
    };
    const nextState = structuredClone(store.state);
    nextState.orders.push(order);
    store.save(nextState);
    return order;
}