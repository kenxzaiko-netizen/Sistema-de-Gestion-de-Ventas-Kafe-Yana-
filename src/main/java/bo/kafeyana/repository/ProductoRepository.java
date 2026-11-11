package bo.kafeyana.repository;

import bo.kafeyana.model.Producto;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/** Acceso a la tabla productos. No contiene reglas de negocio. */
@Repository
public class ProductoRepository {
    private final JdbcTemplate db;

    public ProductoRepository(JdbcTemplate db) { this.db = db; }

    public List<Producto> encontrarTodos() {
        return db.query("SELECT id, nombre, precio_centavos FROM productos ORDER BY id",
                (rs, fila) -> new Producto(rs.getInt("id"), rs.getString("nombre"),
                        rs.getInt("precio_centavos")));
    }

    public Optional<Producto> encontrarPorId(int id) {
        List<Producto> resultado = db.query(
                "SELECT id, nombre, precio_centavos FROM productos WHERE id = ?",
                (rs, fila) -> new Producto(rs.getInt("id"), rs.getString("nombre"),
                        rs.getInt("precio_centavos")), id);
        return resultado.stream().findFirst();
    }
}
