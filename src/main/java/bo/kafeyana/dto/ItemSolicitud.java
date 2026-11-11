package bo.kafeyana.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/** Datos de entrada enviados desde el carrito. */
public record ItemSolicitud(@JsonProperty("producto_id") Integer productoId,
                            Integer cantidad) {}
