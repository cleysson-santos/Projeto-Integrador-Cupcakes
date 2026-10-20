package util;

import java.util.List;

import model.ImagemProduto;
import model.Produto;

/**
 * Converte objetos Java em texto JSON, "na mão" (sem bibliotecas como Jackson/Gson).
 *
 * Exemplo de saída para um produto:
 * {"id":1,"nome":"Chocolate","descricao":"...","preco":8.50,"maisPedido":true,
 *  "imagens":[{"tipo":"MOBILE","url":"/src/..."},{"tipo":"TABLET","url":"/src/..."}]}
 */
public final class JsonUtil {

    private JsonUtil() { }

    /** Converte UM produto em um objeto JSON. */
    public static String toJson(Produto p) {
        StringBuilder sb = new StringBuilder();
        sb.append('{');
        sb.append("\"id\":").append(p.getId()).append(',');
        sb.append("\"nome\":").append(texto(p.getNome())).append(',');
        sb.append("\"descricao\":").append(texto(p.getDescricao())).append(',');
        // toPlainString evita notação científica (ex.: 8.5E+1)
        sb.append("\"preco\":")
          .append(p.getPreco() == null ? "null" : p.getPreco().toPlainString()).append(',');
        sb.append("\"maisPedido\":").append(p.isMaisPedido()).append(',');

        // Array de imagens
        sb.append("\"imagens\":[");
        List<ImagemProduto> imagens = p.getImagens();
        for (int i = 0; i < imagens.size(); i++) {
            if (i > 0) sb.append(',');   // vírgula entre itens, nunca depois do último
            ImagemProduto img = imagens.get(i);
            sb.append("{\"tipo\":").append(texto(img.getTipo().name()))
              .append(",\"url\":").append(texto(img.getUrl())).append('}');
        }
        sb.append("]}");
        return sb.toString();
    }

    /** Converte uma LISTA de produtos em um array JSON. */
    public static String toJson(List<Produto> produtos) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < produtos.size(); i++) {
            if (i > 0) sb.append(',');
            sb.append(toJson(produtos.get(i)));
        }
        return sb.append(']').toString();
    }

    /** Monta um JSON de erro padronizado: {"erro":"mensagem"}. */
    public static String erro(String mensagem) {
        return "{\"erro\":" + texto(mensagem) + "}";
    }

    /**
     * Transforma um String Java em um texto JSON válido:
     * coloca entre aspas e escapa caracteres especiais
     * (aspas, barra invertida, quebra de linha, etc.).
     * Sem esse cuidado, um texto com aspas quebraria o JSON inteiro.
     */
    private static String texto(String s) {
        if (s == null) return "null";
        StringBuilder sb = new StringBuilder("\"");
        for (char c : s.toCharArray()) {
            switch (c) {
                case '"':  sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\n': sb.append("\\n");  break;
                case '\r': sb.append("\\r");  break;
                case '\t': sb.append("\\t");  break;
                default:
                    if (c < 0x20) sb.append(String.format("\\u%04x", (int) c)); // outros caracteres de controle
                    else sb.append(c);
            }
        }
        return sb.append('"').toString();
    }
}
