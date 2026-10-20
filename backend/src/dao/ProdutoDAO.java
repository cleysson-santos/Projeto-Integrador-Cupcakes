package dao;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import model.Produto;

/**
 * CONTRATO de acesso a dados de produtos (padrão DAO - Data Access Object).
 *
 * A interface define O QUE pode ser feito; a classe ProdutoDAOImpl define COMO
 * (com JDBC/MySQL). O Service só conhece esta interface, então seria possível
 * trocar o MySQL por outro banco criando outra implementação, sem mexer no Service.
 * Isso é baixo acoplamento + polimorfismo.
 */
public interface ProdutoDAO {

    /** Todos os produtos ativos, ordenados por nome. */
    List<Produto> listarTodos() throws SQLException;

    /** Produtos ativos cujo nome (sabor) CONTÉM o termo. É a PESQUISA. */
    List<Produto> buscarPorNome(String termo) throws SQLException;

    /** Um produto ativo pelo id, ou Optional vazio se não existir. */
    Optional<Produto> buscarPorId(long id) throws SQLException;

    /** Produtos ativos marcados como "mais pedidos". */
    List<Produto> listarMaisPedidos() throws SQLException;
}
