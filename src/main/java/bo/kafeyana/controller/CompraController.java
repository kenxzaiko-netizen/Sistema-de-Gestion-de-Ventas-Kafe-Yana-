package bo.kafeyana.controller;

import bo.kafeyana.dto.CompraRegistrada;
import bo.kafeyana.dto.SolicitudCompra;
import bo.kafeyana.facade.KafeYanaFacade;
import bo.kafeyana.model.Compra;
import bo.kafeyana.model.Producto;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/** CONTROLADOR MVC: solo recibe HTTP y delega los casos de uso al Facade. */
@RestController
@RequestMapping("/api")
public class CompraController {
    private final KafeYanaFacade facade;

    public CompraController(KafeYanaFacade facade) { this.facade = facade; }

    @GetMapping("/productos")
    public List<Producto> productos(@RequestParam(defaultValue = "id") String orden) {
        return facade.consultarCatalogo(orden);
    }

    @GetMapping("/compras")
    public List<Compra> compras() { return facade.consultarCompras(); }

    @PostMapping("/compras")
    @ResponseStatus(HttpStatus.CREATED)
    public CompraRegistrada registrar(@RequestBody SolicitudCompra solicitud) {
        return facade.registrarCompra(solicitud);
    }
}
