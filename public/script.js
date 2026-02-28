const API = 'https://dulceria-backend-production.up.railway.app/api';

// CARGAR PRODUCTOS DESDE EL BACKEND 
async function cargarProductos() {
  try {
    const respuesta = await fetch(`${API}/products`);
    const productos = await respuesta.json();

    const contenedor = document.getElementById('contenedor-dinamico-productos');
    contenedor.innerHTML = '';

    if (productos.length === 0) {
      contenedor.innerHTML = '<p style="text-align:center">No hay productos disponibles aún</p>';
      return;
    }

    // Agrupar productos por categoría
    const porCategoria = {};
    productos.forEach(prod => {
      const cat = prod.categoria || 'otros';
      if (!porCategoria[cat]) porCategoria[cat] = [];
      porCategoria[cat].push(prod);
    });

    // Renderizar cada categoría
    Object.keys(porCategoria).forEach(categoria => {
      const seccion = document.createElement('section');
      seccion.classList.add('seccion-producto');

      const titulo = document.createElement('h2');
      titulo.classList.add('titulo-seccion');
      const nombresBonitos = {
  'gomitas': 'Gomitas',
  'chocolates': 'Chocolates',
  'paletas': 'Paletas',
  'dulces_regionales': 'Dulces Regionales',
  'otros': 'Otros',
  'chicle': 'Chicles',
  'caramelo': 'Caramelos',
  'galletas': 'Galletas',
  'halloween': 'Halloween',
  'navidad': 'Navidad',
  'san_valentin': 'San Valentín',
  'dia_del_nino': 'Día del Niño',
  'anio_nuevo': 'Año Nuevo',
  'dia_de_reyes': 'Día de Reyes'
};

titulo.textContent = nombresBonitos[categoria] || categoria;

      const grid = document.createElement('div');
      grid.classList.add('rejilla-productos');

      porCategoria[categoria].forEach(prod => {
        const card = document.createElement('article');
        card.classList.add('tarjeta-producto');
        card.innerHTML = `
          <img src="${prod.imagen || 'https://via.placeholder.com/200'}" alt="${prod.nombre}">
          <h3>${prod.nombre}</h3>
          <p class="precio">$${prod.precio.toFixed(2)} MXN</p>
          <button class="boton-agregar" 
  data-nombre="${prod.nombre}" 
  data-precio="${prod.precio}"
  data-id="${prod._id}">Agregar</button>
        `;
        grid.appendChild(card);
      });

      seccion.appendChild(titulo);
      seccion.appendChild(grid);
      contenedor.appendChild(seccion);
    });

  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

cargarProductos();

// CARRITO 
const botonAbrirCarrito = document.getElementById('boton-abrir-carrito');
const fondoCarrito = document.getElementById('fondo-carrito');
const botonCerrarCarrito = document.getElementById('boton-cerrar-carrito');
const contenedorItems = document.getElementById('contenedor-items-carrito');
const precioTotalElemento = document.getElementById('precio-total-carrito');
const contadorCarritoElemento = document.getElementById('contador-carrito');
const botonVaciar = document.getElementById('boton-vaciar-carrito');

let carritoDeCompras = [];

botonAbrirCarrito.addEventListener('click', () => fondoCarrito.classList.add('activo'));
botonCerrarCarrito.addEventListener('click', () => fondoCarrito.classList.remove('activo'));
fondoCarrito.addEventListener('click', (e) => {
  if (e.target === fondoCarrito) fondoCarrito.classList.remove('activo');
});

function actualizarInterfazCarrito() {
  contenedorItems.innerHTML = '';
  let totalDinero = 0;
  let totalCantidad = 0;

  if (carritoDeCompras.length === 0) {
    contenedorItems.innerHTML = '<p class="mensaje-vacio">Su carrito está vacío.</p>';
  } else {
    carritoDeCompras.forEach(producto => {
      const totalPorProducto = producto.precio * producto.cantidad;
      totalDinero += totalPorProducto;
      totalCantidad += producto.cantidad;

      const itemHTML = document.createElement('div');
      itemHTML.classList.add('item-carrito');
      itemHTML.innerHTML = `
        <div>
          <h4>${producto.nombre}</h4>
          <span>Cant: ${producto.cantidad} x $${producto.precio}</span>
        </div>
        <div style="color:#E6007E; font-weight:bold;">$${totalPorProducto.toFixed(2)}</div>
      `;
      contenedorItems.appendChild(itemHTML);
    });
  }

  precioTotalElemento.innerText = totalDinero.toFixed(2);
  contadorCarritoElemento.innerText = totalCantidad;
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('boton-agregar')) {
    const nombreProd = e.target.getAttribute('data-nombre');
    const precioProd = parseFloat(e.target.getAttribute('data-precio'));

    const existente = carritoDeCompras.find(item => item.nombre === nombreProd);
    if (existente) {
      existente.cantidad++;
    } else {
     const idProd = e.target.getAttribute('data-id');
carritoDeCompras.push({ id: idProd, nombre: nombreProd, precio: precioProd, cantidad: 1 });
    }

    actualizarInterfazCarrito();
    fondoCarrito.classList.add('activo');
  }
});

