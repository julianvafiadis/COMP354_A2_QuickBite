import { api, emit, escapeHtml, money, notify } from '../shared/ui.js';

export function initCart() {
  const content = document.querySelector('#cart-content');
  let cart;
  let busy = false;
  function render() {
    document.querySelector('#bag-count').textContent = cart.itemCount;
    if (!cart.items.length) {
      content.innerHTML = `
        <div class="empty-bag">
          <h3>Good things go in here.</h3>
          <p>
            Your bag is waiting for something delicious. Explore a kitchen to
            get started.
          </p>
          <span class="empty-bag-note">One restaurant. One easy pickup.</span>
        </div>
      `;
    } else {
      content.innerHTML = `
        <div class="cart-restaurant">
          <span class="eyebrow">ORDERING FROM</span>
          <button class="text-button" data-cart-restaurant>
            ${escapeHtml(cart.restaurant.name)} ↗
          </button>
          <p>${escapeHtml(cart.restaurant.address)}</p>
        </div>
        <ul class="cart-items">
          ${cart.items
            .map(
              (i) => `
                <li class="cart-item">
                  <div class="cart-item-heading">
                    <strong>${escapeHtml(i.name)}</strong>
                    <span>${money(i.lineTotalCents)}</span>
                  </div>
                  ${
                    !i.available
                      ? `
                          <p class="field-error">
                            No longer available. Please remove this item.
                          </p>
                        `
                      : ''
                  }
                  <div class="cart-item-actions">
                    <div class="quantity-control">
                      <button
                        data-quantity="${escapeHtml(i.id)}"
                        data-value="${i.quantity - 1}"
                        aria-label="Decrease ${escapeHtml(i.name)} quantity"
                      >
                        −
                      </button>
                      <span aria-label="Quantity">${i.quantity}</span>
                      <button
                        data-quantity="${escapeHtml(i.id)}"
                        data-value="${i.quantity + 1}"
                        aria-label="Increase ${escapeHtml(i.name)} quantity"
                        ${i.quantity >= 20 ? 'disabled' : ''}
                      >
                        +
                      </button>
                    </div>
                    <button
                      class="remove-button"
                      data-remove="${escapeHtml(i.id)}"
                      aria-label="Remove ${escapeHtml(i.name)}"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              `,
            )
            .join('')}
        </ul>
        <div class="cart-total">
          <span>Total</span>
          <strong>${money(cart.totalCents)}</strong>
        </div>
        <p class="cart-payment">
          CAD · No payment collected online.
          <br />
          Demo total uses listed menu prices; taxes are not calculated.
        </p>
        <button
          class="button primary checkout-button"
          data-checkout
          ${cart.items.some((i) => !i.available) || !cart.restaurant.open ? 'disabled' : ''}
        >
          Choose pickup & confirm
          <span aria-hidden="true">→</span>
        </button>
        <button class="text-button clear-bag" data-clear>Empty bag</button>
      `;
    }
    emit('qb:cart-rendered', cart);
  }
  async function refresh() {
    try {
      cart = await api('/api/cart');
      render();
    } catch (error) {
      content.innerHTML = `
        <p>Could not load your bag.</p>
        <button class="button secondary" data-retry-cart>Try again</button>
      `;
      notify(error.message);
    }
  }
  document.addEventListener('qb:cart-changed', (event) => {
    cart = event.detail;
    render();
  });
  document.addEventListener('qb:cart-refresh', refresh);
  content.addEventListener('click', async (event) => {
    if (event.target.closest('[data-retry-cart]')) {
      refresh();
      return;
    }
    if (event.target.closest('[data-cart-restaurant]')) {
      emit('qb:restaurant-selected', cart.restaurant.id);
      return;
    }
    if (event.target.closest('[data-checkout]')) {
      emit('qb:checkout-open', cart);
      return;
    }
    const quantity = event.target.closest('[data-quantity]');
    const remove = event.target.closest('[data-remove]');
    const clear = event.target.closest('[data-clear]');
    if ((!quantity && !remove && !clear) || busy) return;
    busy = true;
    content.querySelectorAll('button').forEach((b) => {
      b.disabled = true;
    });
    try {
      let next;
      if (clear) next = await api('/api/cart', { method: 'DELETE' });
      else if (remove)
        next = await api(
          `/api/cart/items/${encodeURIComponent(remove.dataset.remove)}`,
          { method: 'DELETE' },
        );
      else
        next = await api(
          `/api/cart/items/${encodeURIComponent(quantity.dataset.quantity)}`,
          {
            method: 'PATCH',
            body: { quantity: Number(quantity.dataset.value) },
          },
        );
      cart = next;
      render();
      if (quantity) {
        const control = [...content.querySelectorAll('[data-quantity]')].find(
          (b) =>
            b.dataset.quantity === quantity.dataset.quantity &&
            b.dataset.value === String(Number(quantity.dataset.value) - 1),
        );
        (
          control ||
          content.querySelector('[data-checkout]') ||
          document.querySelector('#cart-title')
        ).focus();
      } else
        (
          content.querySelector('[data-checkout]') ||
          document.querySelector('#cart-title')
        ).focus();
    } catch (error) {
      notify(error.message);
      render();
    } finally {
      busy = false;
    }
  });
  refresh();
}
