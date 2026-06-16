// // marcador de link

 (function(){

const input = document.getElementById('searchForm');
const lupa = document.getElementById('btn-search');
const menu = document.getElementById('btn-menu');
const searchInputField = document.getElementById('search-input');
const btnMenu = document.getElementById('btn-menu');
const menuModal = document.getElementById('menuModal');
const closeMenu = document.getElementById('closeMenu');
const currentPage = window.location.pathname.split("/").pop().replace('.html', '');

lupa.addEventListener('click', (event) => {
    event.stopPropagation();
    input.classList.add('active');
    lupa.classList.add('hidden');

    setTimeout(() => {
        searchInputField.focus();
    }, 50);
});

function closeSearch() {
    console.log('Fechando busca')
    input.classList.remove('active');
    lupa.classList.remove('hidden');
}

document.addEventListener('click', (event) => {
    const clicouFora = !input.contains(event.target) && !lupa.contains(event.target);
    
    if (input.classList.contains('active') && clicouFora && searchInputField.value.trim() === '') {
        closeSearch();
    }
});

document.addEventListener('keydown', (event) => {
    if(event.key === 'Escape' && input.classList.contains('active')) {
        closeSearch();
    }
});

btnMenu.addEventListener('click', () => {
    menuModal.classList.add('active');
    btnMenu.style.display = 'none';
});

closeMenu.addEventListener('click', () => {
    menuModal.classList.remove('active');
    btnMenu.style.display = 'block';
});

menuModal.addEventListener('click', (e) => {
    if (e.target === menuModal) {
        menuModal.classList.remove('active');
    }
});

if (currentPage === '') {
    currentPage = 'index';
}

document.querySelectorAll('.menu-content a').forEach(link => {

    if(link.dataset.page === currentPage) {
        link.classList.add('active');
    }
});



 })();