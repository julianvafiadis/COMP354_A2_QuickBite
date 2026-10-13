import { restaurants, menuItems } from './data.js';

export function getMenu(restaurantId) {
  const restaurant = restaurants.find((r) => r.id === restaurantId);
  if (!restaurant) throw new Error('Restaurant not found.');
  const items = menuItems.filter((item) => item.restaurantId === restaurantId);
  return { restaurant, items };
}
