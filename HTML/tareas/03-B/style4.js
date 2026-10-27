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



class EstadisticasInventario {
    #inventario; // Guardamos la instancia completa del inventario
    
    constructor(instanciaInventario){
        this.#inventario = instanciaInventario;
        this.prodMayorPrecio;
        this.prodMenorPrecio;
        this.promedioPrecios;
    }
    
    actualizar(){
        // Accedemos de forma dinámica al arreglo actual usando la instancia
        const listaProductos = this.#inventario.productos;

        if (listaProductos.length === 0) {
            this.prodMayorPrecio = new Producto("" ," - ", 0);
            this.prodMenorPrecio = new Producto("" ," - ", 0);
            this.promedioPrecios = 0;
            return;
        }
        
        const precios = listaProductos.map(prod => prod.calcularPrecio());
        const precioMaximo = Math.max(...precios);
        const precioMinimo = Math.min(...precios);

        this.prodMayorPrecio = listaProductos.find(prod => prod.calcularPrecio() === precioMaximo);
        this.prodMenorPrecio = listaProductos.find(prod => prod.calcularPrecio() === precioMinimo);

        const sumaTotal = listaProductos.reduce((acum, prod) => acum + prod.calcularPrecio(), 0);
        this.promedioPrecios = sumaTotal / listaProductos.length;
    }
}




/*Actividad 4: Implemente una clase EstadisticasInventario que herede o reciba la lista de
productos de Inventario. Esta clase debe tener métodos que utilicen iteradores de arreglos
(reduce, Math.max, Math.min) para calcular:
o El producto de mayor precio.
o El producto de menor precio.
o El precio promedio de los productos.
• Muestre esta información dentro de un nuevo bloque en la interfaz HTML. Explique la razón
por la cual separar los cálculos estadísticos en una clase independiente favorece el principio
de responsabilidad única.*/
// Se agregará un div que contenga el <select>




// 3. Inicialización y Selección de DOM
const miInventario = new Inventario();

// Actividad 4: Estadísticas
// Crear objeto de estadísticas
const ESTD = new EstadisticasInventario(miInventario); // Pasa el objeto 
// Obtener referencias a HTML
const Estad_PrecioMayor = document.querySelector("#PrecioMayor");
const Estad_PrecioMenor = document.querySelector("#PrecioMenor");
const Estad_Promedio = document.querySelector("#Promedio");


function ActualizarEstadisticas(){
	Estad_PrecioMayor.textContent = ESTD.prodMayorPrecio.nombre;
	Estad_PrecioMenor.textContent = ESTD.prodMenorPrecio.nombre;
	Estad_Promedio.textContent = ESTD.promedioPrecios;
}


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
	
	// Actividad 4
	ESTD.actualizar();
	ActualizarEstadisticas()
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
	
	// Actividad 4
	ESTD.actualizar();
	ActualizarEstadisticas()
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


// Actividad 3: ordenar por
ordernar.addEventListener("change", () => {
    // Método
    miInventario.ordenarPor(ordernar.value);
	
    renderizar();
});


// Actividad 4: Estadísticas
// Función para actualizar los valores de las estadísticas en la página HTML









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