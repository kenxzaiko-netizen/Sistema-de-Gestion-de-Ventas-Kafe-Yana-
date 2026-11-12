# Kafe Yana — Taller de Programación

Gonzales Torrico Michelle Jael	C11529-0
Mamani Caballero Abel		C12895-3
Perez Poppe Andres Ivan		C12964-X
Ticona Ayaviri Imanol Marin	C12848-1

Proyecto Spring Boot (Java 17+) + PostgreSQL 16 con arquitectura MVC y patrones Facade/Strategy.

## Abrir en IntelliJ IDEA

1. Descomprimir `Kafe_Yana_Java.rar/.zip`.
2. Abrir la carpeta `Kafe_Yana_Java` desde **File > Open** y esperar a que IntelliJ importe el proyecto **Maven** (archivo `pom.xml`).
3. Verificar que esté seleccionado el JDK 17 o 21.
4. En pgAdmin, crea una base de datos llamada `kafe_yana`.
5. Abrir Query Tool sobre la bd kafe_yana, abrir el archivo y ejecutar `base_kafe_yana.sql`. PD; El script conserva los datos y no repite los cuatro productos iniciales.
6. Revisar `src/main/resources/application.properties`: URL, usuario y contraseña deben coincidir con tu instalación local de PostgreSQL 16.
7. Ejecutar `KafeYanaApplication.java` con el triangulo verde en IntelliJ.
8. Abrir `http://localhost:8080/` en el navegador.

## MVC, Facade y Strategy

- **Modelo (M):** `src/main/java/bo/kafeyana/model/` (Producto, Compra, DetalleCompra), `dto/`, `repository/` y `service/` (reglas de negocio).
- **Vista (V):** `src/main/resources/static/` — HTML, CSS, JavaScript.
- **Controlador (C):** `controller/CompraController.java` — rutas HTTP `/api/...`. No contiene SQL.
- **Facade:** `facade/KafeYanaFacade.java`. Simplifica los casos de uso: consultar catálogo, consultar historial y registrar compra. El controlador solo conversa con esta fachada.
- **Strategy:** `strategy/OrdenProductosStrategy.java`, `OrdenPorIdStrategy.java`, `OrdenPorNombreStrategy.java` y `OrdenPorPrecioStrategy.java`. El `CatalogoService` elige la estrategia por `orden`.

## Pruebas del patron Strategy

- `http://localhost:8080/api/productos?orden=id` — orden original.
- `http://localhost:8080/api/productos?orden=nombre` — orden alfabetico.
- `http://localhost:8080/api/productos?orden=precio` — del mas barato al mas caro.
- La pagina de inicio tiene un selector **Ordenar productos** que llama a esas rutas y reorganiza las tarjetas sin cambiar sus datos.

## Prueba de Facade y PostgreSQL

1. En la página principal, pulsa **Agregar** en un cafe o desayuno.
2. Abrir **Mi carrito**, escribir el nombre del cliente y registrar la compra.
3. Verificar que aparezca en **Compras registradas**.
4. En pgAdmin, ejecutar `SELECT * FROM compras ORDER BY id DESC;` y `SELECT * FROM detalle_compra ORDER BY id DESC;`.
5. Observar el recorrido: **Vista (JS)** → **CompraController** → **KafeYanaFacade** → **CompraService** → **Repositorios JDBC** → **PostgreSQL**.

## Estructura general

```
bo.kafeyana
├── KafeYanaApplication.java
├── controller/CompraController.java, ApiExceptionHandler.java
├── dto/ItemSolicitud.java, SolicitudCompra.java, CompraRegistrada.java
├── facade/KafeYanaFacade.java
├── model/Producto.java, Compra.java, DetalleCompra.java
├── repository/ProductoRepository.java, CompraRepository.java
├── service/CatalogoService.java, CompraService.java, HistorialService.java
└── strategy/OrdenProductosStrategy.java y tres implementaciones
```

## Funciones pendientes (no se simulan como completadas)

- El formulario de inicio de sesión **no esta conectado a usuarios ni contraseñas** (ya era demostrativo).
- La base entregada solo incluye cuatro productos; un catalogo por categorias (cafes, postres, bebidas, etc.) requiere ampliar tablas y pantallas.
- Realidad aumentada todavia no esta implementada.

**Nota:** No es necesario modificar las tablas para agregar Facade y Strategy. Se conservan `productos`, `compras` y `detalle_compra`.
