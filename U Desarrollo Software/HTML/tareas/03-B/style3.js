// 1. Modelo de Datos: Clase Producto
const DESC = 0.10;
const PRECIO_DSC = 100;

class Producto {
	// Atributo privado
	#descuento;
	
	// Código normal
    constructor(id, nombre, precio) {
        this.id = id;
        this.nombre = nombre;
        this.precio = parseFloat(precio);
		
		// Evaluar descuento
		if (this.precio > PRECIO_DSC){
			this.#descuento = DESC;
		}
		else{
			this.#descuento = 0;
		}
    }
	
	// Se tendrá que llamar a función para obtener el precio real
	calcularPrecio(){
		return this.precio * (1 - this.#descuento);
	}
	
	tieneDesc(){
		if (this.#descuento > 0){ return true; }
		return false;
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
		// modificacion usando método calcularPrecio() en vez de llamar al atributo
        return this.productos.reduce((acum, prod) => acum + prod.calcularPrecio(), 0);
    }

    obtenerCantidad() {
        return this.productos.length;
    }
	
	// Actividad 1 - Buscador
	filtrarPorNombre(termino){
		//return this.productos.includes( termino );
		const terminoMinuscula = termino.toLowerCase();

        // Usamos .filter() para recorrer el arreglo de objetos
        return this.productos.filter(prod => {
            // Usamos .includes() sobre el atributo nombre de cada producto
            return prod.nombre.toLowerCase().includes(terminoMinuscula);
        });
		
	}
	
	// Actividad 3
	ordenarPor(criterio) {
        if (criterio === "nombre") {
            this.productos.sort((a, b) => {
                if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) return 1;
                if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) return -1;
                return 0;
            });
        } else if (criterio === "precio-menor") {
            this.productos.sort((a, b) => a.calcularPrecio() - b.calcularPrecio());
        } else if (criterio === "precio-mayor") {
            this.productos.sort((a, b) => b.calcularPrecio() - a.calcularPrecio());
        }
    }
}


/*Actividad 3: Incorpore la capacidad de ordenar los productos. Agregue un elemento <select
id="ordenar"> con opciones para ordenar por "Nombre (A-Z)", "Precio (Menor a Mayor)" y
"Precio (Mayor a Menor)". Implemente un método ordenarPor(criterio) en la clase Inventario
que utilice el método .sort() de arreglos para reorganizar la colección de productos y
actualizar la vista cuando el usuario cambie la opción.*/
// Se agregará un div que contenga el <select>




// 3. Inicialización y Selección de DOM
const miInventario = new Inventario();

const form = document.querySelector('#form-producto');
const inputNombre = document.querySelector('#nombre');
const inputPrecio = document.querySelector('#precio');
const contenedorLista = document.querySelector('#lista-productos');
const resumenDiv = document.querySelector('#resumen');

// Actividad 1 - Campo de búsqueda
const buscador = document.querySelector("#buscador");

// Actividad 3: <select>
const ordernar = document.querySelector("#orden");

// 4. Función para renderizar la interfaz a partir del arreglo de datos
function renderizar() {
    // Limpiar contenido previo
    contenedorLista.innerHTML = '';

    // Renderizado dinámico usando map
    miInventario.productos.map(producto => {
        const div = document.createElement('div');
        div.className = 'card';
        div.dataset.id = producto.id;

		// Modificación para mostrar precio real y con descuento
		if (producto.tieneDesc()){
			div.innerHTML = `
				<span><strong>${producto.nombre}</strong> <s style = "color: #757877;">${producto.precio.toFixed(2)}</s> - $${producto.calcularPrecio().toFixed(2)}</span>
				<button class="btn-eliminar">Eliminar</button>
			`;
		}
		else{
			div.innerHTML = `
				<span><strong>${producto.nombre}</strong> - $${producto.calcularPrecio().toFixed(2)}</span>
				<button class="btn-eliminar">Eliminar</button>
			`;
		}
        

        contenedorLista.append(div);
    });

    // Actualizar resumen de información
    const cantidad = miInventario.obtenerCantidad();
    const total = miInventario.calcularTotal();
    resumenDiv.textContent = `Total de productos: ${cantidad} | Valor Total: $${total.toFixed(2)}`;
}
function renderizarFiltrado(array) {
    // Limpiar contenido previo
    contenedorLista.innerHTML = '';

    // Renderizado dinámico usando map
    array.map(producto => {
        const div = document.createElement('div');
        div.className = 'card';
        div.dataset.id = producto.id;
		
		
        // Modificación para mostrar precio real y con descuento
		if (producto.tieneDesc()){
			div.innerHTML = `
				<span><strong>${producto.nombre}</strong> <s style = "color: #757877;">${producto.precio.toFixed(2)}</s> - $${producto.calcularPrecio().toFixed(2)}</span>
				<button class="btn-eliminar">Eliminar</button>
			`;
		}
		else{
			div.innerHTML = `
				<span><strong>${producto.nombre}</strong> - $${producto.calcularPrecio().toFixed(2)}</span>
				<button class="btn-eliminar">Eliminar</button>
			`;
		}

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


// Actividad 2: Buscador
buscador.addEventListener("input", () => {
	//console.log(`-> ${buscador.value}`);
	// .includes - Busca coincidencias
	// .filter - Seleccionar ciertos datos
	const productosFiltrados = miInventario.filtrarPorNombre(buscador.value);
	
	renderizarFiltrado(productosFiltrados);
});


// Actividad 3: ordernar por
// Actividad 3: ordenar por
ordernar.addEventListener("change", () => {
    // Método
    miInventario.ordenarPor(ordernar.value);
	
    renderizar();
});








/*
ordernar.addEventListener("input", () => {
	// Ordernar dependiendo del valor
	let arr_ordenado = miInventario.productos;
	if (ordernar.value.toLowerCase() === "nombre"){
		arr_ordenado.sort( function(a,b){
			if (a.nombre > b.nombre){ return 1; }
			if (a.nombre < b.nombre){ return -1; }
			return 0;
		} );
		renderizarFiltrado(arr_ordenado);
	}
	else if (ordernar.value.toLowerCase() === "precio"){
		arr_ordenado.sort( function(a,b){
			if (a.calcularPrecio() > b.calcularPrecio()){ return 1; }
			if (a.calcularPrecio() < b.calcularPrecio()){ return -1; }
			return 0;
		} );
		renderizarFiltrado(arr_ordenado);
	}
	else{
		// ninguno
		renderizar();
	}
	
}
);
*/