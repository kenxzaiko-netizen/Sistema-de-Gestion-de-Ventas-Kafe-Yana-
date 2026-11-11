package bo.kafeyana.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/** Modelo: producto almacenado en PostgreSQL. */
public record Producto(int id, String nombre,
                       @JsonProperty("precio_centavos") int precioCentavos) {}
