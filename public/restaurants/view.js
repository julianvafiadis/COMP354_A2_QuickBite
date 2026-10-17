import { api, emit, escapeHtml, notify } from '../shared/ui.js';

export function initRestaurants() {
  const list = document.querySelector('#restaurant-list');
  async function load() {
    list.textContent = 'Loading restaurants...';
    try {
      const { restaurants } = await api('/api/restaurants');
      document.querySelector('#restaurant-count').textContent =
        restaurants.length + ' restaurants';
      if (!restaurants.length) {
        list.textContent = 'No restaurants are available.';
        return;
      }
      list.innerHTML = restaurants.map((restaurant) => `
        <button class="restaurant-card" data-restaurant="${escapeHtml(restaurant.id)}">
          <div class="restaurant-info">
            <h3>${escapeHtml(restaurant.name)}</h3>
            <p>${escapeHtml(restaurant.description)}</p>
            <p>${escapeHtml(restaurant.address)}</p>
            <p>${escapeHtml(restaurant.openingHours || 'Hours not provided')}</p>
            <div class="restaurant-meta">
              <span>${escapeHtml(restaurant.cuisine)}</span>
              <span>${restaurant.open ? restaurant.pickupMinutes + ' min pickup' : 'Currently closed'}</span>
            </div>
          </div>
        </button>
      `).join('');
    } catch (error) {
      list.innerHTML = '<p>Could not load restaurants.</p><button data-retry>Try again</button>';
      notify(error.message);
    }
  }
  list.addEventListener('click', (event) => {
    if (event.target.closest('[data-retry]')) load();
    const button = event.target.closest('[data-restaurant]');
    if (button) emit('qb:restaurant-selected', button.dataset.restaurant);
  });
  load();
}
