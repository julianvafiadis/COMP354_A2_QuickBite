import { api, emit, escapeHtml, money, dateTime, notify, showView } from '../shared/ui.js';

export function initOrders() {
  const section = document.querySelector('#checkout-section');
  const confirmation = document.querySelector('#confirmation-view');
  let cart;
  let checkoutVersion = 0;
  let submitting = false;
  function close() {
    ++checkoutVersion;
    section.hidden = true;
    section.innerHTML = '';
  }
  document.addEventListener('qb:cart-rendered', (event) => {
    cart = event.detail;
    close();
  });
  async function loadOptions(restaurantId) {
    const { pickupOptions } = await api(
      `/api/pickup-options?restaurantId=${encodeURIComponent(restaurantId)}`,
    );
    return pickupOptions;
  }
  function optionMarkup(options) {
    return (
      `<option value="">Choose a pickup time</option>` +
      options
        .map(
          (t) => `
            <option value="${escapeHtml(t)}">${escapeHtml(dateTime(t))}</option>
          `,
        )
        .join('')
    );
  }
  document.addEventListener('qb:checkout-open', async (event) => {
    cart = event.detail;
    const version = ++checkoutVersion;
    section.hidden = false;
    section.innerHTML = `
      <p class="muted">Finding pickup times…</p>
    `;
    try {
      const options = await loadOptions(cart.restaurant.id);
      if (version !== checkoutVersion) return;
      section.innerHTML = `
        <div class="checkout-heading">
          <h3>A little closer to lunch.</h3>
          <p>Choose a time and tell the kitchen who is coming.</p>
        </div>
        <form id="checkout-form">
          <label>
            Your name
            <input
              name="customerName"
              autocomplete="name"
              required
              minlength="2"
              maxlength="80"
              placeholder="Alex Morgan"
            />
          </label>
          <label>
            Email address
            <input
              name="customerEmail"
              type="email"
              autocomplete="email"
              required
              maxlength="254"
              placeholder="alex@example.com"
            />
          </label>
          <label for="pickup-time">Pickup time</label>
          <select id="pickup-time" name="pickupAt" required>
            ${optionMarkup(options)}
          </select>
          <p class="checkout-note">
            Times shown in your device’s local timezone. These are demo
            intervals, not live workload availability. No confirmation email is
            sent.
          </p>
          <div class="checkout-summary">
            <span>Pay at pickup</span>
            <strong>${money(cart.totalCents)}</strong>
          </div>
          <p id="checkout-error" class="field-error" role="alert" hidden></p>
          <button
            class="button primary"
            type="submit"
            ${options.length ? '' : 'disabled'}
          >
            Confirm pickup order →
          </button>
          <button
            class="text-button cancel-checkout"
            type="button"
            data-cancel-checkout
          >
            Back to bag
          </button>
        </form>
      `;
      section.querySelector('input').focus();
      section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
      if (version === checkoutVersion) {
        close();
        notify(error.message);
      }
    }
  });
  section.addEventListener('click', (event) => {
    if (event.target.closest('[data-cancel-checkout]') && !submitting) {
      close();
      document.querySelector('[data-checkout]')?.focus();
    }
  });
  section.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting) return;
    const form = event.target;
    if (!form.reportValidity()) return;
    submitting = true;
    const input = Object.fromEntries(new FormData(form));
    form.querySelectorAll('button, input, select').forEach((el) => {
      el.disabled = true;
    });
    const button = form.querySelector('[type="submit"]');
    button.textContent = 'Confirming…';
    const errorBox = form.querySelector('#checkout-error');
    errorBox.hidden = true;
    try {
      const { order } = await api('/api/orders', {
        method: 'POST',
        body: input,
      });
      displayOrder(order);
      close();
      emit('qb:cart-refresh');
    } catch (error) {
      errorBox.textContent = error.message;
      errorBox.hidden = false;
      try {
        const options = await loadOptions(cart.restaurant.id);
        const select = form.querySelector('select');
        const oldTime = select.value;
        select.innerHTML = optionMarkup(options);
        if (options.includes(oldTime)) select.value = oldTime;
      } catch {}
    } finally {
      submitting = false;
      if (form.isConnected) {
        form.querySelectorAll('button, input, select').forEach((el) => {
          el.disabled = false;
        });
        button.textContent = 'Confirm pickup order →';
      }
    }
  });
  function displayOrder(order) {
    showView('confirmation');
    confirmation.innerHTML = `
      <div class="confirmation-card">
        <div class="success-mark" aria-hidden="true">✓</div>
        <p class="eyebrow">ORDER RECEIVED</p>
        <h1 id="confirmation-title" tabindex="-1">
          Good food is on its way
          <span>.</span>
        </h1>
        <p>Thanks, ${escapeHtml(order.customerName)}. Your pickup order is confirmed.</p>
        <div class="receipt-meta">
          <div>
            <span class="eyebrow">YOUR KITCHEN</span>
            <h3>${escapeHtml(order.restaurantName)}</h3>
            <p>${escapeHtml(order.address)}</p>
          </div>
          <div>
            <span class="eyebrow">PICKUP TIME</span>
            <h3>${escapeHtml(dateTime(order.pickupAt))}</h3>
            <p>Time shown in your device’s timezone.</p>
          </div>
        </div>
        <div class="receipt-number">
          <span>Order reference</span>
          <code>${escapeHtml(order.id.slice(0, 8).toUpperCase())}</code>
          <span class="status-pill">${escapeHtml(order.status)}</span>
        </div>
        <ul class="receipt-items">
          ${order.items
            .map(
              (i) => `
                <li>
                  <span>${i.quantity} × ${escapeHtml(i.name)}</span>
                  <strong>${money(i.priceCents * i.quantity)}</strong>
                </li>
              `,
            )
            .join('')}
        </ul>
        <div class="cart-total">
          <span>Pay at pickup · CAD</span>
          <strong>${money(order.totalCents)}</strong>
        </div>
        <p class="checkout-note">
          This is a demo order stored locally. No payment or email has been
          sent. Staff order processing is planned for a future sprint.
        </p>
        <button class="button primary" data-browse-again>
          Explore more kitchens ↗
        </button>
      </div>
    `;
    document
      .querySelector('#confirmation-title')
      .focus({ preventScroll: true });
  }
  confirmation.addEventListener('click', (event) => {
    if (event.target.closest('[data-browse-again]')) {
      showView('restaurants');
      document
        .querySelector('#restaurant-list')
        .focus({ preventScroll: true });
    }
  });
}
