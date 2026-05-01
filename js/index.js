// // marcador de link

// (function(){

const input = document.getElementById('search-input');

const abrirBusca = document.getElementById('btn-search').addEventListener('click', function() {
    let form = document.getElementById('searchForm');

    form.style.display = searchForm.style.display === 'block' ? 'none' : 'block';
    input.focus();
});

const fecharBusca = input.addEventListener('blur', () => {
    const form = document.getElementById('searchForm');

    setTimeout(() => {
        form.style.display = 'none';
    });
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

// })();