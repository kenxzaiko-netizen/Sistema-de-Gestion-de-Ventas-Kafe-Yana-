package bo.kafeyana.service;

import bo.kafeyana.model.Compra;
import bo.kafeyana.repository.CompraRepository;
import java.util.List;
import org.springframework.stereotype.Service;

/** Construye el historial sin exponer SQL al controlador. */
@Service
public class HistorialService {
    private final CompraRepository compras;

    public HistorialService(CompraRepository compras) { this.compras = compras; }

    public List<Compra> listarUltimas() {
        return compras.encontrarUltimas(100).stream()
                .map(c -> new Compra(c.id(), c.cliente(), c.fecha(), c.totalCentavos(),
                        compras.encontrarDetalle(c.id())))
                .toList();
    }
}
