const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");
const imagenesPaginas = 30;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener("submit", validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();

    const termino = document.querySelector("#termino").value;

    if(termino.trim() === "") {
        mostrarAlerta("Agrega un termino de busqueda.");
        return;
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje) {
    const alerta = document.createElement("p");
    alerta.classList.add("bg-red-100", "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "max-w-lg", "mx-auto", "mt-6", "text-center", "alert");
    alerta.innerHTML = `
        <strong class="font-bold">Error: </strong>
        <span class="block sm-inline">${mensaje}</span>
    `;

    if(!document.querySelector(".alert")) {
        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

async function buscarImagenes() {
    const termino = document.querySelector("#termino").value.replace(" ", "+");

    const key = "22745002-10357d56cc65c285f801e8ca6";
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${imagenesPaginas}&page=${paginaActual}`;

    try {
        const response = await fetch(url);
        const result = await response.json();
        totalPaginas = calcularPaginas(result.totalHits);
        mostrarImagenes(result.hits);
    } catch (error) {
        console.log(error);
    }
}

function mostrarImagenes(imagenes) {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    imagenes.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;
        
        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">
                    <div class="p-4">
                        <p class="font-bold">${likes} <span class="font-light">Me Gusta</span></p>
                        <p class="font-bold">${views} <span class="font-light">Veces Vista</span></p>
                        <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver Imagen</a>
                    </div>
                </div>
            </div>
        `;
    });

    // Limpiar el páginador
    while(paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    imprimirPaginador();
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / imagenesPaginas));
}

// Generador para obtener la cantidad de elementos de acuerdo a las páginas
function *crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);
    
    while(true) {
        const { value, done } = iterador.next();
        if(done) break;

        // Generar los botones
        const boton = document.createElement("a");
        boton.href = "#";
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add("siguiente", "bg-yellow-400", "px-4", "py-1", "mr-2", "font-bold", "mb-10", "rounded");
        boton.onclick = e => {
            e.preventDefault();
            paginaActual = value;
            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }
}