botonVaciar.addEventListener('click', () => {
  carritoDeCompras = [];
  actualizarInterfazCarrito();
});

// --- BUSCADOR ---
const inputBusqueda = document.getElementById('input-busqueda');
const botonLupa = document.getElementById('boton-buscar');
const cajaBusqueda = document.querySelector('.caja-busqueda');

inputBusqueda.addEventListener('input', (e) => {
  const texto = e.target.value.toLowerCase();
  document.querySelectorAll('.tarjeta-producto').forEach(tarjeta => {
    const nombre = tarjeta.querySelector('h3').innerText.toLowerCase();
    tarjeta.classList.toggle('producto-oculto', !nombre.includes(texto));
  });
});

botonLupa.addEventListener('click', () => {
  cajaBusqueda.classList.toggle('activo');
  if (cajaBusqueda.classList.contains('activo')) inputBusqueda.focus();
});

// --- AUTENTICACIÓN ---
const API_AUTH = 'https://dulceria-backend-production.up.railway.app/api';
const fondoModal = document.getElementById('fondo-modal');
const botonUsuario = document.getElementById('boton-usuario');
const cerrarModal = document.getElementById('cerrar-modal');
const tabLogin = document.getElementById('tab-login');
const tabRegistro = document.getElementById('tab-registro');
const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');
const nombreUsuarioSpan = document.getElementById('nombre-usuario');

// Abrir y cerrar modal
botonUsuario.addEventListener('click', () => {
  const token = localStorage.getItem('token');
  if (token) {
    // Si ya está logueado, cerrar sesión
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    nombreUsuarioSpan.textContent = '';
    alert('Sesión cerrada');
  } else {
    fondoModal.classList.add('activo');
  }
});

cerrarModal.addEventListener('click', () => fondoModal.classList.remove('activo'));
fondoModal.addEventListener('click', (e) => {
  if (e.target === fondoModal) fondoModal.classList.remove('activo');
});

// Cambiar entre tabs
tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('activo');
  tabRegistro.classList.remove('activo');
  formLogin.style.display = 'block';
  formRegistro.style.display = 'none';
});

tabRegistro.addEventListener('click', () => {
  tabRegistro.classList.add('activo');
  tabLogin.classList.remove('activo');
  formRegistro.style.display = 'block';
  formLogin.style.display = 'none';
});

// Login
document.getElementById('btn-login').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('error-login');

  try {
    const res = await fetch(`${API_AUTH}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.mensaje;
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    nombreUsuarioSpan.textContent = data.usuario.nombre;
    fondoModal.classList.remove('activo');
    errorEl.textContent = '';

  } catch (error) {
    errorEl.textContent = 'Error al conectar con el servidor';
  }
});

// Registro
document.getElementById('btn-registro').addEventListener('click', async () => {
  const nombre = document.getElementById('registro-nombre').value;
  const email = document.getElementById('registro-email').value;
  const password = document.getElementById('registro-password').value;
  const errorEl = document.getElementById('error-registro');

  try {
    const res = await fetch(`${API_AUTH}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.mensaje;
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    nombreUsuarioSpan.textContent = data.usuario.nombre;
    fondoModal.classList.remove('activo');
    errorEl.textContent = '';

  } catch (error) {
    errorEl.textContent = 'Error al conectar con el servidor';
  }
});

// Mantener sesión activa al recargar la página
window.addEventListener('load', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (usuario) {
    nombreUsuarioSpan.textContent = usuario.nombre;
  }
});


