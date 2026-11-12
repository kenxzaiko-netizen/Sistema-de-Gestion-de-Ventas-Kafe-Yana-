package bo.kafeyana.repository;

import bo.kafeyana.model.Compra;
import bo.kafeyana.model.DetalleCompra;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/** Acceso a las tablas compras y detalle_compra. */
@Repository
public class CompraRepository {
    private final JdbcTemplate db;

    public CompraRepository(JdbcTemplate db) { this.db = db; }

    public List<Compra> encontrarUltimas(int limite) {
        return db.query("SELECT id, cliente, fecha, total_centavos " +
                        "FROM compras ORDER BY id DESC LIMIT ?",
                (rs, fila) -> new Compra(rs.getInt("id"), rs.getString("cliente"),
                        rs.getTimestamp("fecha").toLocalDateTime(),
                        rs.getInt("total_centavos"), List.of()), limite);
    }

    public List<DetalleCompra> encontrarDetalle(int compraId) {
        return db.query("SELECT producto_nombre, cantidad, precio_unitario_centavos, " +
                        "subtotal_centavos FROM detalle_compra WHERE compra_id = ? ORDER BY id",
                (rs, fila) -> new DetalleCompra(rs.getString("producto_nombre"),
                        rs.getInt("cantidad"), rs.getInt("precio_unitario_centavos"),
                        rs.getInt("subtotal_centavos")), compraId);
    }

    public int crearCompra(String cliente, int totalCentavos) {
        Integer id = db.queryForObject("INSERT INTO compras (cliente, total_centavos) " +
                "VALUES (?, ?) RETURNING id", Integer.class, cliente, totalCentavos);
        if (id == null) throw new IllegalStateException("La base de datos no devolvió el ID de compra.");
        return id;
    }

    public void agregarDetalle(int compraId, int productoId, String nombre,
                               int cantidad, int precioCentavos, int subtotalCentavos) {
        db.update("INSERT INTO detalle_compra (compra_id, producto_id, producto_nombre, " +
                        "cantidad, precio_unitario_centavos, subtotal_centavos) " +
                        "VALUES (?, ?, ?, ?, ?, ?)",
                compraId, productoId, nombre, cantidad, precioCentavos, subtotalCentavos);
    }
}
