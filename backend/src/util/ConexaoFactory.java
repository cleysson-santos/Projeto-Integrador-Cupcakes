package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Fábrica de conexões com o MySQL via JDBC.
 *
 * Centraliza URL, usuário e senha em UM só lugar: se algo mudar,
 * só esta classe precisa ser editada.
 *
 * Os valores são lidos de VARIÁVEIS DE AMBIENTE (para não deixar senha
 * escrita no código). Se a variável não existir, usa o valor padrão abaixo.
 *   DB_URL       -> padrão: jdbc:mysql://localhost:3306/appcake
 *   DB_USER      -> padrão: root
 *   DB_PASSWORD  -> padrão: (vazio)  <-- defina a sua senha do MySQL!
 *
 * O driver (mysql-connector-j.jar) se registra sozinho no DriverManager
 * desde o JDBC 4, então não é preciso chamar Class.forName(...).
 */
public final class ConexaoFactory {

    private static final String URL = valor("DB_URL",
            "jdbc:mysql://localhost:3306/appcake"
            + "?useSSL=false&allowPublicKeyRetrieval=true"
            + "&serverTimezone=UTC&characterEncoding=UTF-8");
    private static final String USUARIO = valor("DB_USER", "root");
    private static final String SENHA = valor("DB_PASSWORD", "");

    /** Construtor privado: classe utilitária, não deve ser instanciada. */
    private ConexaoFactory() { }

    /**
     * Abre uma NOVA conexão a cada chamada.
     * Quem pedir a conexão deve fechá-la (usamos try-with-resources no DAO).
     */
    public static Connection obterConexao() throws SQLException {
        return DriverManager.getConnection(URL, USUARIO, SENHA);
    }

    /** Lê uma variável de ambiente, ou devolve o padrão se ela não existir. */
    private static String valor(String nome, String padrao) {
        String v = System.getenv(nome);
        return (v == null || v.isEmpty()) ? padrao : v;
    }
}
