(() => {
    // El carrito se conserva mientras navegamos entre páginas en la misma pestaña.
    const CLAVE_CARRITO = 'kafeYanaCarrito';
    let productos = [];
    let carrito = {};
    try {
        const guardado = JSON.parse(sessionStorage.getItem(CLAVE_CARRITO) || '{}');
        if (guardado && typeof guardado === 'object' && !Array.isArray(guardado)) carrito = guardado;
    } catch (error) {
        carrito = {};
    }

    const lista = document.querySelector('#carrito-lista');
    const total = document.querySelector('#total-compra');
    const historial = document.querySelector('#historial');
    const estado = document.querySelector('#estado-compra');
    const avisoProductos = document.querySelector('#aviso-productos');
    const form = document.querySelector('#form-compra');
    const guardar = document.querySelector('#guardar-compra');
    const dinero = valor => (valor / 100).toFixed(2).replace('.', ',') + ' Bs';

    function guardarCarrito() {
        try { sessionStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito)); }
        catch (error) { if (avisoProductos) avisoProductos.textContent = 'El navegador no permite guardar el carrito entre páginas.'; }
    }

    function pintarCarrito() {
        if (!lista || !total) return;
        lista.replaceChildren();
        let suma = 0;
        for (const producto of productos) {
            const cantidad = Number(carrito[producto.id]) || 0;
            if (cantidad < 1) continue;
            suma += cantidad * producto.precio_centavos;
            const fila = document.createElement('div');
            fila.className = 'compra-item';
            const nombre = document.createElement('span');
            nombre.textContent = producto.nombre + ' · ' + dinero(producto.precio_centavos);
            const control = document.createElement('div');
            control.className = 'cantidad';
            const menos = document.createElement('button');
            menos.type = 'button'; menos.textContent = '−';
            menos.setAttribute('aria-label', 'Quitar una unidad de ' + producto.nombre);
            menos.addEventListener('click', () => { carrito[producto.id] = cantidad - 1; guardarCarrito(); pintarCarrito(); });
            const numero = document.createElement('span'); numero.textContent = cantidad;
            const mas = document.createElement('button');
            mas.type = 'button'; mas.textContent = '+';
            mas.setAttribute('aria-label', 'Agregar una unidad de ' + producto.nombre);
            mas.addEventListener('click', () => { carrito[producto.id] = Math.min(99, cantidad + 1); guardarCarrito(); pintarCarrito(); });
            control.append(menos, numero, mas); fila.append(nombre, control); lista.append(fila);
        }
        if (!suma) {
            const mensaje = document.createElement('p'); mensaje.textContent = 'Tu carrito está vacío.'; lista.append(mensaje);
        }
        total.textContent = dinero(suma);
    }

    // Filtros de la vista MVC; la ordenacion sigue siendo trabajo del patron Strategy en Java.
    let categoriaActiva = 'Todas';
    const categoriasPreferidas = ['Cafés', 'Postres', 'Bebidas', 'Desayunos completos', 'Salados', 'Otros'];
    const iconos = { 'Cafés': '☕', 'Postres': '🍰', 'Bebidas': '🥤', 'Desayunos completos': '🍳', 'Salados': '🥪', 'Otros': '🍽️' };
    const clases = { 'Cafés': 'cafe', 'Postres': 'postre', 'Bebidas': 'bebida', 'Desayunos completos': 'desayuno', 'Salados': 'salado', 'Otros': 'otro' };
    const categoriaDe = p => String(p.categoria || 'Otros').trim() || 'Otros';

    function pintarFiltros() {
        const contenedor = document.querySelector('#filtros-categorias');
        if (!contenedor) return;
        const existentes = [...new Set(productos.map(categoriaDe))];
        existentes.sort((a, b) => {
            const ia = categoriasPreferidas.indexOf(a), ib = categoriasPreferidas.indexOf(b);
            if (ia !== -1 && ib !== -1) return ia - ib;
            if (ia !== -1) return -1;
            if (ib !== -1) return 1;
            return a.localeCompare(b, 'es');
        });
        if (categoriaActiva !== 'Todas' && !existentes.includes(categoriaActiva)) categoriaActiva = 'Todas';
        contenedor.replaceChildren();
        for (const categoria of ['Todas', ...existentes]) {
            const boton = document.createElement('button');
            boton.type = 'button';
            boton.className = 'filtro-categoria' + (categoria === categoriaActiva ? ' activo' : '');
            boton.dataset.categoria = categoria;
            boton.textContent = categoria === 'Todas' ? 'Todos' : categoria;
            boton.setAttribute('aria-pressed', String(categoria === categoriaActiva));
            boton.addEventListener('click', () => { categoriaActiva = categoria; pintarFiltros(); pintarProductos(); });
            contenedor.append(boton);
        }
    }

    function pintarProductos() {
        const contenedor = document.querySelector('#productos');
        if (!contenedor) return;
        const busqueda = (document.querySelector('#buscar-productos')?.value || '').trim().toLocaleLowerCase('es');
        const visibles = productos.filter(p => {
            const coincideCategoria = categoriaActiva === 'Todas' || categoriaDe(p) === categoriaActiva;
            const contenido = (p.nombre + ' ' + (p.descripcion || '')).toLocaleLowerCase('es');
            return coincideCategoria && (!busqueda || contenido.includes(busqueda));
        });
        contenedor.replaceChildren();
        for (const producto of visibles) {
            const categoria = categoriaDe(producto);
            const tarjeta = document.createElement('article');
            tarjeta.className = 'product';
            tarjeta.dataset.productoId = String(producto.id);
            const imagen = document.createElement('div');
            imagen.className = 'product-img producto-ilustracion ilustracion-' + (clases[categoria] || 'otro');
            imagen.setAttribute('role', 'img');
            imagen.setAttribute('aria-label', categoria + ': ' + producto.nombre);
            const emoji = document.createElement('span');
            emoji.className = 'producto-emoji'; emoji.setAttribute('aria-hidden', 'true');
            emoji.textContent = iconos[categoria] || '🍽️';
            imagen.append(emoji);
            const cuerpo = document.createElement('div'); cuerpo.className = 'product-body';
            const etiqueta = document.createElement('span'); etiqueta.className = 'product-categoria'; etiqueta.textContent = categoria;
            const nombre = document.createElement('h3'); nombre.textContent = producto.nombre;
            const descripcion = document.createElement('p'); descripcion.textContent = producto.descripcion || 'Preparado con cariño en Kafe Yana';
            const precio = document.createElement('strong'); precio.textContent = dinero(producto.precio_centavos);
            const boton = document.createElement('button');
            boton.className = 'btn-add'; boton.type = 'button'; boton.textContent = 'Agregar';
            boton.setAttribute('aria-label', 'Agregar ' + producto.nombre + ' al carrito');
            boton.addEventListener('click', () => {
                carrito[producto.id] = Math.min(99, (Number(carrito[producto.id]) || 0) + 1);
                guardarCarrito();
                if (avisoProductos) avisoProductos.textContent = producto.nombre + ' agregado. Puedes abrir Mi carrito.';
            });
            cuerpo.append(etiqueta, nombre, descripcion, precio, boton);
            tarjeta.append(imagen, cuerpo);
            contenedor.append(tarjeta);
        }
        const contador = document.querySelector('#cantidad-productos');
        if (contador) contador.textContent = visibles.length + ' producto(s) de ' + productos.length + ' en el catálogo';
        const vacio = document.querySelector('#catalogo-vacio');
        if (vacio) vacio.hidden = visibles.length > 0;
    }

    async function cargarProductos() {
        try {
            const selector = document.querySelector('#orden-productos');
            const orden = selector ? selector.value : 'id';
            const respuesta = await fetch('/api/productos?orden=' + encodeURIComponent(orden));
            if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
            productos = await respuesta.json();
            pintarFiltros();
            pintarProductos();
            pintarCarrito();
        } catch (error) {
            const mensaje = 'No se pudieron cargar los productos. Comprueba que el servidor esté activo y que hayas ejecutado ampliar_catalogo.sql.';
            if (avisoProductos) avisoProductos.textContent = mensaje;
            if (estado) estado.textContent = mensaje;
            const contador = document.querySelector('#cantidad-productos');
            if (contador) contador.textContent = 'Catálogo no disponible';
        }
    }

    async function cargarHistorial() {
        if (!historial) return;
        try {
            const respuesta = await fetch('/api/compras');
            if (!respuesta.ok) throw new Error();
            const compras = await respuesta.json();
            historial.replaceChildren();
            if (!compras.length) { historial.textContent = 'Todavía no hay compras registradas.'; return; }
            for (const compra of compras) {
                const tarjeta = document.createElement('article'); tarjeta.className = 'registro';
                const titulo = document.createElement('strong'); titulo.textContent = 'Compra #' + compra.id + ' · ' + compra.cliente;
                const fecha = document.createElement('p'); fecha.textContent = String(compra.fecha).replace('T', ' ');
                const detalle = document.createElement('p'); detalle.textContent = compra.detalles.map(d => d.cantidad + ' × ' + d.producto_nombre).join(' · ');
                const monto = document.createElement('b'); monto.textContent = 'Total: ' + dinero(compra.total_centavos);
                tarjeta.append(titulo, fecha, detalle, monto); historial.append(tarjeta);
            }
        } catch (error) { historial.textContent = 'No se pudo cargar el historial. Comprueba que la aplicación esté iniciada.'; }
    }

    if (form && guardar) {
        form.addEventListener('submit', async evento => {
            evento.preventDefault();
            const articulos = Object.entries(carrito).filter(([id, cantidad]) => Number(cantidad) > 0).map(([id, cantidad]) => ({ producto_id: Number(id), cantidad: Number(cantidad) }));
            if (!articulos.length) { estado.textContent = 'Agrega al menos un producto antes de registrar la compra.'; return; }
            guardar.disabled = true;
            try {
                const respuesta = await fetch('/api/compras', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cliente: document.querySelector('#cliente').value.trim(), articulos })
                });
                const resultado = await respuesta.json();
                if (!respuesta.ok) throw new Error(resultado.error || resultado.message || 'No se pudo registrar la compra.');
                carrito = {}; guardarCarrito(); form.reset(); pintarCarrito();
                estado.textContent = 'Compra #' + resultado.id + ' registrada. Total: ' + dinero(resultado.total_centavos);
                await cargarHistorial();
            } catch (error) { estado.textContent = error.message || 'No se pudo conectar con el servidor.'; }
            finally { guardar.disabled = false; }
        });
    }
    const actualizar = document.querySelector('#actualizar-historial');
    if (actualizar) actualizar.addEventListener('click', cargarHistorial);
    const selectorOrden = document.querySelector('#orden-productos');
    if (selectorOrden) selectorOrden.addEventListener('change', cargarProductos);
    const buscar = document.querySelector('#buscar-productos');
    if (buscar) buscar.addEventListener('input', pintarProductos);
    cargarProductos();
    cargarHistorial();
})();
