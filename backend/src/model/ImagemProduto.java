package model;

/**
 * Representa UMA imagem de um produto em um determinado tamanho.
 * É um POJO (classe simples): atributos privados + construtor + getters.
 * Não tem setters porque a imagem, depois de lida do banco, não muda.
 */
public class ImagemProduto {

    private final long id;
    private final String url;
    private final TipoImagem tipo;

    public ImagemProduto(long id, String url, TipoImagem tipo) {
        this.id = id;
        this.url = url;
        this.tipo = tipo;
    }

    public long getId() { return id; }
    public String getUrl() { return url; }
    public TipoImagem getTipo() { return tipo; }
}
