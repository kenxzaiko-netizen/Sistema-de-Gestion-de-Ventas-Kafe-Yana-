package bo.kafeyana.facade;

import bo.kafeyana.dto.CompraRegistrada;
import bo.kafeyana.dto.SolicitudCompra;
import bo.kafeyana.model.Compra;
import bo.kafeyana.model.Producto;
import bo.kafeyana.service.CatalogoService;
import bo.kafeyana.service.CompraService;
import bo.kafeyana.service.HistorialService;
import java.util.List;
import org.springframework.stereotype.Service;

/** FACADE: interfaz simple para los casos de uso de la cafetería. */
@Service
public class KafeYanaFacade {
    private final CatalogoService catalogo;
    private final CompraService compras;
    private final HistorialService historial;

    public KafeYanaFacade(CatalogoService catalogo, CompraService compras,
                          HistorialService historial) {
        this.catalogo = catalogo;
        this.compras = compras;
        this.historial = historial;
    }

    public List<Producto> consultarCatalogo(String orden) { return catalogo.listar(orden); }
    public List<Compra> consultarCompras() { return historial.listarUltimas(); }
    public CompraRegistrada registrarCompra(SolicitudCompra solicitud) {
        return compras.registrar(solicitud);
    }
}
