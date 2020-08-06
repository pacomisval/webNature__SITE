export class Carrito {

    /**
     * 
     * @param {*} userId 
     * @param {*} arrayProductosComprados 
     * Constructor del carrito: Añade el id de usuario propietario y un array de productos comprados.
     */
    constructor(userId, arrayProductosComprados) {
        this.userId = userId;

        if (arrayProductosComprados === null) {
            this.arrayProductosComprados = [];
        }
        else {
            this.arrayProductosComprados = arrayProductosComprados;
        }
    }

    /**
     * @param {*} myJson
     * Método estático que recibe un JSON y pasa sus propiedades a un objeto.
     * Se usará para transformar el objeto de localStorage a un objeto Carrito (sin perder sus métodos)
     */
    static fromJson(myJson) {
        let myObjet = new Carrito();

        Object.assign(myObjet, myJson);

        return myObjet;
    }

    /**
     * 
     * @param {*} producto 
     * Añade un producto al array de productos comprados del carrito.
     */
    addProducto(producto) {
        console.log("addProducto: añadimos este producto " , producto , " a este carrito " , this);
    
        let productoPresente = this.arrayProductosComprados.find(s => parseInt(s.id) == parseInt(producto.id));

        if (productoPresente == null) {
            // Para evitar el bug del drag and drop
            if (producto.cantidad == null) {
                producto.cantidad = 1;
            }
            // productoPresente no esta en el array, así que añadimos el producto al array. 
            this.arrayProductosComprados.push(producto);
            console.log("arrayProductosComprados: ", this.arrayProductosComprados);  
        }
        else {
            // productoPresente si esta en el array, así que aumentamos la cantidad.
            productoPresente.cantidad ++;
            console.log("else --- arrayProductosComprados: ", this.arrayProductosComprados);
        }
    }

    /**
     * 
     * @param {*} idProducto 
     * Elimina un producto del carrito, incluido sus cantidades.
     */
    deleteProducto(idProducto) {
        let indexProducto = this.arrayProductosComprados.findIndex(s => s.id == idProducto);

        if (indexProducto != -1) {
            // El producto esta, así que lo eliminamos totalmente, incluido todas las cantidades.
            this.arrayProductosComprados.splice(indexProducto, 1);
        }
        else {
            console.log("Error en deleteProducto, se ha intentado eliminar un producto que ya no estaba en el array de productos comprados");
        }
    }

    /**
     * 
     * @param {*} idProducto
     * Suma 1 unidad a un producto dentro del array de productos comprados 
     */
    plusProducto(idProducto) {
        let indexProducto = this.arrayProductosComprados.findIndex(s => s.id == idProducto);

        if (indexProducto != -1) {
            // El producto esta, así que le sumamos 1 a su atributo cantidad.
            if (this.arrayProductosComprados[indexProducto].cantidad < 100) {
                this.arrayProductosComprados[indexProducto].cantidad ++;
            }
            else {
                console.log("Has superado el limite de compra de 100 unidades del mismo producto");
            }
        }
        else {
            console.log("Error en plusProducto, se ha intentado sumar un producto que no esta en el array de productos comprados");
        }
    }

    /**
     * 
     * @param {*} idProducto
     * Resta 1 unidad a un producto dentro del array de productos comprados 
     */
    lessProducto(idProducto) {
        let indexProducto = this.arrayProductosComprados.findIndex(s => s.id == idProducto);
        // El producto esta, así que le restamos 1 a su atributo cantidad.
        if (indexProducto != -1) {

            if (this.arrayProductosComprados[indexProducto].cantidad > 1) {
                this.arrayProductosComprados[indexProducto].cantidad --;
            }
            else {
                this.deleteProducto(idProducto);
            }
        }
        else {
            console.log("Error en lessProducto, se ha intentado restar una unidad a un producto que no esta en el array de productos comprados");
        }
    }

    getProductosComprados() {
        return this.arrayProductosComprados;
    }

    getTotalUnidadesProductosComprados() {
        let unidades = 0;

        $.each(this.arrayProductosComprados, (index, elem) => {
            unidades = parseInt(unidades + elem.cantidad);
        });

        return unidades;
    }

    getValorProducto(id) {
        let total = 0;
         
        $.each(this.arrayProductosComprados, (index, elem) => {
            if(elem.id == id) {
                total = (elem.precio * elem.cantidad);
            }    
        });
        total = parseFloat(Math.trunc(total * 100) / 100);
        return total.toFixed(2);
    }

    getSubTotal() {
        let subTotal = 0;
        let total = 0;
        $.each(this.arrayProductosComprados, (index, elem) => {
            total = (elem.precio * elem.cantidad);
            subTotal += total;
            total = 0;
        });
        subTotal = parseFloat(Math.trunc(subTotal * 100) / 100);
        return subTotal.toFixed(2);
    }

    getValorTax() {
        let sumaPrecioProductos = 0;
        let sumaTax = 0;
        let tax = 0.21;

        $.each(this.arrayProductosComprados, (index, elem) => {
            sumaPrecioProductos = sumaPrecioProductos + (elem.precio * elem.cantidad);
        });
    
        sumaTax = parseFloat(sumaPrecioProductos * tax);
        sumaTax = parseFloat(Math.trunc(sumaTax * 100) / 100);
        return sumaTax.toFixed(2);
    }

    getValorTransporte() {   
        let sumaPrecioProductos = 0;
        let tax = 0.21;
        let sumaTax = 0;   
        let transporte;
        let precioTotal = 0;

        $.each(this.arrayProductosComprados, (index, elem) => {
            sumaPrecioProductos = sumaPrecioProductos + (elem.precio * elem.cantidad);
        });

        sumaTax = parseFloat(sumaPrecioProductos * tax);
        precioTotal = parseFloat(sumaPrecioProductos + sumaTax);

        if(precioTotal >= 100) {
            transporte = 0;
        }
        else {
            transporte = 12;
        }

        return transporte;
    }

    getValorTotaCompra() {
        let precioTotal = 0;
        let sumaPrecioProductos = 0;
        let sumaTax = 0;
        let tax = 0.21;
        let transporte = 12;

        $.each(this.arrayProductosComprados, (index, elem) => {
            sumaPrecioProductos = sumaPrecioProductos + (elem.precio * elem.cantidad);
        });
        sumaTax = parseFloat(sumaPrecioProductos * tax);
        precioTotal = parseFloat(sumaPrecioProductos + sumaTax + transporte);

        if(precioTotal >= 112) {
            precioTotal = precioTotal - transporte;
        }
        else {
            precioTotal = precioTotal;
        }

        precioTotal = parseFloat(Math.trunc(precioTotal * 100) / 100);
        return precioTotal.toFixed(2);
    }

    actualizarProductosShoppingCart(id, valor) {
        
        $.each(this.arrayProductosComprados, (index, elem) => {
            if(elem.id == id) {
                elem.cantidad = valor;
                console.log("valor de elem.id: ", elem.id + " ,elem.nombre: " + elem.nombre + " ,elem.cantidad: " + elem.cantidad );
            }
        });
        //this.actualizaTotales(id);       
    }

    actualizaTotales(id) {
        this.getValorProducto(id);
        this.getSubTotal();
        this.getValorTax();
        this.getValorTransporte();
        this.getValorTotaCompra();
    }

    clearArrayProductosComprados() {
        this.arrayProductosComprados = [];
        console.log("Array de productos comprados vacio: ", this);
    }
}