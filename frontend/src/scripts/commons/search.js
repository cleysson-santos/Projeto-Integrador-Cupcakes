(function () {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('search-input');
    const productElements = document.querySelectorAll('.section-maisPedidos .carousel-item, .product-card');

    if (!searchForm || !searchInput) {
        return;
    }

    const normalizedSearch = (value) => value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    let noResultsMessage = document.querySelector('.search-no-results');

    if (productElements.length > 0) {
        noResultsMessage = document.createElement('p');
        noResultsMessage.className = 'search-no-results';
        noResultsMessage.textContent = 'Nenhum sabor encontrado.';
        noResultsMessage.setAttribute('aria-live', 'polite');
        noResultsMessage.hidden = true;
        productElements[0].parentElement.parentElement.appendChild(noResultsMessage);
    }

    function focusFirstResult() {
        const firstResult = [...productElements].find((product) => !product.hidden);

        if (!firstResult) {
            return;
        }

        firstResult.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        firstResult.setAttribute('tabindex', '-1');
        firstResult.focus({ preventScroll: true });
        firstResult.classList.remove('search-focused');
        requestAnimationFrame(() => firstResult.classList.add('search-focused'));
    }

    function filterProducts(value) {
        const term = normalizedSearch(value);
        let visibleProducts = 0;

        productElements.forEach((product) => {
            const name = product.querySelector('.title-product, h2')?.textContent || '';
            const isVisible = !term || normalizedSearch(name).includes(term);
            product.hidden = !isVisible;
            visibleProducts += isVisible ? 1 : 0;
        });

        if (noResultsMessage) {
            noResultsMessage.hidden = !term || visibleProducts > 0;
        }
    }

    searchInput.addEventListener('input', () => {
        const term = normalizedSearch(searchInput.value);
        filterProducts(searchInput.value);

        const hasExactMatch = [...productElements].some((product) => {
            const name = product.querySelector('.title-product, h2')?.textContent || '';
            return normalizedSearch(name) === term;
        });

        if (term && hasExactMatch) {
            focusFirstResult();
        }
    });

    searchForm.addEventListener('submit', (event) => {
        const term = searchInput.value.trim();

        if (productElements.length > 0) {
            event.preventDefault();
            filterProducts(term);
            focusFirstResult();
            return;
        }

        if (term) {
            event.preventDefault();
            window.location.href = `/src/pages/cardapio.html?busca=${encodeURIComponent(term)}`;
        }
    });

    const query = new URLSearchParams(window.location.search).get('busca');

    if (query && productElements.length > 0) {
        searchInput.value = query;
        filterProducts(query);
        focusFirstResult();
    }
})();
