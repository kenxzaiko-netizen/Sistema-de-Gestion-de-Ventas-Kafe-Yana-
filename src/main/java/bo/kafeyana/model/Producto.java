package bo.kafeyana.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/** Modelo MVC: producto con su categoria y descripcion en PostgreSQL. */
public record Producto(int id, String nombre,
                       @JsonProperty("precio_centavos") int precioCentavos,
                       String categoria, String descripcion) {
    /** Constructor compatible con los tests previos. */
    public Producto(int id, String nombre, int precioCentavos) {
        this(id, nombre, precioCentavos, "Otros", "");
    }
}
