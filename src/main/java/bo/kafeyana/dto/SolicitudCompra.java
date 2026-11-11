package bo.kafeyana.dto;

import java.util.List;

/** Solicitud HTTP para registrar la compra. */
public record SolicitudCompra(String cliente, List<ItemSolicitud> articulos) {}
