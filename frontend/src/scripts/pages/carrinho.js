const cartContainer = document.querySelector('.cart');
const finishButton = document.querySelector('.finish-btn');

function parsePrice(price) {
    return Number.parseFloat(price.replace('R$', '').replace('.', '').replace(',', '.').trim());
}

function formatPrice(price) {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderCart() {
    const items = window.appCakeCart.getItems();

    cartContainer.innerHTML = '';

    if (items.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
        finishButton.disabled = true;
        return;
    }

    finishButton.disabled = false;

    items.forEach((item) => {
        const card = document.createElement('article');
        card.className = 'cart-card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-info">
                <h2>${item.title}</h2>
                <div class="quantity">
                    <div>Quantidade:</div>
                    <div class="controls">
                        <button class="decrease" type="button" aria-label="Diminuir quantidade">-</button>
                        <div>${item.quantity}</div>
                        <button class="increase" type="button" aria-label="Aumentar quantidade">+</button>
                    </div>
                </div>
                <p class="price">${formatPrice(parsePrice(item.price) * item.quantity)}</p>
            </div>`;

        card.querySelector('.decrease').addEventListener('click', () => updateQuantity(item.id, -1));
        card.querySelector('.increase').addEventListener('click', () => updateQuantity(item.id, 1));
        cartContainer.appendChild(card);
    });
}

function updateQuantity(id, change) {
    const items = window.appCakeCart.getItems();
    const item = items.find((cartItem) => cartItem.id === id);

    if (!item) {
        return;
    }

    item.quantity += change;
    window.appCakeCart.saveItems(items.filter((cartItem) => cartItem.quantity > 0));
    renderCart();
}

renderCart();