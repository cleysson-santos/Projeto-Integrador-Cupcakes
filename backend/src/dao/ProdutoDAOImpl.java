package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import model.ImagemProduto;
import model.Produto;
import model.TipoImagem;
import util.ConexaoFactory;

/**
 * Implementação do ProdutoDAO usando JDBC puro (sem frameworks).
 *
 * Ideia central: uma consulta com LEFT JOIN traz o produto E suas imagens de
 * uma vez. Como o JOIN gera uma linha por imagem, depois "agrupamos" as linhas
 * por produto (método mapear) para montar um objeto Produto com sua lista.
 */
public class ProdutoDAOImpl implements ProdutoDAO {

    /**
     * Parte comum de todas as consultas. LEFT JOIN (e não INNER JOIN) garante que
     * um produto sem nenhuma imagem ainda apareça na lista.
     */
    private static final String SELECT_BASE =
            "SELECT p.id, p.nome, p.descricao, p.preco, p.mais_pedido, p.ativo, "
          + "       i.id AS imagem_id, i.url, i.tipo "
          + "FROM produto p "
          + "LEFT JOIN imagem_produto i ON i.produto_id = p.id ";

    /** Pequena interface funcional: "como preencher os ? do SQL". */
    @FunctionalInterface
    private interface Preparador {
        void preparar(PreparedStatement ps) throws SQLException;
    }

    @Override
    public List<Produto> listarTodos() throws SQLException {
        String sql = SELECT_BASE + "WHERE p.ativo = TRUE ORDER BY p.nome, i.id";
        return consultar(sql, ps -> { /* nenhum parâmetro */ });
    }

    @Override
    public List<Produto> buscarPorNome(String termo) throws SQLException {
        // Os "?" são preenchidos depois pelo PreparedStatement.
        // Isso PROTEGE CONTRA SQL INJECTION: o termo nunca é concatenado
        // no SQL, o banco o trata sempre como dado, nunca como comando.
        String sql = SELECT_BASE
                + "WHERE p.ativo = TRUE AND LOWER(p.nome) LIKE ? ESCAPE '\\\\' "
                + "ORDER BY p.nome, i.id";

        // % antes e depois = "contém o termo em qualquer posição".
        String padrao = "%" + escaparCuringas(termo.toLowerCase()) + "%";
        return consultar(sql, ps -> ps.setString(1, padrao));
    }

    @Override
    public Optional<Produto> buscarPorId(long id) throws SQLException {
        String sql = SELECT_BASE + "WHERE p.ativo = TRUE AND p.id = ? ORDER BY i.id";
        List<Produto> lista = consultar(sql, ps -> ps.setLong(1, id));
        return lista.isEmpty() ? Optional.empty() : Optional.of(lista.get(0));
    }

    @Override
    public List<Produto> listarMaisPedidos() throws SQLException {
        String sql = SELECT_BASE
                + "WHERE p.ativo = TRUE AND p.mais_pedido = TRUE ORDER BY p.nome, i.id";
        return consultar(sql, ps -> { /* nenhum parâmetro */ });
    }

    // ------------------------------------------------------------------
    // Métodos auxiliares (evitam repetir o mesmo código em cada consulta)
    // ------------------------------------------------------------------

    /**
     * Abre a conexão, executa o SQL e devolve os produtos montados.
     * try-with-resources fecha Connection, PreparedStatement e ResultSet
     * automaticamente, mesmo se ocorrer erro (evita vazamento de conexões).
     */
    private List<Produto> consultar(String sql, Preparador preparador) throws SQLException {
        try (Connection conexao = ConexaoFactory.obterConexao();
             PreparedStatement ps = conexao.prepareStatement(sql)) {
            preparador.preparar(ps);
            try (ResultSet rs = ps.executeQuery()) {
                return mapear(rs);
            }
        }
    }

    /**
     * Converte as linhas do ResultSet em objetos Produto.
     * Cada linha = um produto + UMA imagem. O mapa (indexado pelo id) garante
     * que o mesmo produto seja criado só uma vez e receba todas as suas imagens.
     * LinkedHashMap mantém a ordem de chegada (a ordenação feita pelo SQL).
     */
    private List<Produto> mapear(ResultSet rs) throws SQLException {
        Map<Long, Produto> produtos = new LinkedHashMap<>();

        while (rs.next()) {
            long id = rs.getLong("id");
            Produto produto = produtos.get(id);

            if (produto == null) { // primeira vez que vemos este produto
                produto = new Produto(
                        id,
                        rs.getString("nome"),
                        rs.getString("descricao"),
                        rs.getBigDecimal("preco"),
                        rs.getBoolean("mais_pedido"),
                        rs.getBoolean("ativo"));
                produtos.put(id, produto);
            }

            // Se o produto não tem imagem, o LEFT JOIN traz imagem_id = NULL.
            long imagemId = rs.getLong("imagem_id");
            if (!rs.wasNull()) {
                produto.adicionarImagem(new ImagemProduto(
                        imagemId,
                        rs.getString("url"),
                        TipoImagem.valueOf(rs.getString("tipo")))); // texto do banco -> enum
            }
        }
        return new ArrayList<>(produtos.values());
    }

    /**
     * No LIKE, % e _ são curingas. Se o usuário digitar "50%", queremos
     * procurar o texto literal "50%". Por isso escapamos com barra invertida.
     */
    private String escaparCuringas(String texto) {
        return texto.replace("\\", "\\\\")
                    .replace("%", "\\%")
                    .replace("_", "\\_");
    }
}
