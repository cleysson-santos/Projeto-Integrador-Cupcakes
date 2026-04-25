// marcador de link

(function(){

const positions = {};
const dotsMap = {};

function move (trackId, direction) {
  const track = document.getElementById(trackId);
  const total = track.children.length;
  
  if (!positions[trackId]) positions[trackId] = 0;

  positions[trackId] += direction;

  if (positions[trackId] < 0) positions[trackId] = 0;
  if (positions[trackId] >= total) positions[trackId] = total - 1;

  track.style.transform = `translateX(-${positions[trackId] * 100}%)`;

  updateDots(trackId);
}

// SWIPE MOBILE

function enableSwipe(trackId) {
  const track = document.getElementById(trackId);
  let startX = 0;
  let endX = 0;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
  });

  track.addEventListener('touchend', () => {
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        move(trackId, 1);
      } else {
        move(trackId, -1);
      }
    }
  });
}

// ATIVAR SWIPE NOS CARROSEIS
enableSwipe('bannerTrack');
enableSwipe('pedidoTrack');

// CRIAR DOTS
function createDots(trackId, dotsId) {
  const track = document.getElementById(trackId);
  const dotsContainer = document.getElementById(dotsId);

  dotsMap[trackId] = [];

  for (let i = 0; i < track.children.length; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');

    dot.addEventListener('click', () => {
      positions[trackId] = i;
      track.style.transform = `translateX(-${i * 100}%)`;
      updateDots(trackId);
    });

    dotsContainer.appendChild(dot);
    dotsMap[trackId].push(dot);
  }

  updateDots(trackId);

}

function updateDots(trackId) {
  const dots = dotsMap[trackId];
  if (!dots) return;

  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === positions[trackId]);
  });
}

//INICIAR DOTS
createDots('bannerTrack', 'bannerDots');
createDots('pedidoTrack', 'pedidoDots');

const items = document.querySelectorAll('.menu-item');

items.forEach(item => {
  item.addEventListener('click', () => {
    
    items.forEach(i => i.classList.remove('active'));
    
    item.classList.add('active');
  });
});
})();