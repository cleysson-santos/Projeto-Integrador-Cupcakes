// =====================================================================
// search.js — pesquisa de sabores usando o back-end Java.
//
// Fluxo: usuário digita no campo do cabeçalho e aperta Enter
//        -> chamamos a API (api.js) -> mostramos os resultados num painel.
//
// Por que um painel (modal) e não trocar os cards da página?
// O carrossel (carrossel.js) guarda a lista de cards uma única vez ao
// carregar a página. Se trocássemos os cards, ele quebraria. O painel é
// independente e funciona igual em TODAS as páginas que têm a busca.
// =====================================================================
(function () {
  'use strict';

  const form = document.getElementById('searchForm');
  const campo = document.getElementById('search-input');
  if (!form || !campo) return; // página sem campo de busca

  // Pasta "src" do front-end, descoberta a partir do caminho DESTE arquivo
  // (.../src/scripts/commons/search.js -> sobe 2 níveis -> .../src/).
  // Assim as imagens (guardadas no banco como "assets/images/...") e o link do
  // carrinho funcionam em qualquer página e em qualquer servidor.
  const scriptAtual = document.currentScript && document.currentScript.src;
  const SRC_BASE = new URL('../../', scriptAtual || window.location.href);

  let overlay, titulo, corpo, botaoFechar;
  let numeroDaBusca = 0; // evita que uma resposta antiga sobrescreva a mais nova

  // ---------------------------------------------------------------
  // Painel de resultados (criado só na primeira busca)
  // ---------------------------------------------------------------
  function criarPainel() {
    overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.hidden = true;

    const painel = document.createElement('div');
    painel.className = 'search-panel';
    painel.setAttribute('role', 'dialog');
    painel.setAttribute('aria-modal', 'true');
    painel.setAttribute('aria-labelledby', 'searchTitle');

    const cabecalho = document.createElement('div');
    cabecalho.className = 'search-panel-header';

    titulo = document.createElement('h2');
    titulo.id = 'searchTitle';

    botaoFechar = document.createElement('button');
    botaoFechar.type = 'button';
    botaoFechar.className = 'search-close';
    botaoFechar.setAttribute('aria-label', 'Fechar resultados');
    botaoFechar.textContent = '×';

    corpo = document.createElement('div');
    corpo.className = 'search-results';
    corpo.setAttribute('aria-live', 'polite'); // leitores de tela anunciam o resultado

    cabecalho.append(titulo, botaoFechar);
    painel.append(cabecalho, corpo);
    overlay.append(painel);
    document.body.append(overlay);

    botaoFechar.addEventListener('click', fechar);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) fechar(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay.hidden) fechar();
    });
  }

  function abrir() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden'; // trava a rolagem da página ao fundo
    botaoFechar.focus();
  }

  function fechar() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    campo.focus();
  }

  // ---------------------------------------------------------------
  // Renderização
  // ---------------------------------------------------------------
  // Mostra uma mensagem simples (carregando, vazio ou erro).
  function mostrarMensagem(texto, classe) {
    const p = document.createElement('p');
    p.className = 'search-message' + (classe ? ' ' + classe : '');
    p.textContent = texto;
    corpo.replaceChildren(p);
  }

  // 7.99 (número vindo do Java) -> "R$ 7,99" (formato que o carrinho já usa).
  function formatarPreco(valor) {
    return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
  }

  // Monta um card de produto. Usamos textContent (e não innerHTML) para que
  // qualquer texto vindo do banco seja tratado só como texto: isso evita XSS.
  function criarCard(produto) {
    const imagem = produto.imagens.find((i) => i.tipo === 'MOBILE') || produto.imagens[0];
    const urlImagem = imagem ? new URL(imagem.url, SRC_BASE).href : '';
    const preco = formatarPreco(produto.preco);

    const card = document.createElement('article');
    card.className = 'search-card';

    const img = document.createElement('img');
    img.src = urlImagem;
    img.alt = produto.nome;

    const info = document.createElement('div');
    info.className = 'search-card-info';

    const nome = document.createElement('h3');
    nome.textContent = produto.nome;

    const descricao = document.createElement('p');
    descricao.className = 'search-card-desc';
    descricao.textContent = produto.descricao || '';

    const rodape = document.createElement('div');
    rodape.className = 'search-card-bottom';

    const precoEl = document.createElement('span');
    precoEl.textContent = preco;

    const comprar = document.createElement('button');
    comprar.type = 'button';
    comprar.className = 'search-card-buy';
    comprar.textContent = 'Comprar';

    // Mesmo comportamento do botão "Comprar" do cardápio: adiciona ao carrinho
    // (usando o carrinho do buttons.js) e abre a página do carrinho.
    comprar.addEventListener('click', () => {
      if (!window.appCakeCart) {
        alert('Carrinho indisponível nesta página.');
        return;
      }
      window.appCakeCart.add({
        id: produto.nome.toLowerCase(), // mesmo padrão do buttons.js
        title: produto.nome,
        price: preco,
        image: urlImagem
      });
      window.location.href = new URL('pages/carrinho.html', SRC_BASE).href;
    });

    rodape.append(precoEl, comprar);
    info.append(nome, descricao, rodape);
    card.append(img, info);
    return card;
  }

  function mostrarResultados(produtos, termo) {
    if (produtos.length === 0) {
      mostrarMensagem('Nenhum sabor encontrado para “' + termo + '”.');
      return;
    }
    corpo.replaceChildren(...produtos.map(criarCard));
  }

  // ---------------------------------------------------------------
  // Evento principal: envio do formulário (Enter no campo de busca)
  // ---------------------------------------------------------------
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault(); // impede a página de recarregar

    const termo = campo.value.trim();
    const minhaBusca = ++numeroDaBusca;

    if (!overlay) criarPainel();
    titulo.textContent = termo ? 'Resultados para “' + termo + '”' : 'Todos os sabores';
    mostrarMensagem('Buscando…');
    abrir();

    try {
      const produtos = await window.appCakeApi.pesquisar(termo);
      if (minhaBusca !== numeroDaBusca) return; // chegou uma busca mais nova: ignora esta
      mostrarResultados(produtos, termo);
    } catch (erro) {
      console.error(erro);
      if (minhaBusca !== numeroDaBusca) return;
      mostrarMensagem('Não foi possível pesquisar agora. Verifique se o servidor está ligado.', 'search-error');
    }
  });
})();
