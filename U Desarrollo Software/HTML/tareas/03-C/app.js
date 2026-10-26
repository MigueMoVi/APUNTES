const URL_API = 'https://jsonplaceholder.typicode.com/users';
const URL_POSTS = 'https://jsonplaceholder.typicode.com/posts';

const btn           = document.querySelector('#btn-cargar');
const btnprobar     = document.querySelector('#btn-probar');
const btnSecuencial = document.querySelector('#btn-secuencial');
const btnConcurrente = document.querySelector('#btn-concurrente');
const estado        = document.querySelector('#estado');
const lista         = document.querySelector('#lista');

// 1. Función básica para obtener usuarios
async function obtenerUsuarios() {
    const respuesta = await fetch(URL_API);
    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }
    return respuesta.json();
}

// ---------------------------------------------------------------------------
// Comparativa de rendimiento: Versión Secuencial vs Promise.all
// ---------------------------------------------------------------------------
async function obtenerDatosSecuencial() {
    console.time('Tiempo Secuencial');
    
    const resUsuarios = await fetch(URL_API);
    const usuarios = await resUsuarios.json();

    const resPosts = await fetch(URL_POSTS);
    const posts = await resPosts.json();

    console.timeEnd('Tiempo Secuencial');
    return { usuarios, posts };
}

async function obtenerDatosConcurrente() {
    console.time('Tiempo Promise.all');

    const [resUsuarios, resPosts] = await Promise.all([
        fetch(URL_API),
        fetch(URL_POSTS)
    ]);

    const usuarios = await resUsuarios.json();
    const posts = await resPosts.json();

    console.timeEnd('Tiempo Promise.all');
    return { usuarios, posts };
}

async function probarRendimiento() {
    console.log('--- Iniciando prueba de rendimiento conjunta ---');
    await obtenerDatosSecuencial();
    await obtenerDatosConcurrente();
    console.log('--- Prueba finalizada ---');
}

// 2. Pintar los usuarios en el DOM (con dataset para el id)
function mostrarUsuarios(usuarios) {
    lista.innerHTML = '';
    usuarios.forEach(u => {
        const li = document.createElement('li');
        li.dataset.id = u.id; // Guardamos el id en el dataset
        li.style.cursor = 'pointer';
        li.textContent = `${u.name} - ${u.email}`;
        lista.append(li);
    });
}

// 3. Función para obtener y mostrar las publicaciones de un usuario específico
async function cargarPublicaciones(userId, elementoLi) {
    // Evita duplicar peticiones si ya se cargaron las publicaciones de este usuario
    if (elementoLi.querySelector('ul')) return;

    const contenedorPosts = document.createElement('ul');
    const itemCargando = document.createElement('li');
    itemCargando.textContent = 'Cargando publicaciones...';
    itemCargando.style.color = 'gray';
    contenedorPosts.append(itemCargando);
    elementoLi.append(contenedorPosts);

    try {
        const respuesta = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);
        const posts = await respuesta.json();

        // Limpiamos el texto de carga
        contenedorPosts.innerHTML = '';

        posts.forEach(post => {
            const postLi = document.createElement('li');
            postLi.textContent = post.title;
            contenedorPosts.append(postLi);
        });
    } catch (error) {
        itemCargando.textContent = `Error al cargar publicaciones: ${error.message}`;
        itemCargando.style.color = 'crimson';
    }
}

// 4. Delegación de eventos en la lista de usuarios
lista.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    // Verificamos que se hizo clic en un li directo de la lista y que tiene dataset.id
    if (li && li.dataset.id && li.parentElement === lista) {
        cargarPublicaciones(li.dataset.id, li);
    }
});

function pruebaAsincrono() {
    console.log('1. Pedido recibido');

    setTimeout(() => {
        console.log('3. Pedido listo');      // se ejecuta 2 segundos después
    }, 2000);

    console.log('2. Atendiendo al siguiente cliente');
}

// 5. Evento principal de carga (usando Promise.all para optimizar)
btn.addEventListener('click', async () => {
    btn.disabled = true;
    estado.className = 'estado';
    estado.textContent = 'Cargando datos...';

    try {
        const { usuarios } = await obtenerDatosConcurrente();
        mostrarUsuarios(usuarios);
        estado.textContent = `${usuarios.length} usuarios cargados correctamente`;
    } catch (error) {
        estado.className = 'error';
        estado.textContent = `No se pudo cargar: ${error.message}`;
    } finally {
        btn.disabled = false;                 // se ejecuta siempre
    }
});

// Botón de prueba conjunto (secuencial + concurrente)
btnprobar.addEventListener('click', () => {
    pruebaAsincrono();
    probarRendimiento(); 
});

// Eventos para los nuevos botones individuales de prueba de rendimiento
btnSecuencial.addEventListener('click', async () => {
    console.log('--- Iniciando prueba Individual Secuencial ---');
    await obtenerDatosSecuencial();
});

btnConcurrente.addEventListener('click', async () => {
    console.log('--- Iniciando prueba Individual con Promise.all ---');
    await obtenerDatosConcurrente();
});