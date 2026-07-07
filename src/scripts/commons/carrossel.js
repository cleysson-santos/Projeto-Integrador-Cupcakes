(function () {
  'use strict';

  // Ajuste este valor para bater com o "gap" real definido no CSS da galeria
  const GALLERY_GAP = 12;
  // Quantos pixels de arraste são necessários para trocar de slide
  const SWIPE_THRESHOLD = 50;

  // -----------------------------------------------------------------
  // Helper genérico: unifica mouse e touch num único conjunto de eventos.
  // Evita repetir a mesma lógica de "start/move/end" 3 vezes no arquivo.
  // -----------------------------------------------------------------
  function attachDrag(el, { onStart, onMove, onEnd }) {
    let dragging = false;

    function start(x) {
      dragging = true;
      onStart(x);
    }
    function move(x) {
      if (!dragging) return;
      onMove(x);
    }
    function end(x) {
      if (!dragging) return;
      dragging = false;
      onEnd(x);
    }

    // Touch (celular/tablet)
    el.addEventListener('touchstart', e => start(e.touches[0].clientX), { passive: true });
    el.addEventListener('touchmove', e => move(e.touches[0].clientX), { passive: true });
    el.addEventListener('touchend', e => end(e.changedTouches[0].clientX));

    // Mouse (desktop) — mesma lógica, sem duplicar código
    el.addEventListener('mousedown', e => start(e.clientX));
    window.addEventListener('mousemove', e => move(e.clientX));
    window.addEventListener('mouseup', e => end(e.clientX));
  }

  // -----------------------------------------------------------------
  // BANNER (heroBanner) — desliza 100% de largura por slide
  // -----------------------------------------------------------------
  function initBanner() {
    const track = document.getElementById('bannerTrack');
    const items = track.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('bannerPrev');
    const nextBtn = document.getElementById('bannerNext');

    let index = 0;
    let startX = 0;

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
    }
    function next() {
      index = (index + 1) % items.length;
      update();
    }
    function prev() {
      index = (index - 1 + items.length) % items.length;
      update();
    }

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    attachDrag(track, {
      onStart(x) {
        startX = x;
        track.style.transition = 'none'; // segue o dedo/mouse sem animação
      },
      onMove(x) {
        const delta = x - startX;
        track.style.transform = `translateX(calc(-${index * 100}% + ${delta}px))`;
      },
      onEnd(x) {
        track.style.transition = ''; // reativa a animação suave pro "encaixe"
        const diff = startX - x;
        if (diff > SWIPE_THRESHOLD) next();
        else if (diff < -SWIPE_THRESHOLD) prev();
        else update(); // arraste pequeno demais, volta pro lugar
      }
    });

    update(); // ← corrige o bug: calcula a posição já na inicialização
    window.addEventListener('resize', update);
  }

  // -----------------------------------------------------------------
  // MAIS PEDIDOS — centraliza o card ativo (mantém sua ideia original)
  // -----------------------------------------------------------------
  function initPedidos() {
    const container = document.querySelector('.section-maisPedidos');
    const track = document.getElementById('pedidoTrack');
    const items = track.querySelectorAll('.carousel-item');
    const prevBtn = container.querySelector('.arrow.left');
    const nextBtn = container.querySelector('.arrow.right');

    let index = 0;
    let startX = 0;

    function update() {
      const containerWidth = container.offsetWidth;
      const card = items[index];
      const translateX = card.offsetLeft - (containerWidth / 2) + (card.offsetWidth / 2);

      track.style.transform = `translateX(-${translateX}px)`;

      items.forEach(item => item.classList.remove('active'));
      card.classList.add('active');
    }
    function next() {
      index = (index + 1) % items.length;
      update();
    }
    function prev() {
      index = (index - 1 + items.length) % items.length;
      update();
    }

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    attachDrag(track, {
      onStart(x) { startX = x; },
      onEnd(x) {
        const diff = startX - x;
        if (diff > SWIPE_THRESHOLD) next();
        else if (diff < -SWIPE_THRESHOLD) prev();
      }
    });

    update();
    window.addEventListener('resize', update);
  }

  // -----------------------------------------------------------------
  // GALERIA — desliza pela largura real do item (sem número "mágico")
  // -----------------------------------------------------------------
  function initGallery() {
    const wrapper = document.querySelector('.gallery');
    const track = document.getElementById('galleryTrack');
    const items = track.querySelectorAll('.gallery-item');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');

    let index = 0;
    let startX = 0;

    function itemWidth() {
      return items[0].offsetWidth + GALLERY_GAP;
    }
    function visibleCount() {
      return Math.max(1, Math.round(wrapper.offsetWidth / itemWidth()));
    }
    function maxIndex() {
      // último índice em que ainda sobram itens pra preencher a tela
      return Math.max(0, items.length - visibleCount());
    }

    function update() {
      index = Math.min(index, maxIndex()); // se redimensionar, corrige o index
      track.style.transform = `translateX(-${index * itemWidth()}px)`;
    }
    function next() {
      index = index >= maxIndex() ? 0 : index + 1;
      update();
    }
    function prev() {
      index = index <= 0 ? maxIndex() : index - 1;
      update();
    }

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    attachDrag(track, {
      onStart(x) { startX = x; },
      onEnd(x) {
        const diff = startX - x;
        if (diff > SWIPE_THRESHOLD) next();
        else if (diff < -SWIPE_THRESHOLD) prev();
      }
    });

    update();
    window.addEventListener('resize', update);
  }

  // -----------------------------------------------------------------
  // Ponto de entrada: como o <script> já usa "defer", o DOM já está
  // pronto quando este arquivo roda — não precisa esperar 'load'.
  // -----------------------------------------------------------------
  initBanner();
  initPedidos();
  initGallery();

})();