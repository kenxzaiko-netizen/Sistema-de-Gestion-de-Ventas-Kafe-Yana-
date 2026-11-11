package bo.kafeyana.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;

/** Modelo: compra y sus artículos para el historial. */
public record Compra(int id, String cliente, LocalDateTime fecha,
                     @JsonProperty("total_centavos") int totalCentavos,
                     List<DetalleCompra> detalles) {}
