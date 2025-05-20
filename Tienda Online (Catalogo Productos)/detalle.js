document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
    return;
  }
  const volverBtn = document.getElementById('volverBtn');
  volverBtn.addEventListener('click', () => {
    window.location.href = 'Tienda de productos.html';
  });
  const logoutBtn = document.getElementById('logoutBtn');
  if (localStorage.getItem('token')) {
    logoutBtn.classList.remove('hidden');
  }
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const detalleDiv = document.getElementById('detalleProducto');

  if (!id) {
    detalleDiv.innerHTML = '<p class="text-red-500">ID de producto no especificado.</p>';
    return;
  }
  fetch(`https://fakestoreapi.com/products/${id}`)
    .then(res => res.json())
.then(producto => {
 detalleDiv.innerHTML = `
  <div class="flex flex-col md:flex-row bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-purple-800 w-full max-w-7xl">
    <div class="md:w-1/2 flex items-center justify-center bg-gray-900 p-8">
      <img src="${producto.image}" alt="${producto.title}" class="w-80 h-80 object-contain rounded shadow-lg bg-white p-2">
    </div>
    <div class="md:w-1/2 flex flex-col justify-center p-8 text-left">
      <h2 class="text-3xl font-bold text-white mb-2">${producto.title}</h2>
      <span class="inline-block bg-purple-800 text-white px-3 py-1 rounded-full text-sm mb-4">${producto.category}</span>
      <p class="text-2xl text-purple-400 font-semibold mb-3">$${producto.price}</p>
      <div class="flex items-center mb-4">
        <span class="text-yellow-400 text-xl mr-2">&#9733;&#9733;&#9733;&#9733;&#9734;</span>
      </div>
      <p class="mb-6 text-white">${producto.description}</p>
    </div>
  </div>
`;
})
    .catch(() => {
      detalleDiv.innerHTML = '<p class="text-red-500">No se pudo cargar el producto.</p>';
    });
});