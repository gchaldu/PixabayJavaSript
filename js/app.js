
const resultado = document.querySelector('#resultado');
const paginacionDiv = document.querySelector('#paginacion');

let paginaActual = 1;
let totalPaginas;
let iteradorSiguiente;

window.onload = () => {
    const formulario = document.querySelector('#formulario');
    formulario.addEventListener('submit', validarFormulario);
    paginacionDiv.addEventListener('click', direccionPaginacion);
};

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === '') {
        // mensaje de error
        mostrarAlerta('Agrega un término de búsqueda');
        return;
    }

    buscarImagenes();
}


// Muestra una alerta de error o correcto
function mostrarAlerta(mensaje) {
    const alerta = document.querySelector('.bg-red-100');
    if(!alerta) {
        const alerta = document.createElement('p');

        alerta.classList.add('bg-red-100', "border-red-400", "text-red-700", "px-4", "py-3", "rounded",  "max-w-lg", "mx-auto", "mt-6", "text-center" );
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
    
        formulario.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}


// Busca las imagenes en una API
function buscarImagenes() {
    const terminoBusqueda = document.querySelector('#termino').value;

    const key = '1732750-d45b5378879d1e877cd1d35a6';
    const url = `https://pixabay.com/api/?key=${key}&q=${terminoBusqueda}&per_page=30&page=${paginaActual}`;

    fetch(url) 
        .then(respuesta => respuesta.json())
        .then( resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);

            // console.log(totalPaginas)

            mostrarImagenes(resultado.hits);
        });


}

function mostrarImagenes(imagenes, paginas ) {

    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    imagenes.forEach( imagen => {

        const { likes, views, previewURL, largeImageURL } = imagen;
        resultado.innerHTML += 
    `<div class="card">
        <a href=${largeImageURL} target="_blank">
            <div class="card-image-container">
                <img src=${previewURL} alt="Descripción de la imagen">
                <div class="overlay">
                    <div class="card-flex">
                        <h2 class="card-views-likes">${likes} <i class="fa-solid fa-heart"></i></h2>
                        <h2 class="card-views-likes">${views} <i class="fa-solid fa-eye"></i></h2>
                    </div>
                </div>
        </a>
    </div>`
        
    });


    if(!iteradorSiguiente) {
        mostrarPaginacion();
    }
 
}

function mostrarPaginacion() {
    // recorrer el iterador
    iteradorSiguiente = crearPaginacion(totalPaginas);
    while( true ) {
        const { value, done } = iteradorSiguiente.next();

        if(done) return;

        // Crear botón de sig
        const botonSiguiente = document.createElement('a');
        botonSiguiente.href = "#";
        botonSiguiente.dataset.pagina = value;
        botonSiguiente.textContent = value;
        paginacionDiv.appendChild(botonSiguiente);
    }
}

function calcularPaginas(total) {
    return parseInt( Math.ceil( total / 30 ));
}


// Crear el generador
function *crearPaginacion(total) {
    console.log(total);
    for( let i = 1; i <= total; i++) {
        yield i;
    }
}

function direccionPaginacion(e) {
    if(e.target.classList.contains('siguiente')) {

        paginaActual= Number( e.target.dataset.pagina);
        buscarImagenes();
        formulario.scrollIntoView();
    }
}