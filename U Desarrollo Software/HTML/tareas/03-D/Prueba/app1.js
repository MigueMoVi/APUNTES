const API = 'https://api.github.com';

const form   = document.querySelector('#form-buscar');
const input  = document.querySelector('#input-usuario');
const boton  = document.querySelector('#btn-buscar');
const estado = document.querySelector('#estado');
const perfil = document.querySelector('#perfil');
const titulo = document.querySelector('#titulo-repos');
const repos  = document.querySelector('#repos');

// Actividad 1
// Usaremos una lista para guardar los resultados de las peticiones (para poder guardar varias y ordenarlas)
let perfilesBuscados = [];
// DIV de resumen para mostrar información
const contenedorResumen = document.querySelector('#resumenes');

// 1. Petición genérica con traducción de errores HTTP
async function obtenerJSON(url) {
    const res = await fetch(url);
    if (res.status === 404) throw new Error('Usuario no encontrado');
    if (res.status === 403) {
        throw new Error('Límite de peticiones alcanzado');
    }
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    return res.json();
}

// 2. Pintar el perfil
function mostrarPerfil(u) {
    const img = document.createElement('img');
    img.src = u.avatar_url;
    img.alt = `Avatar de ${u.login}`;

    const nombre = document.createElement('h2');
    // si el usuario no registró un nombre, se muestra su login
    nombre.textContent = u.name ?? u.login;

    const datos = document.createElement('p');
    datos.textContent =
        `${u.public_repos} repositorios · ${u.followers} seguidores`;

    const enlace = document.createElement('a');
    enlace.href = u.html_url;
    enlace.target = '_blank';
    enlace.textContent = 'Ver en GitHub';

    const info = document.createElement('div');
    info.append(nombre, datos, enlace);
    perfil.replaceChildren(img, info);
    perfil.classList.remove('oculto');
}

// 3. Pintar la lista de repositorios
function mostrarRepos(lista) {
    repos.innerHTML = '';
    lista.forEach(r => {
        const a = document.createElement('a');
        a.href = r.html_url;
        a.target = '_blank';
        a.textContent = r.name;

        const li = document.createElement('li');
        const lenguaje = r.language ?? 'sin lenguaje';
        li.append(a, ` - ${lenguaje} - ★${r.stargazers_count}`);
        repos.append(li);
    });
    titulo.classList.remove('oculto');
}

// 4. Evento submit: dos peticiones en paralelo
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const usuario = encodeURIComponent(input.value.trim());
    if (!usuario) return;

    const params = new URLSearchParams({ sort: 'updated', per_page: 5 });
    boton.disabled = true;
    estado.className = '';
    estado.textContent = 'Buscando...';

    try {
		// ACA SE ESTÁN GUARDANDO LOS DATOS
        const [datosUsuario, datosRepos] = await Promise.all([
            obtenerJSON(`${API}/users/${usuario}`),
            obtenerJSON(`${API}/users/${usuario}/repos?${params}`)
        ]);
		
		// Actividad 1: Usar una estructura para guardar todos los datos un usuario
		const nuevoPerfil = {
            usuario: datosUsuario,
            repos: datosRepos
        };
		// Lo agregamos a nuestra lista (historial)
        perfilesBuscados.push(nuevoPerfil);
		
		// Funciones de siempre
        mostrarPerfil(datosUsuario);
        mostrarRepos(datosRepos);
        estado.textContent = '';
		
		// Mostrar el resumen
		procesarYMostrarResumen(datosRepos);
		
    } catch (error) {
        perfil.classList.add('oculto');
        titulo.classList.add('oculto');
        repos.innerHTML = '';
        estado.className = 'error';
        estado.textContent = error.message;
    } finally {
        boton.disabled = false;
    }
});


// ACTIVIDAD 2
// Detectar los cambios en el <select>
const select_orden = document.querySelector("#ordenar_por");

// Detectar cambio del select en modo "change"
select_orden.addEventListener("change", () => {
    console.log(select_orden.value);
});

// Función para ordenar
// Método para procesar y mostrar el resumen de lenguajes
function procesarYMostrarResumen(listaRepos) {
	// Vaciar div
	contenedorResumen.innerHTML = '';
	
    const conteoLenguajes = {};

    listaRepos.forEach(repo => {
        const lenguaje = repo.language ?? 'Sin especificar';
        conteoLenguajes[lenguaje] = (conteoLenguajes[lenguaje] || 0) + 1;
    });

    // Construimos la estructura dentro de tu div #resumenes
    contenedorResumen.innerHTML = '<h3>Resumen de lenguajes:</h3>';
    const ul = document.createElement('ul');

    for (const [lenguaje, cantidad] of Object.entries(conteoLenguajes)) {
        const li = document.createElement('li');
        li.textContent = `${lenguaje}: ${cantidad} repositorio${cantidad > 1 ? 's' : ''}`;
        ul.append(li);
    }

    contenedorResumen.append(ul);
}





































































// Función para crear la estructura html del código original
function inicializarPerfiles() {
    // 1. Seleccionamos el contenedor principal
    const contenedorPerfiles = document.getElementById('perfiles');

    // 2. Creamos los elementos
    const estado = document.createElement('p');
    estado.id = 'estado';

    const perfil = document.createElement('section');
    perfil.id = 'perfil';
    perfil.className = 'perfil oculto';

    const tituloRepos = document.createElement('h2');
    tituloRepos.id = 'titulo-repos';
    tituloRepos.className = 'oculto';
    tituloRepos.textContent = 'Repositorios recientes';

    const repos = document.createElement('ul');
    repos.id = 'repos';

    // 3. Los inyectamos dentro del div#perfiles
    contenedorPerfiles.append(estado, perfil, tituloRepos, repos);

    // 4. Retornamos un objeto con las referencias a los elementos creados
    return {
        estado,
        perfil,
        tituloRepos,
        repos
    };
}