// --- BOTÓN PAGAR ---
document.getElementById('btn-pagar').addEventListener('click', async () => {
  const token = localStorage.getItem('token');

  // Verificar que el usuario esté logueado
  if (!token) {
    alert('Debes iniciar sesión para pagar');
    fondoModal.classList.add('activo');
    return;
  }

  // Verificar que el carrito no esté vacío
  if (carritoDeCompras.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

  // Pedir dirección de entrega
  const direccion = prompt('¿Cuál es tu dirección de entrega?');
  if (!direccion) return;

  try {
    // Preparar los productos para enviar al backend
    const productosParaEnviar = carritoDeCompras.map(item => ({
      productoId: item.id,
      cantidad: item.cantidad
    }));

    const res = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productos: productosParaEnviar,
        direccionEntrega: direccion
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert('Error al procesar el pedido: ' + data.mensaje);
      return;
    }

    // Pedido exitoso
    carritoDeCompras = [];
    actualizarInterfazCarrito();
    fondoCarrito.classList.remove('activo');
    alert(`¡Pedido realizado exitosamente!\nTotal: $${data.pedido.total.toFixed(2)} MXN\n¡Gracias por tu compra!`);

  } catch (error) {
    alert('Error al conectar con el servidor');
  }
});

// --- FILTRADO DEL MENÚ ---
document.addEventListener('click', async (e) => {

  // Filtrar por categoría
  if (e.target.classList.contains('filtro-menu')) {
    e.preventDefault();
    const categoria = e.target.getAttribute('data-categoria');

    try {
      const res = await fetch(`${API}/products`);
      const productos = await res.json();
      const filtrados = productos.filter(p => p.categoria === categoria);
      renderizarFiltrados(filtrados, e.target.textContent);
    } catch (error) {
      console.error('Error al filtrar:', error);
    }
  }

  // Filtrar por marca
  if (e.target.classList.contains('filtro-marca')) {
    e.preventDefault();
    const marca = e.target.getAttribute('data-marca');

    try {
      const res = await fetch(`${API}/products`);
      const productos = await res.json();
      const filtrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(marca.toLowerCase())
      );
      renderizarFiltrados(filtrados, e.target.textContent);
    } catch (error) {
      console.error('Error al filtrar:', error);
    }
  }

  // Ver todos
  if (e.target.id === 'ver-todos') {
    e.preventDefault();
    cargarProductos();
  }
});

function renderizarFiltrados(productos, titulo) {
  const contenedor = document.getElementById('contenedor-dinamico-productos');
  contenedor.innerHTML = '';

  // Botón para volver a ver todos
  const btnVerTodos = document.createElement('button');
  btnVerTodos.textContent = '← Ver todos los productos';
  btnVerTodos.style.cssText = `
    display: block;
    margin: 20px auto;
    padding: 10px 25px;
    background: var(--rosa);
    color: white;
    border: none;
    border-radius: 50px;
    font-weight: 700;
    cursor: pointer;
    font-size: 1rem;
  `;
  btnVerTodos.addEventListener('click', cargarProductos);
  contenedor.appendChild(btnVerTodos);

  if (productos.length === 0) {
    contenedor.innerHTML += `
      <div style="text-align:center; padding:50px">
        <p style="font-size:3rem"></p>
        <h3 style="color:var(--rosa)">¡Próximamente!</h3>
        <p>Estamos preparando productos de esta categoría para ti.</p>
      </div>
    `;
    contenedor.prepend(btnVerTodos);
    return;
  }

  const seccion = document.createElement('section');
  seccion.classList.add('seccion-producto');

  const tituloEl = document.createElement('h2');
  tituloEl.classList.add('titulo-seccion');
  tituloEl.textContent = titulo;

  const grid = document.createElement('div');
  grid.classList.add('rejilla-productos');

  productos.forEach(prod => {
    const card = document.createElement('article');
    card.classList.add('tarjeta-producto');
    card.innerHTML = `
      <img src="${prod.imagen || 'https://via.placeholder.com/200'}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p class="precio">$${prod.precio.toFixed(2)} MXN</p>
      <button class="boton-agregar"
        data-nombre="${prod.nombre}"
        data-precio="${prod.precio}"
        data-id="${prod._id}">Agregar</button>
    `;
    grid.appendChild(card);
  });

  seccion.appendChild(tituloEl);
  seccion.appendChild(grid);
  contenedor.appendChild(seccion);

  // Scroll suave hacia los productos
  seccion.scrollIntoView({ behavior: 'smooth' });
}