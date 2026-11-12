package bo.kafeyana.strategy;

import bo.kafeyana.model.Producto;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Component;

/** Estrategia predeterminada: orden de productos en la base de datos. */
@Component
public class OrdenPorIdStrategy implements OrdenProductosStrategy {
    @Override public String codigo() { return "id"; }
    @Override public List<Producto> ordenar(List<Producto> productos) {
        return productos.stream().sorted(Comparator.comparingInt(Producto::id)).toList();
    }
}
