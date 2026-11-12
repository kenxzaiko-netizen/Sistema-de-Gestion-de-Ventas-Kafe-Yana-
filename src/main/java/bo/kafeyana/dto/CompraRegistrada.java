package bo.kafeyana.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/** Respuesta HTTP después de registrar una compra. */
public record CompraRegistrada(int id,
                              @JsonProperty("total_centavos") int totalCentavos,
                              String mensaje) {}
