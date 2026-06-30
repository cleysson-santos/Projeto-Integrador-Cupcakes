(function(){

    const bannerTrack = document.getElementById('bannerTrack');
    const bannerItems = bannerTrack.querySelectorAll('.carousel-item');
    const bannerPrev = document.querySelector('.heroBanner .arrow.left');
    const bannerNext = document.querySelector('.heroBanner .arrow.right');

    let bannerIndex = 0;

    function updateBanner() {
        bannerTrack.style.transform =
            `translateX(-${bannerIndex * 100}%)`;
    }

    bannerNext.addEventListener('click', () => {
        bannerIndex++;

        if(bannerIndex >= bannerItems.length) {
            bannerIndex = 0;
        }

        updateBanner();
    });

    bannerPrev.addEventListener('click', () => {
        bannerIndex--;

        if(bannerIndex < 0) {
            bannerIndex = bannerItems.length - 1;
        }

        updateBanner();
});

// SWIPE

let startX = 0;

bannerTrack.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
});

bannerTrack.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50) bannerNext.click();
    if (diff < -50) bannerPrev.click();
});

window.addEventListener('resize', () => {
    updateBanner();
    updatePedidos();
    updateGallery();
});


// MAIS PEDIDOS

const pedidoTrack = document.getElementById('pedidoTrack');
const pedidoItems = pedidoTrack.querySelectorAll('.carousel-item');
const pedidoPrev = document.querySelector('.section-maisPedidos .arrow.left');
const pedidoNext = document.querySelector('.section-maisPedidos .arrow.right');

let pedidoIndex = 0;

function updatePedidos() {
    const container = document.querySelector('.section-maisPedidos');
    const containerWidth = container.offsetWidth;
    const currentCard = pedidoItems[pedidoIndex];
    const cardWidth = currentCard.offsetWidth;
    const cardLeft = currentCard.offsetLeft;
    const translateX =
        cardLeft - (containerWidth / 2) + (cardWidth / 2);

    pedidoTrack.style.transform =
    `translateX(-${translateX}px)`;
    
    pedidoItems.forEach(item => item.classList.remove('active'));
    pedidoItems[pedidoIndex].classList.add('active');
}

pedidoNext.addEventListener('click', () => {
    pedidoIndex++;

    if(pedidoIndex >= pedidoItems.length) pedidoIndex = 0;

    updatePedidos();
})

pedidoPrev.addEventListener('click', () => {
    pedidoIndex--;

    if (pedidoIndex < 0) pedidoIndex = pedidoItems.length - 1;

    updatePedidos();
})

// SWIPE mais pedidos

let pedidoStartX = 0;

pedidoTrack.addEventListener('touchstart', e => {
    pedidoStartX = e.touches[0].clientX;
});

pedidoTrack.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const diff = pedidoStartX - endX;

    if (diff > 50) pedidoNext.click();
    if (diff < -50) pedidoPrev.click();
});


window.addEventListener('load', updatePedidos);
window.addEventListener('resize', updatePedidos);

// GALLERIA

const galleryTrack = document.getElementById('galleryTrack');
const galleryItems = galleryTrack.querySelectorAll('.gallery-item');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');

let galleryIndex = 0;

function updateGallery() {
    const itemWidth = galleryItems[0].offsetWidth + 12;

    galleryTrack.style.transform = 
        `translateX(-${galleryIndex * itemWidth}px)`;
}

galleryNext.addEventListener('click', () => {
    galleryIndex++;

    if (galleryIndex > galleryItems.length - 2) 
        galleryIndex = 0;

    updateGallery();
});

galleryPrev.addEventListener('click', () => {
    galleryIndex--;

    if (galleryIndex < 0) 
        galleryIndex = galleryItems.length - 2;

    updateGallery();
})

// SWIPE

let galleryStartX = 0;

galleryTrack.addEventListener('touchstart', e => {
    galleryStartX = e.touches[0].clientX;
});

galleryTrack.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const diff = galleryStartX - endX;

    if (diff > 50) galleryNext.click();
    if (diff < -50) galleryPrev.click();
});

window.addEventListener('resize', updateGallery);

})();