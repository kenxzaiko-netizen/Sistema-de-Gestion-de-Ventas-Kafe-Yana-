package bo.kafeyana.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/** Modelo: artículo incluido en una compra ya registrada. */
public record DetalleCompra(String producto_nombre, int cantidad,
                            @JsonProperty("precio_unitario_centavos") int precioUnitarioCentavos,
                            @JsonProperty("subtotal_centavos") int subtotalCentavos) {}
