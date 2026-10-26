const URL_API = 'https://jsonplaceholder.typicode.com/users';

const btn    = document.querySelector('#btn-cargar');
const btnprobar    = document.querySelector('#btn-probar');
const estado = document.querySelector('#estado');
const lista  = document.querySelector('#lista');

// 1. Función asíncrona que obtiene los datos
async function obtenerUsuarios() {
    const respuesta = await fetch(URL_API);
    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }
	//console.log(typeof respuesta) // OBJECT
    return respuesta.json();
}

// 2. Pintar los usuarios en el DOM
function mostrarUsuarios(usuarios) {
	console.log(usuarios);
    lista.innerHTML = '';
    usuarios.forEach(u => {
        const li = document.createElement('li');
		
		// Usamos dataset para guardar el id del usuario
        li.dataset.id = u.id;
		
		
        li.textContent = `${u.name} - ${u.email}`;
        lista.append(li);
    });
}


// Función para obtener y mostrar publicaciones de un usuario específico
async function cargarPublicaciones(userId, elementoLi) {
    // Evitar recargar si ya tiene publicaciones o está cargando
    if (elementoLi.querySelector('ul')) return;

    const contenedorPosts = document.createElement('ul');
    const itemCargando = document.createElement('li');
    itemCargando.textContent = 'Cargando publicaciones...';
    itemCargando.style.color = 'gray';
    contenedorPosts.append(itemCargando);
    elementoLi.append(contenedorPosts);

    try {
        const respuesta = await fetch(`_https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);
        const posts = await respuesta.json();

        // Limpiar el texto de "Cargando..."
        contenedorPosts.innerHTML = '';

        posts.forEach(post => {
            const postLi = document.createElement('li');
            postLi.textContent = post.title;
            contenedorPosts.append(postLi);
        });
    } catch (error) {
        itemCargando.textContent = `Error al cargar publicaciones: ${error.message}`;
    }
}

// Delegación de eventos en la lista
lista.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    // Nos aseguramos de que se hizo clic en un li directo de la lista de usuarios y que tiene dataset.id
    if (li && li.dataset.id && li.parentElement === lista) {
        const userId = li.dataset.id;
        cargarPublicaciones(userId, li);
    }
});



function pruebaAsincrono(){
    console.log('1. Pedido recibido');

    setTimeout(() => {
        console.log('3. Pedido listo');      // se ejecuta 2 segundos después
    }, 2000);

    console.log('2. Atendiendo al siguiente cliente');
}

// 3. Evento: carga asíncrona con manejo de errores
// Botón de cargar (btn)
btn.addEventListener('click', async () => {
    btn.disabled = true;
    estado.className = 'estado';
    estado.textContent = 'Cargando...';

    try {
        const usuarios = await obtenerUsuarios();
        mostrarUsuarios(usuarios);
        estado.textContent = `${usuarios.length} usuarios cargados`;
    } catch (error) {
        estado.className = 'error';
        estado.textContent = `No se pudo cargar: ${error.message}`;
    } finally {
        btn.disabled = false;                 // se ejecuta siempre
    }
});

/*

btn.addEventListener('click', async () => {
    btn.disabled = true;
    estado.className = 'estado';
    estado.textContent = 'Cargando...';

    try {
        const usuarios = await obtenerUsuarios();
        mostrarUsuarios(usuarios);
        estado.textContent = `${usuarios.length} usuarios cargados`;
    } catch (error) {
        estado.className = 'error';
        estado.textContent = `No se pudo cargar: ${error.message}`;
    } finally {
        btn.disabled = false;                 // se ejecuta siempre
    }
});

*/


btnprobar.addEventListener('click', pruebaAsincrono);