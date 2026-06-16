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

// SECTIONS

document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track, .gallery-track');
    const slides = track.children;

    const prevBtn = carousel.querySelector('.arrow.left');
    const nextBtn = carousel.querySelector('.arrow.right');

    let currentIndex = 0;

    function getVisibleItems() {
        if (carousel.classList.contains('gallery')) {
            if (window.innerWidth >= 768) {
                return 2;
            }
            return 2;
        
        }

        return 1;
    }

    function updateCarousel() {
        const slideWidth = slides[0].offsetWidth;
        const gap = 12;

        track.style.transform =
            `translate(-${currentIndex * (slideWidth + gap)})`;
    }

    nextBtn.addEventListener('click', () => {
        currentIndex++;

        if (currentIndex >= slides.length - getVisibleItems() + 1) {
            currentIndex = 0;
        }

        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = slides.length - getVisibleItems();
        }

        updateCarousel();
    });    
    
})


// TOUCH

let startX = 0;

track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
});

track.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50) {
        nextBtn.click();
    }

    if (diff < -50) {
        prevBtn.click();
    }
});

window.addEventListener('resize', updateCarousel);


})();