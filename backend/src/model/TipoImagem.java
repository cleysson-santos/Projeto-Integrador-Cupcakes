package model;

/**
 * Tamanhos de imagem que o front-end utiliza.
 * Os nomes devem ser idênticos aos valores do ENUM da coluna "tipo"
 * na tabela imagem_produto (MySQL), pois usamos TipoImagem.valueOf(...)
 * para converter o texto do banco neste enum.
 */
public enum TipoImagem {
    MOBILE,
    TABLET,
    DESKTOP
}
