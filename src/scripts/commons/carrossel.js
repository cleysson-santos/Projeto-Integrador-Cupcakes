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
  const BREAKPOINTS = {
    tablet: 768,   // a partir daqui (px) considera "tablet"
    desktop: 1024  // a partir daqui (px) considera "desktop"
  };
 
  function itemsPerPageForWidth(width) {
    if (width >= BREAKPOINTS.desktop) return 7;
    if (width >= BREAKPOINTS.tablet) return 5;
    return 2; // mobile
  }
 
  // Intervalo do slide automático da galeria (ms)
  const GALLERY_AUTOPLAY_INTERVAL = 4000;
 
  function initGallery() {
    const track = document.getElementById('galleryTrack');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
 
    // Guarda as fotos originais uma única vez, na ordem em que estão no HTML
    const photos = Array.from(track.querySelectorAll('.gallery-item'));
 
    let pages = [];         // páginas "reais" (uma array de arrays de fotos)
    let currentPerPage = null;
    let position = 1;       // posição no trilho: 0 = clone, 1..N = páginas reais, N+1 = clone
    let startX = 0;
    let autoplayTimer = null;
 
    function buildPages(perPage) {
      pages = [];
      let fillerCursor = 0; // de onde tirar as fotos repetidas, se precisar
 
      for (let i = 0; i < photos.length; i += perPage) {
        const group = photos.slice(i, i + perPage);
 
        // Se a última página ficou incompleta, completa repetindo fotos
        // do começo da galeria (clonadas), pra manter a mesma largura
        // das fotos das outras páginas em vez de deixar espaço vazio.
        while (group.length < perPage) {
          const repeated = photos[fillerCursor % photos.length].cloneNode(true);
          repeated.classList.add('gallery-item--repeated');
          group.push(repeated);
          fillerCursor++;
        }
 
        pages.push(group);
      }
      currentPerPage = perPage;
      renderSlides();
    }
 
    // Monta o trilho como: [clone da última página] + [páginas reais] + [clone da primeira]
    // Isso é o que permite o "loop infinito" sem pulo visível.
    function renderSlides() {
      track.innerHTML = '';
 
      const firstClone = pages[0].map(photo => photo.cloneNode(true));
      const lastClone = pages[pages.length - 1].map(photo => photo.cloneNode(true));
      const allSlides = [lastClone, ...pages, firstClone];
 
      allSlides.forEach(pagePhotos => {
        const page = document.createElement('div');
        page.className = 'gallery-page';
        pagePhotos.forEach(photo => page.appendChild(photo));
        track.appendChild(page);
      });
 
      position = 1; // primeira página real
      jumpTo(position);
    }
 
    // Move o trilho SEM transição (usado só pra "teleportar" do clone pra página real)
    function jumpTo(pos) {
      track.style.transition = 'none';
      track.style.transform = `translateX(-${pos * 100}%)`;
      void track.offsetWidth; // força o navegador a aplicar antes de religar a transição
      track.style.transition = '';
    }
 
    // Move o trilho COM transição normal (usado em next/prev/drag)
    function goTo(pos) {
      position = pos;
      track.style.transform = `translateX(-${position * 100}%)`;
    }
 
    function next() { goTo(position + 1); }
    function prev() { goTo(position - 1); }
 
    // Quando a transição termina sobre um clone (ou passa dele), teleporta
    // pra página real equivalente. Uso >= / <= em vez de === porque, se o
    // navegador atrasar o setInterval (aba em segundo plano) e disparar vários
    // "next" de uma vez, a posição pode saltar direto por cima do valor exato.
    track.addEventListener('transitionend', () => {
      const lastPosition = pages.length + 1; // posição do clone-da-primeira
      if (position >= lastPosition) {
        position = 1;
        jumpTo(position);
      } else if (position <= 0) {
        position = pages.length; // posição da última página real
        jumpTo(position);
      }
    });
 
    nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
    prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
 
    attachDrag(track, {
      onStart(x) {
        startX = x;
        stopAutoplay();
        track.style.transition = 'none';
      },
      onMove(x) {
        const delta = x - startX;
        track.style.transform = `translateX(calc(-${position * 100}% + ${delta}px))`;
      },
      onEnd(x) {
        track.style.transition = '';
        const diff = startX - x;
        if (diff > SWIPE_THRESHOLD) next();
        else if (diff < -SWIPE_THRESHOLD) prev();
        else goTo(position); // arraste pequeno demais, volta pro lugar
        startAutoplay();
      }
    });
 
    function startAutoplay() {
      stopAutoplay(); // evita empilhar mais de um interval rodando ao mesmo tempo
      autoplayTimer = setInterval(next, GALLERY_AUTOPLAY_INTERVAL);
    }
    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }
    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }
 
    // Pausa o autoplay enquanto o mouse estiver sobre a galeria
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
 
    // Pausa o autoplay quando a aba vai pra segundo plano — evita que o
    // navegador acumule vários "next" represados e o dispare tudo de uma vez
    // quando a aba voltar a ficar ativa (o que gerava saltos de posição).
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });
 
    function handleResize() {
      const perPage = itemsPerPageForWidth(window.innerWidth);
      if (perPage !== currentPerPage) {
        buildPages(perPage); // só remonta as páginas (e os clones) se o breakpoint mudou
      }
    }
 
    buildPages(itemsPerPageForWidth(window.innerWidth));
    track.classList.add('is-ready'); // some com o "flash" do HTML cru antes do JS montar as páginas
    startAutoplay();
    window.addEventListener('resize', handleResize);
  }
 
  // -----------------------------------------------------------------
  // Ponto de entrada: como o <script> já usa "defer", o DOM já está
  // pronto quando este arquivo roda — não precisa esperar 'load'.
  // -----------------------------------------------------------------
  initBanner();
  initPedidos();
  initGallery();

})();