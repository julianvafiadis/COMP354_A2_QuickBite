import { api, emit, notify } from '../shared/ui.js';

export function initMenuActions() {
  document.querySelector('#menu-view').addEventListener('click', async (event) => {
    const button = event.target.closest('[data-add]');
    if (!button || button.disabled) return;
    button.disabled = true;
    try {
      const cart = await api('/api/cart/items', {
        method: 'POST',
        body: { itemId: button.dataset.add },
      });
      emit('qb:cart-changed', cart);
      notify('Added to your bag.');
    } catch (error) {
      notify(error.message);
    } finally {
      if (button.isConnected) button.disabled = false;
    }
  });
}
