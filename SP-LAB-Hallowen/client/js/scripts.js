import { actualizarTabla, ordenarTabla } from "./tabla.js";
import { Monstruo } from "./Monstruo.js";
import { validarDatos, limpiarValidaciones } from "./validaciones.js";
import {
    getTiposAjax,
    getAnunciosAjax,
    getAnunciosAxios,
    getAnunciosFetch,
    createAnuncioAjax,
    createAnuncioAxios,
    createAnuncioFetch,
    updateAnuncioAjax,
    updateAnuncioAxios,
    updateAnuncioFetch,
    deleteAnuncioAjax,
    deleteAnuncioAxios,
    deleteAnuncioFetch,
    getAnuncioPorIdAjax
} from "./Db.js";

let id = null; 
let index = null; 
const $form = document.forms[0];
const $containerTabla = document.getElementById("tabla");
const $containerBotones = document.getElementById("botones-container");
const $select = document.getElementById("filtro");
const listaTipo = await getTiposAjax(); 
const lista = [];
const lista2 = await getAnunciosAjax(); 

console.log(lista);
lista2.forEach(element =>  {
    let bicho = new Monstruo(element.id, element.nombre, element.tipo, element.alias, element.miedo, element.defensa);
    lista.push(bicho);
});

let banderaFiltros = false;
let listaFiltrada = filtrarTabla($containerTabla, lista, $select.value);
let listadoCheck = listaFiltrada;
document.getElementById("btnGuardar").disabled = false;
const checkbox = document.querySelectorAll(".chbox");
checkbox.forEach(element => {element.checked = true;});


window.addEventListener("load", ()=>{$form.reset();});

$containerBotones.addEventListener("click", (e) => 
{

    const boton = e.target.textContent;
    if(boton == "Guardar")
    {
        // Desestructuracion del objeto form
        const {txtId, txtNombre, txtTipo, txtAlias, txtMiedo, rdoDefensa} = $form;
        if(txtId.value === "")
        {
            
            if(validarDatos($form))
            {
                
                const newItem = new Monstruo(
                    Date.now(), 
                    txtNombre.value,
                    txtTipo.value,
                    txtAlias.value,
                    parseInt(txtMiedo.value),
                    rdoDefensa.value,
                    );
                    console.log(newItem);
                    console.log(txtTipo.value);
                lista.push(newItem);
                limpiarForm();
                createAnuncioAjax(newItem);
                //createAnuncioAxios(newItem);
                //createAnuncioFetch(newItem); 
            }
        }
        else
        {
            
            if(validarDatos($form) && confirm("¿Desea guardar los cambios?"))
            {
                // modificar
                const newItem = new Monstruo(
                    parseInt(txtId.value), 
                    txtNombre.value,
                    txtTipo.value,
                    txtAlias.value, 
                    parseInt(txtMiedo.value),
                    rdoDefensa.value
                    );
                lista.splice(index, 1, newItem);
                limpiarForm();
                updateAnuncioAjax(newItem); 
                //updateAnuncioAxios(newItem);
                //updateAnuncioFetch(newItem); 
            }
        }
    }
    else if(boton == "Eliminar")
    {   
        
        if(index && confirm("¿Desea ELIMINAR el item seleccionado?"))
        {
            deleteAnuncioAjax(id);
            //deleteAnuncioAxios(id);
            //deleteAnuncioFetch(id);
            limpiarForm();            
        }
    }
    else if(boton == "Cancelar")
    {
        limpiarForm();
        limpiarValidaciones();
        document.getElementById("btnGuardar").disabled = false;
    }
});

$containerTabla.addEventListener("click", (e)=>
{
    if(e.target.matches("td")) 
    {
        index = e.target.parentElement.getAttribute("data-id");
        id = lista[index].id;
        const selectedItem = lista.find((item)=>item.id == id);
        cargarFormItem($form, selectedItem);
        document.getElementById("btnCancelar").disabled = false;
        document.getElementById("btnEliminar").disabled = false;
        document.getElementById("btnGuardar").disabled = false;
       
        limpiarValidaciones();
    }
    else if(e.target.matches("th"))
    { //revisar el sort
        let claveSort = e.target.textContent;
        ordenarTabla(lista, claveSort);        
        limpiarForm();
        actualizarTabla($containerTabla, lista);
    }
});

function cargarFormItem(formulario, item)
{  
    formulario.txtId.value = item.id;
    formulario.txtNombre.value = item.nombre;
    formulario.txtAlias.value = item.alias;
    formulario.txtMiedo.value = item.miedo;
    formulario.rdoDefensa.value = item.defensa;
    formulario.txtTipo.value = item.tipo;
}

