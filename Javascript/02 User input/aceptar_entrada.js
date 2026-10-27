// JS para aceptar entrada

// Modo 1
let Nombre
Nombre = window.prompt("¿Cuál es tu nombre? ")
// Imprimir en consola
console.log(Nombre);




// Modo 2
let nombre;
document.getElementById("mySubmit").onclick = function(){
	nombre = document.getElementById("nombre_input").value;
	console.log(nombre);
}