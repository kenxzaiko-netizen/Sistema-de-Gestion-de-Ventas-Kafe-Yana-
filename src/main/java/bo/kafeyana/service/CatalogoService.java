package bo.kafeyana.service;

import bo.kafeyana.model.Producto;
import bo.kafeyana.repository.ProductoRepository;
import bo.kafeyana.strategy.OrdenProductosStrategy;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** Contexto del patrón Strategy: elige la estrategia solicitada. */
@Service
public class CatalogoService {
    private final ProductoRepository productos;
    private final Map<String, OrdenProductosStrategy> estrategias;

    public CatalogoService(ProductoRepository productos, List<OrdenProductosStrategy> estrategias) {
        this.productos = productos;
        this.estrategias = estrategias.stream().collect(
                Collectors.toUnmodifiableMap(OrdenProductosStrategy::codigo, Function.identity()));
    }

    public List<Producto> listar(String orden) {
        String codigo = orden == null || orden.isBlank() ? "id" : orden.trim().toLowerCase(java.util.Locale.ROOT);
        OrdenProductosStrategy estrategia = estrategias.get(codigo);
        if (estrategia == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Orden no válido. Usa id, nombre o precio.");
        }
        return estrategia.ordenar(productos.encontrarTodos());
    }
}
