export class Producto {

    id;
    nombre;
    descripcion;
    precio;
    idCategoria;
    foto;
    
    constructor(id, nombre, descripcion, precio, idCategoria, foto, cantidad) {
        this.id = id;
        this.nombre = nombre; 
        this.descripcion = descripcion;
        this.precio = precio;
        this.idCategoria = idCategoria;
        this.foto = foto;

        if (cantidad == null || cantidad == undefined) {
            this.cantidad = 1;
        }
        else {
            this.cantidad = cantidad;
        }
    }
}