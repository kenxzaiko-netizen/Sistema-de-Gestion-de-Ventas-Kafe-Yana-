package bo.kafeyana.service;

import bo.kafeyana.dto.CompraRegistrada;
import bo.kafeyana.dto.ItemSolicitud;
import bo.kafeyana.dto.SolicitudCompra;
import bo.kafeyana.model.Producto;
import bo.kafeyana.repository.CompraRepository;
import bo.kafeyana.repository.ProductoRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** Reglas de negocio: valida, calcula y registra una compra de forma atómica. */
@Service
public class CompraService {
    private final ProductoRepository productos;
    private final CompraRepository compras;

    public CompraService(ProductoRepository productos, CompraRepository compras) {
        this.productos = productos;
        this.compras = compras;
    }

    private record Linea(Producto producto, int cantidad, int subtotalCentavos) {}

    @Transactional
    public CompraRegistrada registrar(SolicitudCompra solicitud) {
        if (solicitud == null || solicitud.cliente() == null ||
                solicitud.cliente().isBlank() || solicitud.cliente().trim().length() > 100) {
            throw error("Ingresa un nombre de hasta 100 caracteres.");
        }
        List<ItemSolicitud> articulos = solicitud.articulos();
        if (articulos == null || articulos.isEmpty() || articulos.size() > 20) {
            throw error("Agrega de 1 a 20 productos al carrito.");
        }
        Map<Integer, Integer> cantidades = new LinkedHashMap<>();
        for (ItemSolicitud item : articulos) {
            if (item == null || item.productoId() == null || item.cantidad() == null ||
                    item.cantidad() < 1 || item.cantidad() > 99) {
                throw error("La cantidad debe estar entre 1 y 99.");
            }
            int cantidadActual = cantidades.getOrDefault(item.productoId(), 0);
            int nuevaCantidad = cantidadActual + item.cantidad(); // <= 198 (sin overflow)
            if (nuevaCantidad > 99) throw error("Máximo 99 unidades por producto.");
            cantidades.put(item.productoId(), nuevaCantidad);
        }

        List<Linea> lineas = new java.util.ArrayList<>();
        int total = 0;
        try {
            for (Map.Entry<Integer, Integer> entrada : cantidades.entrySet()) {
                Producto producto = productos.encontrarPorId(entrada.getKey())
                        .orElseThrow(() -> error("Producto no encontrado: " + entrada.getKey()));
                int subtotal = Math.multiplyExact(producto.precioCentavos(), entrada.getValue());
                total = Math.addExact(total, subtotal);
                lineas.add(new Linea(producto, entrada.getValue(), subtotal));
            }
        } catch (ArithmeticException ex) {
            throw error("El monto de la compra excede el máximo permitido.");
        }

        int id = compras.crearCompra(solicitud.cliente().trim(), total);
        for (Linea linea : lineas) {
            Producto p = linea.producto();
            compras.agregarDetalle(id, p.id(), p.nombre(), linea.cantidad(),
                    p.precioCentavos(), linea.subtotalCentavos());
        }
        return new CompraRegistrada(id, total, "Compra registrada correctamente.");
    }

    private ResponseStatusException error(String mensaje) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, mensaje);
    }
}
