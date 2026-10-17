import { restaurants, menuItems } from './data.js';
import { ApiError } from './http.js';

export function getMenu(restaurantId) {
  const restaurant = restaurants.find(
    (restaurant) => restaurant.id === restaurantId,
  );
  if (!restaurant) throw new ApiError('Restaurant not found.', 404);
  const items = menuItems.filter((item) => item.restaurantId === restaurantId);
  return { restaurant, items };
}
