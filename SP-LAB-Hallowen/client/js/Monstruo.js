import {Personaje} from "./Personaje.js";

export class Monstruo extends Personaje 
{
    constructor(id, nombre, tipo, alias, miedo, defensa,) 
    {
        try 
        {
            super(id, nombre, tipo);
            this.alias = alias;
            this.miedo = miedo;
            this.defensa = defensa;
        } 
        catch (ex) 
        {
            throw ex;
        }
    }
}
