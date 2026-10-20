-- =====================================================================
-- APP CAKE - Script de criação do banco de dados (MySQL 8+)
-- Como executar:  mysql -u root -p < sql/schema.sql
-- (ou abra este arquivo no MySQL Workbench e clique em "Execute")
-- =====================================================================

-- 1) Cria o banco com utf8mb4 (suporta acentos e emojis).
--    A collation "unicode_ci" ignora maiúsculas/minúsculas e acentos nas
--    comparações, então buscar "acucar" também acha "Açúcar".
CREATE DATABASE IF NOT EXISTS appcake
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE appcake;

-- 2) Remove as tabelas antigas (filha primeiro, por causa da chave estrangeira).
--    Isso permite rodar o script várias vezes durante o desenvolvimento.
DROP TABLE IF EXISTS imagem_produto;
DROP TABLE IF EXISTS produto;

-- 3) Tabela PRODUTO: um registro por sabor de cupcake.
CREATE TABLE produto (
  id          BIGINT        NOT NULL AUTO_INCREMENT,
  nome        VARCHAR(80)   NOT NULL,                 -- o sabor (é aqui que a pesquisa procura)
  descricao   VARCHAR(255)  NULL,
  preco       DECIMAL(8,2)  NOT NULL,                 -- DECIMAL evita erros de arredondamento com dinheiro
  mais_pedido BOOLEAN       NOT NULL DEFAULT FALSE,   -- TRUE = aparece em "Mais pedidos"
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
  url        VARCHAR(255) NOT NULL,                              -- caminho da imagem no front-end
  tipo       ENUM('MOBILE','TABLET','DESKTOP') NOT NULL,         -- espelha o enum TipoImagem do Java
  PRIMARY KEY (id),
  -- Um produto só pode ter UMA imagem de cada tipo.
  UNIQUE KEY uk_imagem_produto_tipo (produto_id, tipo),
  -- ON DELETE CASCADE: se o produto for apagado, suas imagens vão junto.
  CONSTRAINT fk_imagem_produto
    FOREIGN KEY (produto_id) REFERENCES produto (id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5) Dados iniciais: os 9 sabores que aparecem no front-end.
--    ATENÇÃO: preços e descrições são EXEMPLOS. Ajuste para os valores reais.
INSERT INTO produto (id, nome, descricao, preco, mais_pedido, ativo) VALUES
  (1, 'Chocolate',      'Massa de chocolate com cobertura cremosa de chocolate.',   8.50, TRUE,  TRUE),
  (2, 'Doce de Leite',  'Massa fofinha recheada com doce de leite.',                8.50, TRUE,  TRUE),
  (3, 'Red Velvet',     'Massa aveludada vermelha com cobertura de cream cheese.',  9.50, TRUE,  TRUE),
  (4, 'Baunilha',       'Massa de baunilha com cobertura suave.',                   7.50, TRUE,  TRUE),
  (5, 'Ganache',        'Cobertura de ganache de chocolate meio amargo.',           9.00, TRUE,  TRUE),
  (6, 'Morango',        'Massa com pedaços de morango e cobertura rosa.',           8.50, TRUE,  TRUE),
  (7, 'Ganache Branco', 'Cobertura de ganache de chocolate branco.',                9.00, FALSE, TRUE),
  (8, 'Cenoura',        'Massa de cenoura com cobertura de brigadeiro.',            8.00, FALSE, TRUE),
  (9, 'Pistache',       'Massa com pistache e cobertura cremosa.',                 10.00, FALSE, TRUE);

-- 6) Imagens: dois tamanhos por sabor (mobile "-sm" e tablet "-md"),
--    seguindo os nomes de arquivo usados no seu index.html.
--    O tamanho DESKTOP existe no enum, mas não foi cadastrado porque não
--    vi os nomes dos arquivos de desktop dos cupcakes. Adicione quando tiver.
INSERT INTO imagem_produto (produto_id, url, tipo) VALUES
  (1, '/src/assets/images/mobile/cupcake-chocolate-sm.png',    'MOBILE'),
  (1, '/src/assets/images/tablet/cupcake-chocolate-md.png',    'TABLET'),
  (2, '/src/assets/images/mobile/cupcake-doceleite-sm.png',    'MOBILE'),
  (2, '/src/assets/images/tablet/cupcake-doceleite-md.png',    'TABLET'),
  (3, '/src/assets/images/mobile/cupcake-redvelvet-sm.png',    'MOBILE'),
  (3, '/src/assets/images/tablet/cupcake-redvelvet-md.png',    'TABLET'),
  (4, '/src/assets/images/mobile/cupcake-baunilha-sm.png',     'MOBILE'),
  (4, '/src/assets/images/tablet/cupcake-baunilha-md.png',     'TABLET'),
  (5, '/src/assets/images/mobile/cupcake-ganache-sm.png',      'MOBILE'),
  (5, '/src/assets/images/tablet/cupcake-ganache-md.png',      'TABLET'),
  (6, '/src/assets/images/mobile/cupcake-morango-sm.png',      'MOBILE'),
  (6, '/src/assets/images/tablet/cupcake-morango-md.png',      'TABLET'),
  (7, '/src/assets/images/mobile/cupcake-ganacheWhite-sm.png', 'MOBILE'),
  (7, '/src/assets/images/tablet/cupcake-ganacheWhite-md.png', 'TABLET'),
  (8, '/src/assets/images/mobile/cupcake-cenoura-sm.png',      'MOBILE'),
  (8, '/src/assets/images/tablet/cupcake-cenoura-md.png',      'TABLET'),
  (9, '/src/assets/images/mobile/cupcake-pistache-sm.png',     'MOBILE'),
  (9, '/src/assets/images/tablet/cupcake-pistache-md.png',     'TABLET');

-- 7) Teste rápido: a mesma consulta que o Java vai fazer na pesquisa.
--    Deve retornar "Chocolate" (e não "Ganache Branco").
-- SELECT p.id, p.nome FROM produto p
--  WHERE LOWER(p.nome) LIKE '%choc%' AND p.ativo = TRUE;
