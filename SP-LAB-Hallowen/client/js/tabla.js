//import { Monstruo } from "./Monstruo";

const crearTabla = (data)=>
{
    if(!Array.isArray(data)) return null; 
    const tabla = document.createElement('table');
    tabla.appendChild(crearCabecera(data[0]));
    tabla.appendChild(crearCuerpo(data));
    return tabla;
};

// const crearCabecera = (elemento)=>
// {
//     const thead = document.createElement('thead');
//     const headRow = document.createElement('tr');
//     headRow.setAttribute("class", "cabecera"); 
//     for (const key in elemento) 
//     {
//         if(key === "id") continue; // Oculto id.
//         const th = document.createElement('th');
//         th.setAttribute("class", "ths");
//         th.textContent = key;
//         headRow.appendChild(th);
//     }
//     thead.appendChild(headRow);
//     return thead;
// };

const crearCabecera = (elemento, index) =>
{
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    headRow.setAttribute("class", "cabecera"); 
    for (const key in elemento) 
    {
        if(key === "id") continue; // Oculto id.
        const th = document.createElement('th');
        th.setAttribute("class", "ths");
        th.textContent = key;
        th.dataset.index = index;  
        headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    return thead;
};

const crearCuerpo = (data)=>
{  

    if(!Array.isArray(data)) return null; 
    const tBody = document.createElement('tbody');
    data.forEach((elemento, index)=>
    {
        const tr = document.createElement('tr');
        if(index % 2 == 0)
        {
            tr.classList.add("rowPar"); // alternar colores
        }
        else
        {
            tr.classList.add("rowImpar"); // alternar colores.
        }
        for (const key in elemento) 
        {
            const td = document.createElement('td');
            if(key === "id") // id como atributo.
            {
                tr.dataset.id = index;                
            }
            else
            {                
                td.textContent = elemento[key];
                tr.appendChild(td);
                
            }
        }
        tBody.appendChild(tr);
    })
    return tBody;
};

const DELAY = 300;

export const actualizarTabla = (contenedor, data)=>
{
    while(contenedor.hasChildNodes())
    {
        contenedor.removeChild(contenedor.firstChild);
    }
    arrancarSpinner();    
    setTimeout(() => {frenarSpinner();}, DELAY);
    promedio.value = calcularPromedio(data);
    contenedor.appendChild(crearTabla(data));
};


let orden = true; 

export function ordenarTabla(lista, clave)
{
    if(orden)
    {
        orden = false;
        lista.sort((a,b)=>{
            return a[clave] < b[clave]
        });
    }
    else
    {
        orden = true;
        lista.sort((a,b)=>{
            return a[clave] > b[clave]
        });
    }
}


function calcularPromedio(lista)
{
    let acumulador = lista.reduce((anterior, actual) => // REDUCE
    {
        let acumulador = anterior + parseInt(actual.miedo);
        return acumulador;
    }, 0);
    if(acumulador >= 1)
    {
        return Math.round(acumulador / lista.length);
    }
    else
    {
        return "N/A"; // no muestra nada
    }
};



export function arrancarSpinner() 
{
    const divSpinner = document.getElementById("spinner");
    const imagen = document.createElement("img");
    const tabla = document.getElementById("tabla");
    imagen.setAttribute("src", "./img/calabaza-gif.gif");
    imagen.setAttribute("alt", "Spinner girando");
    imagen.setAttribute("id", "spinner-girando");
    tabla.hidden = true;
    divSpinner.appendChild(imagen);
}

export function frenarSpinner() 
{
    const imagen = document.getElementById("spinner-girando");
    const tabla = document.getElementById("tabla");
    imagen.remove();
    tabla.hidden = false;
    document.getElementById("btnGuardar").disabled = false;
}