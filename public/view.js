const cart = {
  restaurant: { id: 'basil', name: 'Basil & Brick' },
  items: [
    { id: 'basil-margherita', name: 'Margherita', priceCents: 1650, quantity: 2 },
  ],
};

function renderCart() {
  document.querySelector('#cart-restaurant').textContent = cart.restaurant.name;
  const list = document.querySelector('#cart-items');
  list.replaceChildren();
  for (const item of cart.items) {
    const row = document.createElement('article');
    const text = document.createElement('p');
    text.textContent = item.quantity + ' x ' + item.name +
      ' - $' + (item.priceCents * item.quantity / 100).toFixed(2) + ' CAD';
    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      cart.items = cart.items.filter((line) => line.id !== item.id);
      renderCart();
    });
    row.append(text, remove);
    list.append(row);
  }
  const total = cart.items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0,
  );
  document.querySelector('[type="submit"]').disabled = cart.items.length === 0;
  document.querySelector('#pickup-summary').textContent = '';
  document.querySelector('#cart-total').textContent =
    'Total: $' + (total / 100).toFixed(2) + ' CAD';
}

const select = document.querySelector('#pickup-time');
for (let minutes = 30; minutes <= 90; minutes += 15) {
  const time = new Date(Date.now() + minutes * 60000);
  const option = document.createElement('option');
  option.value = time.toISOString();
  option.textContent = time.toLocaleTimeString([], {
    hour: 'numeric', minute: '2-digit',
  });
  select.append(option);
}

document.querySelector('#checkout-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!cart.items.length) return;
  const input = Object.fromEntries(new FormData(event.target));
  document.querySelector('#pickup-summary').textContent =
    input.customerName + ', your sample pickup time is ' +
    new Date(input.pickupAt).toLocaleTimeString([], {
      hour: 'numeric', minute: '2-digit',
    }) + '. This preview has not placed an order.';
});

renderCart();
