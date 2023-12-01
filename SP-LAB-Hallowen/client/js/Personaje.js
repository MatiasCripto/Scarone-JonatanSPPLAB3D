export class Personaje 
{
    constructor(id, nombre, tipo) 
    {
        try 
        {
            this.id = id;
            this.nombre = nombre;
            this.tipo = tipo;
        }
        catch(ex) 
        {
            throw ex;
        }
    }
}