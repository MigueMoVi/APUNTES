// 1. Modelo de Datos: Clase Producto
class Producto {
    constructor(id, nombre, precio) {
        this.id = id;
        this.nombre = nombre;
        this.precio = parseFloat(precio);
    }
}

// 2. Manejador de Lógica y Estado del Inventario
class Inventario {
    constructor() {
        this.productos = [];
    }

    agregarProducto(nombre, precio) {
        const id = Date.now(); // Genera ID único basado en timestamp
        const nuevoProducto = new Producto(id, nombre, precio);
        this.productos.push(nuevoProducto);
        return nuevoProducto;
    }

    eliminarProducto(id) {
        this.productos = this.productos.filter(prod => prod.id !== id);
    }
	
	
	//const sumWithInitial = array1.reduce(  (accumulator, currentValue) => accumulator + currentValue, initialValue  );
    calcularTotal() {
		// ELEMENTO: {id: 1791302270115, nombre: 'hola', precio: 12}
        return this.productos.reduce((acum, prod) => acum + prod.precio, 0);
    }

    obtenerCantidad() {
        return this.productos.length;
    }
}

// 3. Inicialización y Selección de DOM
const miInventario = new Inventario();

const form = document.querySelector('#form-producto');
const inputNombre = document.querySelector('#nombre');
const inputPrecio = document.querySelector('#precio');
const contenedorLista = document.querySelector('#lista-productos');
const resumenDiv = document.querySelector('#resumen');

// 4. Función para renderizar la interfaz a partir del arreglo de datos
function renderizar() {
    // Limpiar contenido previo
    contenedorLista.innerHTML = '';

    // Renderizado dinámico usando map
    miInventario.productos.map(producto => {
        const div = document.createElement('div');
        div.className = 'card';
        div.dataset.id = producto.id;

        div.innerHTML = `
            <span><strong>${producto.nombre}</strong> - $${producto.precio.toFixed(2)}</span>
            <button class="btn-eliminar">Eliminar</button>
        `;

        contenedorLista.append(div);
    });

    // Actualizar resumen de información
    const cantidad = miInventario.obtenerCantidad();
    const total = miInventario.calcularTotal();
    resumenDiv.textContent = `Total de productos: ${cantidad} | Valor Total: $${total.toFixed(2)}`;
}

// 5. Eventos
form.addEventListener('submit', (e) => {
    e.preventDefault();
    miInventario.agregarProducto(inputNombre.value.trim(), inputPrecio.value);
    
    // Limpiar formulario y enfocar
    form.reset();
    inputNombre.focus();

    renderizar();
});

// Delegación de eventos para eliminar productos
contenedorLista.addEventListener('click', (e) => {
    if (e.target.matches('.btn-eliminar')) {
        const tarjeta = e.target.closest('.card');
        const id = Number(tarjeta.dataset.id);
        
        miInventario.eliminarProducto(id);
        renderizar();
    }
});