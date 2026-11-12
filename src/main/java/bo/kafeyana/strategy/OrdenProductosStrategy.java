package bo.kafeyana.strategy;

import bo.kafeyana.model.Producto;
import java.util.List;

/** STRATEGY: contrato para cambiar la forma de ordenar el catálogo. */
public interface OrdenProductosStrategy {
    String codigo();
    List<Producto> ordenar(List<Producto> productos);
}
