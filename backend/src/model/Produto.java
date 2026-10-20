package model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Representa um cupcake do catálogo (uma linha da tabela "produto").
 *
 * Relacionamento: um Produto POSSUI várias ImagemProduto (composição).
 * Por isso a lista de imagens fica dentro do próprio Produto.
 *
 * Usamos BigDecimal para o preço (e não double) porque double comete
 * erros de arredondamento, o que é inaceitável com dinheiro.
 */
public class Produto {

    private final long id;
    private final String nome;          // o sabor
    private final String descricao;
    private final BigDecimal preco;
    private final boolean maisPedido;   // aparece em "Mais pedidos"?
    private final boolean ativo;        // false = produto "removido"
    private final List<ImagemProduto> imagens = new ArrayList<>();

    public Produto(long id, String nome, String descricao, BigDecimal preco,
                   boolean maisPedido, boolean ativo) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.maisPedido = maisPedido;
        this.ativo = ativo;
    }

    /** Adiciona uma imagem ao produto (usado pelo DAO ao montar o objeto). */
    public void adicionarImagem(ImagemProduto imagem) {
        imagens.add(imagem);
    }

    public long getId() { return id; }
    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
    public BigDecimal getPreco() { return preco; }
    public boolean isMaisPedido() { return maisPedido; }
    public boolean isAtivo() { return ativo; }

    /** Devolve uma visão somente-leitura: quem chama não consegue alterar nossa lista interna (encapsulamento). */
    public List<ImagemProduto> getImagens() {
        return Collections.unmodifiableList(imagens);
    }
}
