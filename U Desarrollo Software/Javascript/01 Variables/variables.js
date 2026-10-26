// Variables

// declarar
let x;
x = 100;

console.log(x);

let y = 200;
console.log(y);


// incuir en un mensaje
let age = 25;
console.log(`Tu edad es ${age}`);

// Tipo de variable
console.log("Tipo de variable de x:");
console.log(typeof x);

let name = "Nombre";
console.log("Tipo de variable de name");
console.log(typeof name);



// ====== Rellenar div de datos ejemplo 1
let name1 = "Bro";
let edad = 25;
let isStudent = true;

document.getElementById("nombre").textContent = `El nombre es ${name1}`;
document.getElementById("edad").textContent = "La edad es "+edad;
document.getElementById("isStudent").textContent = "Es estudiante? " + isStudent;


// Imprimir una variable booleana
let online = true;
console.log(` Is Bro on online? ${online}`)

let N = 10;
console.log(` Imprimiendo un bucle de ${N} números`)
for(let i = 0; i<N; i++){
	console.log(i);
}