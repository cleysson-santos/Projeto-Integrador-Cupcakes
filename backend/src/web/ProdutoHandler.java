package web;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import model.Produto;
import service.ProdutoService;
import util.JsonUtil;

/**
 * Camada WEB: recebe as requisições HTTP do front-end e responde em JSON.
 * Usa o servidor HTTP que já vem no JDK (com.sun.net.httpserver), então
 * não precisamos de Spring, Tomcat nem de nenhuma biblioteca extra.
 *
 * Rotas (todas GET):
 *   /api/produtos                    -> lista todos os produtos
 *   /api/produtos/pesquisa?termo=xx  -> pesquisa por sabor
 *   /api/produtos/mais-pedidos       -> lista os mais pedidos
 *   /api/produtos/{id}               -> um produto pelo id
 */
public class ProdutoHandler implements HttpHandler {

    /** Prefixo da rota; deve ser o mesmo usado em createContext no Main. */
    public static final String BASE = "/api/produtos";

    private final ProdutoService service;

    public ProdutoHandler(ProdutoService service) {
        this.service = service;
    }

    /** Chamado pelo servidor a cada requisição que bate com a rota BASE. */
    @Override
    public void handle(HttpExchange troca) throws IOException {
        try {
            liberarCors(troca);

            String metodo = troca.getRequestMethod();

            // O navegador envia um "OPTIONS" antes do fetch (preflight de CORS).
            // Basta responder 204 (sem conteúdo) com os cabeçalhos de CORS.
            if ("OPTIONS".equalsIgnoreCase(metodo)) {
                troca.sendResponseHeaders(204, -1);
                return;
            }
            if (!"GET".equalsIgnoreCase(metodo)) {
                responder(troca, 405, JsonUtil.erro("Método não permitido. Use GET."));
                return;
            }

            // Descobre qual rota foi pedida: tira o prefixo e a barra final.
            String caminho = troca.getRequestURI().getPath();
            String resto = caminho.length() > BASE.length() ? caminho.substring(BASE.length()) : "";
            if (resto.endsWith("/")) {
                resto = resto.substring(0, resto.length() - 1);
            }

            // Roteamento: decide qual método do Service chamar.
            if (resto.isEmpty()) {
                responder(troca, 200, JsonUtil.toJson(service.listar()));

            } else if (resto.equals("/pesquisa")) {
                String termo = lerParametro(troca.getRequestURI().getRawQuery(), "termo");
                List<Produto> resultado = service.pesquisarPorSabor(termo);
                responder(troca, 200, JsonUtil.toJson(resultado));

            } else if (resto.equals("/mais-pedidos")) {
                responder(troca, 200, JsonUtil.toJson(service.listarMaisPedidos()));

            } else {
                tratarBuscaPorId(troca, resto.substring(1)); // remove a "/" inicial
            }

        } catch (SQLException e) {
            // Erro de banco: registra no console (para você ver) e avisa o cliente.
            e.printStackTrace();
            responder(troca, 500, JsonUtil.erro("Erro ao acessar o banco de dados."));
        } catch (Exception e) {
            e.printStackTrace();
            responder(troca, 500, JsonUtil.erro("Erro interno no servidor."));
        } finally {
            troca.close();
        }
    }

    /** Trata /api/produtos/{id}: valida o número e busca no Service. */
    private void tratarBuscaPorId(HttpExchange troca, String textoId) throws IOException, SQLException {
        long id;
        try {
            id = Long.parseLong(textoId);
        } catch (NumberFormatException e) {
            responder(troca, 404, JsonUtil.erro("Rota não encontrada."));
            return;
        }

        Optional<Produto> produto = service.buscarPorId(id);
        if (produto.isPresent()) {
            responder(troca, 200, JsonUtil.toJson(produto.get()));
        } else {
            responder(troca, 404, JsonUtil.erro("Produto não encontrado."));
        }
    }

    /**
     * CORS: por padrão o navegador BLOQUEIA o front (ex.: localhost:5500) de
     * chamar uma API em outra porta (localhost:8080). Estes cabeçalhos dizem
     * ao navegador que essa chamada é permitida.
     * Em produção, troque "*" pelo endereço real do seu site.
     */
    private void liberarCors(HttpExchange troca) {
        Headers h = troca.getResponseHeaders();
        h.set("Access-Control-Allow-Origin", "*");
        h.set("Access-Control-Allow-Methods", "GET, OPTIONS");
        h.set("Access-Control-Allow-Headers", "Content-Type");
    }

    /** Escreve a resposta: status HTTP + corpo JSON em UTF-8 (para os acentos). */
    private void responder(HttpExchange troca, int status, String json) throws IOException {
        byte[] corpo = json.getBytes(StandardCharsets.UTF_8);
        troca.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        troca.sendResponseHeaders(status, corpo.length);
        try (OutputStream saida = troca.getResponseBody()) {
            saida.write(corpo);
        }
    }

    /**
     * Lê um parâmetro da query string. Ex.: de "termo=red%20velvet&x=1",
     * pedindo "termo", devolve "red velvet". URLDecoder converte %20, +, acentos...
     * Devolve null se o parâmetro não existir.
     */
    private String lerParametro(String queryString, String nome) {
        if (queryString == null || queryString.isEmpty()) return null;
        for (String par : queryString.split("&")) {
            String[] partes = par.split("=", 2);
            if (partes[0].equals(nome)) {
                return partes.length > 1
                        ? URLDecoder.decode(partes[1], StandardCharsets.UTF_8)
                        : "";
            }
        }
        return null;
    }
}
