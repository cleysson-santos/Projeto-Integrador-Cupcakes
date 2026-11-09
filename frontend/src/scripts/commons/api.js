// =====================================================================
// api.js — ÚNICO arquivo do front-end que conversa com o back-end Java.
// Se o endereço do servidor mudar, só esta linha precisa ser editada.
// =====================================================================
(function () {
  'use strict';

  const API_URL = 'http://localhost:8080/api/produtos';

  // Faz o GET e devolve o JSON. Lança erro se o servidor responder com falha
  // (o fetch só falha sozinho quando a rede cai; 404/500 a gente confere aqui).
  async function buscarJson(caminho) {
    const resposta = await fetch(API_URL + caminho);
    if (!resposta.ok) {
      throw new Error('A API respondeu com erro ' + resposta.status);
    }
    return resposta.json();
  }

  // Segue o mesmo padrão do carrinho (window.appCakeCart): um objeto global
  // com as funções disponíveis para os outros scripts.
  window.appCakeApi = {
    // GET /api/produtos/pesquisa?termo=...   (termo vazio = lista tudo)
    // encodeURIComponent protege espaços e acentos (ex.: "doce de leite").
    pesquisar: (termo) => buscarJson('/pesquisa?termo=' + encodeURIComponent(termo)),

    // GET /api/produtos/mais-pedidos
    maisPedidos: () => buscarJson('/mais-pedidos'),

    // GET /api/produtos
    listar: () => buscarJson('')
  };
})();
