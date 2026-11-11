package bo.kafeyana.strategy;

import bo.kafeyana.model.Producto;
import java.util.List;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class OrdenProductosStrategyTest {
    private final List<Producto> productos = List.of(
            new Producto(3, "Zumo", 1400),
            new Producto(1, "Café", 2000),
            new Producto(2, "Agua", 1000));

    @Test void ordenaPorNombre() {
        assertEquals(List.of(2, 1, 3), new OrdenPorNombreStrategy()
                .ordenar(productos).stream().map(Producto::id).toList());
    }

    @Test void ordenaPorPrecio() {
        assertEquals(List.of(2, 3, 1), new OrdenPorPrecioStrategy()
                .ordenar(productos).stream().map(Producto::id).toList());
    }

    @Test void ordenaPorId() {
        assertEquals(List.of(1, 2, 3), new OrdenPorIdStrategy()
                .ordenar(productos).stream().map(Producto::id).toList());
    }
}
