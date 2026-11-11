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

    async function cargarProductos() {
        try {
            const selector = document.querySelector('#orden-productos');
            const orden = selector ? selector.value : 'id';
            const respuesta = await fetch('/api/productos?orden=' + encodeURIComponent(orden));
            if (!respuesta.ok) throw new Error();
            productos = await respuesta.json();
            const contenedor = document.querySelector('#productos');
            if (contenedor) {
                // Conservamos las tarjetas originales y las reordenamos según la respuesta
                // producida por la estrategia elegida en el backend Java.
                for (const producto of productos) {
                    const tarjeta = contenedor.querySelector('[data-producto-id="' + producto.id + '"]');
                    if (!tarjeta) continue;
                    const cuerpo = tarjeta.querySelector('.product-body');
                    cuerpo.querySelector('h3').textContent = producto.nombre;
                    cuerpo.querySelector('strong').textContent = dinero(producto.precio_centavos);
                    cuerpo.querySelector('.btn-add')?.remove();
                    const boton = document.createElement('button');
                    boton.className = 'btn-add'; boton.type = 'button'; boton.textContent = 'Agregar';
                    boton.setAttribute('aria-label', 'Agregar ' + producto.nombre + ' al carrito');
                    boton.addEventListener('click', () => {
                        carrito[producto.id] = Math.min(99, (Number(carrito[producto.id]) || 0) + 1);
                        guardarCarrito();
                        if (avisoProductos) avisoProductos.textContent = producto.nombre + ' agregado. Puedes abrir Mi carrito.';
                    });
                    cuerpo.append(boton);
                    contenedor.append(tarjeta);
                }
            }
            pintarCarrito();
        } catch (error) {
            const mensaje = 'No se pudieron cargar los productos. Verifica que la aplicación Java esté iniciada.';
            if (avisoProductos) avisoProductos.textContent = mensaje;
            if (estado) estado.textContent = mensaje;
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
    cargarProductos();
    cargarHistorial();
})();
