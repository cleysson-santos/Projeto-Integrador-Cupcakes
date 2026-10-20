package service;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import dao.ProdutoDAO;
import model.Produto;

/**
 * Camada de REGRAS DE NEGÓCIO.
 * Não sabe nada de HTTP (quem chama) nem de SQL (quem guarda os dados):
 * só decide O QUE fazer com os pedidos.
 *
 * Recebe o DAO pelo construtor ("injeção de dependência manual").
 * Assim, em testes, dá para passar um DAO falso no lugar do MySQL.
 */
public class ProdutoService {

    private final ProdutoDAO dao;

    public ProdutoService(ProdutoDAO dao) {
        this.dao = dao;
    }

    public List<Produto> listar() throws SQLException {
        return dao.listarTodos();
    }

    /**
     * REGRA DA PESQUISA:
     *  - termo vazio/nulo -> devolve o catálogo inteiro (o usuário limpou o campo);
     *  - caso contrário   -> remove espaços das pontas e pesquisa pelo sabor.
     */
    public List<Produto> pesquisarPorSabor(String termo) throws SQLException {
        if (termo == null || termo.isBlank()) {
            return dao.listarTodos();
        }
        return dao.buscarPorNome(termo.trim());
    }

    public Optional<Produto> buscarPorId(long id) throws SQLException {
        return dao.buscarPorId(id);
    }

    public List<Produto> listarMaisPedidos() throws SQLException {
        return dao.listarMaisPedidos();
    }
}
