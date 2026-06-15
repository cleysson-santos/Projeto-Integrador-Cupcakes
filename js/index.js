// // marcador de link

 (function(){

const input = document.getElementById('searchForm');
const lupa = document.getElementById('btn-search');
const menu = document.getElementById('btn-menu');
const searchInputField = document.getElementById('search-input');

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

// // SWIPE MOBILE

// function enableSwipe(trackId) {
//   const track = document.getElementById(trackId);
//   let startX = 0;
//   let endX = 0;
  
//   track.addEventListener('touchstart', (e) => {
//     startX = e.touches[0].clientX;
//   });
  
//   track.addEventListener('touchmove', (e) => {
//     endX = e.touches[0].clientX;
//   });
  
//   track.addEventListener('touchend', () => {
//     const diff = startX - endX;
    
//     if (Math.abs(diff) > 50) {
//       if (diff > 0) {
//         move(trackId, 1);
//       } else {
//         move(trackId, -1);
//       }
//     }
//   });
// }

// // ATIVAR SWIPE NOS CARROSEIS
// enableSwipe('bannerTrack');
// enableSwipe('pedidoTrack');
// enableSwipe('galleryTrack');

 })();