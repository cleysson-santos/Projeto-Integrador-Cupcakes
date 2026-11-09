-- =====================================================================
-- APP CAKE - Script de criação do banco de dados (MySQL 8+)
-- Como executar:  mysql -u root -p < sql/schema.sql
-- (ou abra este arquivo no MySQL Workbench e clique em "Execute")
-- Pode ser executado várias vezes: ele recria as tabelas do zero.
-- =====================================================================

-- 1) Cria o banco com utf8mb4 (suporta acentos).
--    A collation "unicode_ci" ignora maiúsculas/minúsculas e acentos nas
--    comparações: buscar "pistache" ou "PISTACHE" dá o mesmo resultado.
CREATE DATABASE IF NOT EXISTS appcake
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE appcake;

-- 2) Remove as tabelas antigas (a filha primeiro, por causa da chave estrangeira).
DROP TABLE IF EXISTS imagem_produto;
DROP TABLE IF EXISTS produto;

-- 3) Tabela PRODUTO: um registro por sabor de cupcake.
CREATE TABLE produto (
  id          BIGINT        NOT NULL AUTO_INCREMENT,
  nome        VARCHAR(80)   NOT NULL,                 -- o sabor (a pesquisa procura aqui)
  descricao   VARCHAR(500)  NULL,
  preco       DECIMAL(8,2)  NOT NULL,                 -- DECIMAL evita erros de arredondamento com dinheiro
  mais_pedido BOOLEAN       NOT NULL DEFAULT FALSE,   -- TRUE = faz parte de "Mais pedidos" da home
  ativo       BOOLEAN       NOT NULL DEFAULT TRUE,    -- FALSE = "removido" sem apagar do banco
  PRIMARY KEY (id),
  -- UNIQUE impede dois sabores com o mesmo nome e, de quebra,
  -- cria um ÍNDICE em "nome", que acelera a pesquisa.
  UNIQUE KEY uk_produto_nome (nome)
) ENGINE=InnoDB;

