const contenedorProductos = document.getElementById('productos');
const inputBusqueda = document.getElementById('busqueda');
const contenedorCategorias = document.getElementById('categorias');
let productos = [];
let categoriasSeleccionada = "all";

async function cargarProductos() {
  try {
    mostrarMensaje('Cargando productos...');
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error('Error en la respuesta de la API');
    }
    const products = await response.json();
    productos = products;

    if (products.length === 0) {
      console.log('No hay productos disponibles');
    } else {
      mostrarProductos(products);
    }
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    mostrarMensaje('Error al cargar los productos. Por favor, inténtalo de nuevo más tarde.');
  }
}

async function cargarCategorias() {
  try {
    const response = await fetch('https://fakestoreapi.com/products/categories');
    if (!response.ok) {
      throw new Error('Error en la respuesta de la API');
    }
    const categories = await response.json();
    mostrarCategorias(['all' , ...categories]); 
  } catch (error) {
    console.error('Error al cargar las categorías:', error);
  }
}

function mostrarCategorias(categorias) {
  contenedorCategorias.innerHTML = '';
  categorias.forEach(categoria => {
    const btn = document.createElement('button');
    btn.textContent = categoria === 'all' ? 'Todos' : categoria.charAt(0).toUpperCase() + categoria.slice(1);
    btn.className = `px-4 py-2 rounded-full ${
      categoria === categoriasSeleccionada ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }`;
    btn.addEventListener('click', () => {
      categoriasSeleccionada = categoria;
      filtrarProductosPorCategoria(categoria);
      mostrarCategorias(categorias);
    });
    contenedorCategorias.appendChild(btn);
  });
}

function filtrarProductosPorCategoria(categoria) {
  let productosFiltrados = productos;
  if (categoria !== 'all') {
    productosFiltrados = productos.filter(product => product.category === categoria);
  }
  mostrarProductos(productosFiltrados);
}

function filtrarProductos() {
  let filtrados = productos;
  const textoBusqueda = inputBusqueda.value.toLowerCase();
  if (textoBusqueda.trim() !== '') {
    filtrados = filtrados.filter(p =>
      p.title.toLowerCase().includes(textoBusqueda) ||
      p.description.toLowerCase().includes(textoBusqueda)
    );
  }
  mostrarProductos(filtrados);
}
function mostrarMensaje(mensaje) {
  contenedorProductos.innerHTML = `
    <p class="text-gray-500 text-center">${mensaje}</p>
  `;
}
function mostrarProductos(products) {
  contenedorProductos.innerHTML = '';
  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className =
      'bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-xl transition-shadow duration-300';
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="w-32 h-32 object-cover mb-4 rounded-lg">
      <h2 class="text-lg font-semibold mb-2">${product.title}</h2>
      <p class="text-gray-700 mb-2">$${product.price}</p>
    `;
    contenedorProductos.appendChild(productDiv);
  });
}
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  cargarCategorias();
  inputBusqueda.addEventListener('input', filtrarProductos);
});