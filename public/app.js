import { initRestaurants } from './restaurants/view.js';
import { initMenu } from './menu/view.js';
import { initCart } from './shopping-cart/view.js';
import { initOrders } from './orders/view.js';
import { initMenuActions } from './shopping-cart/menu-actions.js';

initMenu();
initOrders();
initCart();
initRestaurants();
initMenuActions();
