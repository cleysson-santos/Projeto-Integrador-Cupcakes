import java.net.InetSocketAddress;
import java.sql.Connection;
import java.util.concurrent.Executors;

import com.sun.net.httpserver.HttpServer;

import dao.ProdutoDAO;
import dao.ProdutoDAOImpl;
import service.ProdutoService;
import util.ConexaoFactory;
import web.ProdutoHandler;

/**
 * Ponto de entrada do back-end do App Cake.
 *
 * Aqui "montamos" as camadas, de baixo para cima (injeção de dependência manual):
 *     DAO  ->  Service  ->  Handler  ->  Servidor HTTP
 *
 * Para executar (veja o README):  java -cp "out;lib/*" Main
 */
public class Main {

    @SuppressWarnings("try") // a conexão de teste só precisa abrir e fechar
    static void main(String[] args) throws Exception {

        // Porta do servidor: variável de ambiente PORT, ou 8080 por padrão.
        int porta = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));

        //    Testa a conexão com o MySQL na inicialização.
        //    Se falhar, o erro aparece AGORA (e não só na primeira busca).
        try (Connection teste = ConexaoFactory.obterConexao()) {
            System.out.println("[OK] Conectado ao MySQL.");
        } catch (Exception e) {
            System.err.println("[ERRO] Não foi possível conectar ao MySQL: " + e.getMessage());
            System.err.println("Confira: MySQL ligado? schema.sql executado? DB_USER/DB_PASSWORD corretos? driver em lib/?");
            return;
        }

        //    Monta as camadas, cada uma recebendo a de baixo.
        ProdutoDAO dao = new ProdutoDAOImpl();
        ProdutoService service = new ProdutoService(dao);
        ProdutoHandler handler = new ProdutoHandler(service);

        //    Cria o servidor HTTP do JDK e liga a rota ao handler.
        HttpServer servidor = HttpServer.create(new InetSocketAddress(porta), 0);
        servidor.createContext(ProdutoHandler.BASE, handler);

        // Pool de 8 threads: permite atender várias requisições ao mesmo tempo.
        servidor.setExecutor(Executors.newFixedThreadPool(8));
        servidor.start();

        System.out.println("[OK] Servidor no ar: http://localhost:" + porta + ProdutoHandler.BASE);
        System.out.println("     Teste: http://localhost:" + porta + ProdutoHandler.BASE + "/pesquisa?termo=choc");
        System.out.println("     (Ctrl+C para parar)");
    }
}
