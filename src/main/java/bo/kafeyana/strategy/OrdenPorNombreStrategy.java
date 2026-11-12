package bo.kafeyana.strategy;

import bo.kafeyana.model.Producto;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Component;

/** Estrategia alternativa: productos ordenados alfabéticamente. */
@Component
public class OrdenPorNombreStrategy implements OrdenProductosStrategy {
    @Override public String codigo() { return "nombre"; }
    @Override public List<Producto> ordenar(List<Producto> productos) {
        return productos.stream().sorted(Comparator.comparing(Producto::nombre,
                String.CASE_INSENSITIVE_ORDER).thenComparingInt(Producto::id)).toList();
    }
}
