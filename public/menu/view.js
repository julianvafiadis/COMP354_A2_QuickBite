import { api, emit, escapeHtml, money, notify, showView } from '../shared/ui.js';

export function initMenu() {
  const view = document.querySelector('#menu-view');
  let currentId;
  let loadNumber = 0;
  async function load(id) {
    currentId = id;
    const request = ++loadNumber;
    showView('menu');
    view.innerHTML = '<button class="back-link" data-back>All restaurants</button><p>Loading menu...</p>';
    try {
      const { restaurant, items } = await api(
        '/api/restaurants/' + encodeURIComponent(id) + '/menu',
      );
      if (request !== loadNumber) return;
      const available = items.filter((item) => item.available);
      const categories = [...new Set(available.map((item) => item.category))];
      const heading = `
        <button class="back-link" data-back>All restaurants</button>
        <div class="menu-banner">
          <h1 id="menu-title" tabindex="-1">${escapeHtml(restaurant.name)}</h1>
          <p>${escapeHtml(restaurant.address)}</p>
          <p>${restaurant.open ? 'Pickup in ' + restaurant.pickupMinutes + ' minutes' : 'Currently closed'}</p>
        </div>
        <p class="muted">Prices in CAD. Pay at pickup.</p>
      `;
      const sections = categories.map((category) => `
        <section class="menu-category">
          <h2>${escapeHtml(category)}</h2>
          ${available.filter((item) => item.category === category).map((item) => `
            <article class="menu-item">
              <div>
                <h3>${escapeHtml(item.name)}</h3>
                <p>${escapeHtml(item.description)}</p>
                <strong class="item-price">${money(item.priceCents)}</strong>
              </div>
              <button class="add-button" data-add="${escapeHtml(item.id)}"
                aria-label="Add ${escapeHtml(item.name)} to cart"
                ${restaurant.open ? '' : 'disabled'}>+</button>
            </article>
          `).join('')}
        </section>
      `).join('');
      view.innerHTML = heading + (available.length
        ? sections
        : '<p>No menu items are available right now.</p>');
      document.querySelector('#menu-title').focus({ preventScroll: true });
      emit('qb:menu-rendered');
    } catch (error) {
      if (request !== loadNumber) return;
      view.innerHTML = '<button class="back-link" data-back>All restaurants</button><p>Could not load menu.</p><button data-retry-menu>Try again</button>';
      notify(error.message);
    }
  }
  document.addEventListener('qb:restaurant-selected', (event) => load(event.detail));
  view.addEventListener('click', (event) => {
    if (event.target.closest('[data-back]')) {
      ++loadNumber;
      showView('restaurants');
      document.querySelector('#restaurant-list').focus({ preventScroll: true });
    }
    if (event.target.closest('[data-retry-menu]')) load(currentId);
  });
}
