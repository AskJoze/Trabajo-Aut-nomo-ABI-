const contenedorProductos = document.getElementById('productos');
const inputBusqueda = document.getElementById('busqueda');
const botonesCategoria = document.querySelectorAll('.categoria-btn');
let productos = [];
let categoriaSeleccionada = 'todos';
async function cargarProductos() {
  try {
    mostrarMensaje('Cargando productos...');
    const response = await fetch('http://127.0.0.1:8000/api/productos');
    if (!response.ok) throw new Error('Error en la API de productos');

    productos = await response.json();
    if (productos.length === 0) {
      mostrarMensaje('No hay productos disponibles');
    } else {
      filtrarProductos(); 
    }
  } catch (error) {
    console.error('Error al cargar productos:', error);
    mostrarMensaje('Error al cargar los productos.');
  }
}
function mostrarMensaje(mensaje) {
  contenedorProductos.innerHTML = `<p class="text-gray-500 text-center">${mensaje}</p>`;
}
function filtrarProductos() {
  let filtrados = productos;
  if (categoriaSeleccionada !== 'todos') {
    filtrados = filtrados.filter(p =>
      p.categorias?.some(cat => cat.slug === categoriaSeleccionada)
    );
  }
  const texto = inputBusqueda.value.toLowerCase();
  if (texto.trim() !== '') {
    filtrados = filtrados.filter(p =>
      p.titulo.toLowerCase().includes(texto) ||
      p.descripcion.toLowerCase().includes(texto)
    );
  }
  mostrarProductos(filtrados);
}
function mostrarProductos(products) {
  contenedorProductos.innerHTML = '';
  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className =
      'bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-white transition-shadow duration-300';
    productDiv.innerHTML = `
      <img src="${product.imagen}" alt="${product.titulo}" class="w-32 h-32 object-cover mb-4 rounded-lg">
      <h2 class="text-lg font-semibold mb-2">${product.titulo}</h2>
      <p class="text-gray-700 mb-2">$${product.precio}</p>
      <button class="ver-detalles-btn bg-black text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300 mt-2">Ver detalles</button>
    `;
    productDiv.querySelector('.ver-detalles-btn').addEventListener('click', () => {
      window.location.href = `detalle.html?id=${product.id}`;
    });
    contenedorProductos.appendChild(productDiv);
  });
}
inputBusqueda.addEventListener('input', filtrarProductos);
botonesCategoria.forEach(boton => {
  boton.addEventListener('click', () => {
    categoriaSeleccionada = boton.dataset.categoria;
    botonesCategoria.forEach(btn => btn.classList.remove('bg-blue-600', 'text-white'));
    boton.classList.add('bg-blue-600', 'text-white');
    filtrarProductos();
  });
});
document.addEventListener('DOMContentLoaded', cargarProductos);