-- 4) Tabela IMAGEM_PRODUTO: cada linha é uma imagem de um produto
--    em um tamanho (MOBILE, TABLET ou DESKTOP).
CREATE TABLE imagem_produto (
  id         BIGINT       NOT NULL AUTO_INCREMENT,
  produto_id BIGINT       NOT NULL,                              -- chave estrangeira para produto
  url        VARCHAR(255) NOT NULL,                              -- caminho RELATIVO à pasta frontend/src
  tipo       ENUM('MOBILE','TABLET','DESKTOP') NOT NULL,         -- espelha o enum TipoImagem do Java
  PRIMARY KEY (id),
  -- Um produto só pode ter UMA imagem de cada tipo.
  UNIQUE KEY uk_imagem_produto_tipo (produto_id, tipo),
  -- ON DELETE CASCADE: se o produto for apagado, suas imagens vão junto.
  CONSTRAINT fk_imagem_produto
    FOREIGN KEY (produto_id) REFERENCES produto (id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5) Produtos.
--    Os 6 primeiros (Chocolate ... Red Velvet) vêm do cardapio.html, com
--    descrição e preço reais.
--    Ganache, Ganache Branco e Cenoura aparecem na home, mas NÃO estão no
--    cardápio: o preço (7,99) segue o padrão do site e as DESCRIÇÕES são
--    provisórias. Troque pelas descrições que você quiser.
--    mais_pedido = TRUE para os 8 sabores que aparecem em "Mais pedidos" na
--    home (todos, menos Pistache).
INSERT INTO produto (id, nome, descricao, preco, mais_pedido, ativo) VALUES
  (1, 'Chocolate',
      'Massa de chocolate macia e úmida, coberta com um delicioso creme de chocolate e finalizada com gotas de chocolate. Perfeito para quem ama um sabor intenso e irresistível.',
      7.99, TRUE, TRUE),
  (2, 'Doce de Leite',
      'Massa macia de baunilha, coberta com um cremoso recheio de doce de leite e finalizada com calda, cubos de doce de leite e farofa crocante. Uma combinação irresistível para os amantes de doces.',
      7.99, TRUE, TRUE),
  (3, 'Morango',
      'Cupcake de Morango preparado com massa macia e cobertura cremosa sabor morango, finalizado com confeitos crocantes. Uma opção deliciosa, delicada e perfeita para festas, presentes ou para adoçar qualquer momento.',
      7.99, TRUE, TRUE),
  (4, 'Baunilha',
      'Cupcake sabor baunilha, preparado com massa macia e cobertura cremosa de baunilha, finalizado com farelos e cubinhos decorativos. Uma opção deliciosa, delicada e perfeita para qualquer ocasião.',
      7.99, TRUE, TRUE),
  (5, 'Pistache',
      'Delicioso cupcake com massa de pistache fofinha, coberto com uma generosa camada de pistache cremoso e finalizado com granulado de pistache. Perfeito para adoçar qualquer momento.',
      7.99, FALSE, TRUE),
  (6, 'Red Velvet',
      'Delicioso cupcake com massa de red velvet fofinha, coberto com uma generosa camada de baunilha cremoso e finalizado com granulado de red velvet. Perfeito para adoçar qualquer momento.',
      7.99, TRUE, TRUE),
  (7, 'Ganache',
      'Cupcake com cobertura de ganache de chocolate. (descrição provisória)',
      7.99, TRUE, TRUE),
  (8, 'Ganache Branco',
      'Cupcake com cobertura de ganache de chocolate branco. (descrição provisória)',
      7.99, TRUE, TRUE),
  (9, 'Cenoura',
      'Cupcake de massa de cenoura macia com cobertura cremosa. (descrição provisória)',
      7.99, TRUE, TRUE);

-- 6) Imagens: os caminhos são RELATIVOS à pasta frontend/src, para funcionar
--    em qualquer página e de qualquer jeito que o site seja aberto.
--    Seguem exatamente os arquivos que existem em frontend/src/assets/images.
--    - MOBILE = pasta "mobile" (-sm), a mesma usada no cardápio;
--    - TABLET = pasta "tablet" (-md), a mesma usada nos cards da home.
--    - Cenoura só tem imagem TABLET (não existe a versão mobile).
--    - DESKTOP existe no enum, mas ainda não há imagens de cupcake desse tamanho.
INSERT INTO imagem_produto (produto_id, url, tipo) VALUES
  (1, 'assets/images/mobile/cupcake-chocolate-sm.png',    'MOBILE'),
  (1, 'assets/images/tablet/cupcake-chocolate-md.png',    'TABLET'),
  (2, 'assets/images/mobile/cupcake-doceleite-sm.png',    'MOBILE'),
  (2, 'assets/images/tablet/cupcake-doceleite-md.png',    'TABLET'),
  (3, 'assets/images/mobile/cupcake-morango-sm.png',      'MOBILE'),
  (3, 'assets/images/tablet/cupcake-morango-md.png',      'TABLET'),
  (4, 'assets/images/mobile/cupcake-baunilha-sm.png',     'MOBILE'),
  (4, 'assets/images/tablet/cupcake-baunilha-md.png',     'TABLET'),
  (5, 'assets/images/mobile/cupcake-pistache-sm.png',     'MOBILE'),
  (5, 'assets/images/tablet/cupcake-pistache-md.png',     'TABLET'),
  (6, 'assets/images/mobile/cupcake-redvelvet-sm.png',    'MOBILE'),
  (6, 'assets/images/tablet/cupcake-redvelvet-md.png',    'TABLET'),
  (7, 'assets/images/mobile/cupcake-ganache-sm.png',      'MOBILE'),
  (7, 'assets/images/tablet/cupcake-ganache-md.png',      'TABLET'),
  (8, 'assets/images/mobile/cupcake-ganacheWhite-sm.png', 'MOBILE'),
  (8, 'assets/images/tablet/cupcake-ganacheWhite-md.png', 'TABLET'),
  (9, 'assets/images/tablet/cupcake-cenoura-md.png',      'TABLET');

-- 7) Teste rápido: a mesma consulta que o Java faz na pesquisa.
--    Deve retornar "Chocolate" (e não "Ganache Branco").
-- SELECT id, nome FROM produto WHERE LOWER(nome) LIKE '%choc%' AND ativo = TRUE;
