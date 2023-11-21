import {getCardsFetch} from "./Db.js";

const lista = await getCardsFetch();

const seccionAnuncios = document.querySelector("#tarjetas");

// LISTA DE ICONOS
const listaIconos = ["./img/icono-antifaz-removebg-preview.png", "./img/icono-monstruo-removebg-preview.png", "./img/icono-miedo-removebg-preview.png", "./img/icono-tipo-removebg-preview.png"];

lista.forEach((elemento) => {
    const anuncio = crearAnuncio(elemento);
    seccionAnuncios.appendChild(anuncio);
});

function crearAnuncio(elemento) {
    const article = document.createElement("article");
    article.classList.add("card");
    let i = 0;
    Object.keys(elemento).forEach((key) => 
    {
        if (key !== "id") 
        {
            let clave = document.createElement("h3");
            if(key != "nombre")
            {
                let icono = document.createElement("img");
                icono.classList.add("icono");
                icono.src = listaIconos[i];
                i = i + 1;
                clave.appendChild(icono);
                let parrafo = document.createElement("div");
                parrafo.textContent = key;
                clave.appendChild(parrafo);
            }
            article.appendChild(clave);
            let contenido = document.createElement("p")
            contenido.textContent = elemento[key];
            article.appendChild(contenido);
        }
    });

    // Boton
    const button = document.createElement("button");
    button.textContent = "Ver Monstruo";
    article.appendChild(button);

    return article;
}

