package bo.kafeyana.strategy;

import bo.kafeyana.model.Producto;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Component;

/** Estrategia alternativa: productos del más económico al más caro. */
@Component
public class OrdenPorPrecioStrategy implements OrdenProductosStrategy {
    @Override public String codigo() { return "precio"; }
    @Override public List<Producto> ordenar(List<Producto> productos) {
        return productos.stream().sorted(Comparator.comparingInt(Producto::precioCentavos)
                .thenComparingInt(Producto::id)).toList();
    }
}
