const cartStorageKey = 'appcake-cart';

function getCartItems() {
    return JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
}

function saveCartItems(items) {
    localStorage.setItem(cartStorageKey, JSON.stringify(items));
}

function getProductFromButton(button) {
    const product = button.closest('.card, .product-card');
    const title = product.querySelector('.title-product, h2').textContent.trim();
    const price = product.querySelector('.price, .bottom span')?.textContent.trim() || 'R$ 7,99';
    const image = product.querySelector('img').getAttribute('src');

    return { id: title.toLowerCase(), title, price, image };
}

function addToCart(product) {
    const items = getCartItems();
    const item = items.find((cartItem) => cartItem.id === product.id);

    if (item) {
        item.quantity += 1;
    } else {
        items.push({ ...product, quantity: 1 });
    }

    saveCartItems(items);
}

function removeFromCart(product) {
    saveCartItems(getCartItems().filter((item) => item.id !== product.id));
}

window.appCakeCart = {
    getItems: getCartItems,
    saveItems: saveCartItems,
    add: addToCart,
    remove: removeFromCart
};

document.querySelectorAll('.buy-btn, .buy').forEach((buyButton) => {
    buyButton.addEventListener('click', () => {
        addToCart(getProductFromButton(buyButton));
    });
});

document.querySelectorAll('.fav-btn, .fav').forEach((favButton) => {
    const product = getProductFromButton(favButton);
    const isFavorite = getCartItems().some((item) => item.id === product.id);

    favButton.classList.toggle('fav-btn-clicado', isFavorite);
    favButton.classList.toggle('favorite-selected', isFavorite);

    favButton.addEventListener('click', () => {
        const selected = favButton.classList.toggle('favorite-selected');
        favButton.classList.toggle('fav-btn-clicado', selected);
        favButton.querySelector('i')?.classList.toggle('fa-regular', !selected);
        favButton.querySelector('i')?.classList.toggle('fa-solid', selected);

        if (selected) {
            addToCart(product);
        } else {
            removeFromCart(product);
        }
    });
});