function limpiarForm()
{
    id = null;
    index = null;
    document.getElementById("txtId").value = "";
    document.getElementById("btnCancelar").disabled = false;
    document.getElementById("btnEliminar").style.display = "none";
    document.getElementById("btnGuardar").disabled = false;
    $form.reset();
}

cargarTipos(listaTipo);
function cargarTipos(lista)
{
    let input = document.getElementById("txtTipo");
    lista.forEach(element => {
        const tipo = document.createElement('option');
        input.appendChild(tipo);
        tipo.value = element;
        tipo.textContent = element;
    });
}

function filtrarTabla(contenedor, lista, filtro) {
    let listaFiltrada;
    if (filtro !== "Todos") {
        listaFiltrada = lista.filter((elemento) => elemento.tipo == filtro); 
    } else {
        listaFiltrada = lista;
    }

    actualizarTabla(contenedor, listaFiltrada);
    
    // Calcula y muestra la fuerza mínima y máxima
    calcularFuerzaMinMax(listaFiltrada);

    banderaFiltros = filtro !== "Todos";
    return listaFiltrada;
}

function calcularFuerzaMinMax(lista) {
    const fuerzas = lista.map(monstruo => parseInt(monstruo.miedo));
    
    const fuerzaMin = Math.min(...fuerzas);
    const fuerzaMax = Math.max(...fuerzas);
    
    document.getElementById("fuerzaMin").value = fuerzaMin;
    document.getElementById("fuerzaMax").value = fuerzaMax;
}


function aplicarColumnasSeleccionadas(columnasSeleccionadas) {
    const tabla = document.getElementById('tabla'); 
    const filas = tabla.querySelectorAll('tr'); 

    
    filas.forEach((fila) => {
        const celdas = fila.querySelectorAll('td'); 

        
        celdas.forEach((celda, index) => {
            if (columnasSeleccionadas.includes(index)) {
                celda.style.display = ''; // Muestra la celda
            } else {
                celda.style.display = 'none'; // Oculta la celda
            }
        });
    });
}


window.addEventListener('load', () => {    
    let listaColumnasSeleccionadas = obtenerColumnasSeleccionadas();
    
    aplicarColumnasSeleccionadas(listaColumnasSeleccionadas);
   
    console.log('Columnas Seleccionadas:', listaColumnasSeleccionadas);
});


const checkboxes = document.querySelectorAll('.chbox');

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
        const columnasSeleccionadas = obtenerColumnasSeleccionadas();
        aplicarColumnasSeleccionadas(columnasSeleccionadas);
        
        // Llama a guardarColumnasSeleccionadas aquí
        guardarColumnasSeleccionadas(columnasSeleccionadas);
    });
});


function guardarColumnasSeleccionadas(columnasSeleccionadas) {
    localStorage.setItem('columnasSeleccionadas', JSON.stringify(columnasSeleccionadas));
}


function obtenerColumnasSeleccionadas() {
    const columnasGuardadas = localStorage.getItem('columnasSeleccionadas');
    return columnasGuardadas ? JSON.parse(columnasGuardadas) : [];
}



$select.addEventListener("change", () => 
{
    listaFiltrada = filtrarTabla($containerTabla, lista, $select.value);
    checkbox.forEach(element => {element.checked = true;});
    limpiarForm();
});

function obtenerColumnasOrdenadas() {
    const columnas = document.querySelectorAll('.ths');
    const columnasOrdenadas = Array.from(columnas).map((columna) => parseInt(columna.dataset.index));
    return columnasOrdenadas;
}

// CHECKBOXES
const modificarTabla = () => {
    const checked = {};
    checkbox.forEach((elem) => { checked[elem.name] = elem.checked });
    listaColumnasSeleccionadas = obtenerColumnasSeleccionadas();
    listadoDatos = listaFiltrada.map((elem) => {
        const newElement = {};
        for (const key in elem) {
            if (key == "id" || listaColumnasSeleccionadas.includes(key)) {
                newElement[key] = elem[key];
            }
        }
        return newElement;
    });

    // Obtener las columnas seleccionadas y aplicarlas a la tabla
    aplicarColumnasSeleccionadas(listaColumnasSeleccionadas);
    
    // Guardar el listadoDatos en localStorage
    localStorage.setItem('columnasSeleccionadas', JSON.stringify(listaColumnasSeleccionadas));
};
checkbox.forEach((elem) => elem.addEventListener("click", modificarTabla));


