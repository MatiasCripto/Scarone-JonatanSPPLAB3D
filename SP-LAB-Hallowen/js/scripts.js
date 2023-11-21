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
const lista = await getAnunciosAjax(); 
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
                    txtAlias.value,
                    parseInt(txtMiedo.value),
                    rdoDefensa.value,
                    txtTipo.value
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
        document.getElementById("btnGuardar").disabled = true;
       
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
    document.getElementById("btnCancelar").style.display = "none";
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

function filtrarTabla(contenedor, lista, filtro)
{
    if(filtro != "Todos")
    {
        let listaFiltrada = lista.filter((elemento)=>elemento.defensa == filtro); // FILTRO
        actualizarTabla(contenedor, listaFiltrada);
        banderaFiltros = true;
        return listaFiltrada;
    }
    else
    {
        actualizarTabla(contenedor, lista);
        banderaFiltros = false;
        return lista;
    }
}

$select.addEventListener("change", () => 
{
    listaFiltrada = filtrarTabla($containerTabla, lista, $select.value);
    checkbox.forEach(element => {element.checked = true;});
    limpiarForm();
});

// CHECKBOXES
const modificarTabla = () =>
{
    const checked = {};
    checkbox.forEach((elem) => {checked[elem.name] = elem.checked});
    listadoCheck = listaFiltrada.map((elem) => // MAPEO
    {
        const newElement = {};
        for (const key in elem)
        {
            if(key == "id" || checked[key] == true)
            {
                newElement[key] = elem[key];
            }
        }
        return newElement;
    });
    actualizarTabla($containerTabla, listadoCheck);
};

checkbox.forEach((elem) => elem.addEventListener("click", modificarTabla));

