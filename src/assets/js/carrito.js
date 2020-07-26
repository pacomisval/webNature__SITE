
import { productosShoppinCart } from './index.js';

let sumaProductos = 0;

function mostrarCarrito() {
    $("#contenido-r").empty();
    $("#contenido-l").empty();
    $("#contenido-c").empty();

    let sectionCarrito = $("<div/>").addClass("section-carrito");
    let carritoTitle = $("<div/>").addClass("carrito__title");
    let contenidocarrito = $("<h1/>", {
        class: "c-sidebar__title",
        text: "CARRITO DE LA COMPRA"
    });
    
    carritoTitle.append(contenidocarrito);
    sectionCarrito.append(carritoTitle);

    let columnLabels = $("<div/>").addClass("column-labels");
    let pImage = $("<label/>").addClass("product-image").text("Image");
    let pDetalle = $("<label/>").addClass("product-details").text("Producto");
    let pPrecio = $("<label/>").addClass("product-price").text("Precio");
    let pCantidad = $("<label/>").addClass("product-quantity").text("Cantidad");
    let pEliminar = $("<label/>").addClass("product-removal").text("Eliminar");
    let pTotal = $("<label/>").addClass("product-line-price").text("Total");
    columnLabels.append(pImage);
    columnLabels.append(pDetalle);
    columnLabels.append(pPrecio);
    columnLabels.append(pCantidad);
    columnLabels.append(pEliminar);
    columnLabels.append(pTotal);
    sectionCarrito.append(columnLabels);

    // Todo esto va dentro de un bucle for
    $.each(productosShoppinCart, function(index, elem) {

        let auxPrecio = parseFloat(elem.precio);
        let auxCantidad = isNaN(parseInt(elem.cantidad));
        console.log(auxPrecio);
        console.log(auxCantidad);
        
        sumaProductos = sumaProductos + parseFloat(auxPrecio * 1);

        let producto = $("<div/>").addClass("product");

        let prImage = $("<div/>").addClass("product-image");
        let imagePrImage = $("<img>").attr("src","assets/images/productos/" + elem.foto).attr("style", "width: 100px");
        prImage.append(imagePrImage);
    
        let prDetalle = $("<div/>").addClass("product-details");
        let titlePrDetalle = $("<div/>").addClass("product-title").text(elem.nombre);
        let descripcionPrDetalle = $("<p/>").addClass("product-description").text(elem.descripcion);
        prDetalle.append(titlePrDetalle);
        prDetalle.append(descripcionPrDetalle);
    
        let prPrecio = $("<div/>").addClass("product-price").text(elem.precio);
    
        let prCantidad = $("<div/>").addClass("product-quantity");
        let inputPrCantidad = $("<input>")
            .attr("type", "number")
            .attr("value", "1")
            .attr("min", "1")
            .attr("style","width: 50px");
        prCantidad.append(inputPrCantidad);
        
        let prEliminar = $("<div/>").addClass("product-removal");
        let botonPrEliminar = $("<button/>").addClass("remove-product");
        let iconoPrEliminar = $("<i/>").addClass("fas fa-trash-alt");
        botonPrEliminar.append(iconoPrEliminar);
        prEliminar.append(botonPrEliminar);
    
        let prTotal = $("<div/>").addClass("product-line-price").text(elem.precio);
    
        producto.append(prImage);
        producto.append(prDetalle);
        producto.append(prPrecio);
        producto.append(prCantidad);
        producto.append(prEliminar);
        producto.append(prTotal);
    
        sectionCarrito.append(producto);

    });
    
    // Hasta aqui el bucle for

    let valorTax = 0.08;
    let valorTransporte = 12;
    let valorTotal = parseFloat(sumaProductos + valorTax + valorTransporte);
    valorTotal = Math.trunc(valorTotal * 100) / 100; // esta linea formatea valorTotal a 2 decimales.

    let total = $("<div/>").addClass("totals");

    let totalItemSub = $("<div/>").addClass("totals-item");
    let labelSub = $("<label/>").addClass("totals-label").text("Subtotal");
    let valueSub = $("<div/>").addClass("totals-value").attr("id", "cart-subtotal").text(sumaProductos);
    totalItemSub.append(labelSub);
    totalItemSub.append(valueSub);

    let totalItemTax = $("<div/>").addClass("totals-item");
    let labelTax = $("<label/>").addClass("totals-label").text("Tax (21%)");
    let valueTax = $("<div/>").addClass("totals-value").attr("id", "cart-tax").text(valorTax);
    totalItemTax.append(labelTax);
    totalItemTax.append(valueTax);

    let totalItemTransporte = $("<div/>").addClass("totals-item");
    let labelTransporte = $("<label/>").addClass("totals-label").text("Gastos envio");
    let valueTransporte = $("<div/>").addClass("totals-value").attr("id", "cart-shipping").text(valorTransporte);
    totalItemTransporte.append(labelTransporte);
    totalItemTransporte.append(valueTransporte);

    let totalItemCompra = $("<div/>").addClass("totals-item").addClass("totals-item-total");
    let labelCompra = $("<label/>").addClass("totals-label").text("Valor Total");
    let valueCompra = $("<div/>").addClass("totals-value").attr("id", "cart-total").text(valorTotal);
    totalItemCompra.append(labelCompra);
    totalItemCompra.append(valueCompra);
    
    total.append(totalItemSub);
    total.append(totalItemTax);
    total.append(totalItemTransporte);
    total.append(totalItemCompra);

    sectionCarrito.append(total);

    let botonSeguirComprando = $("<button/>").addClass("seguirComprando");
    let iconSeguirComprando = $("<i/>").addClass("fas fa-shopping-cart").text(" Seguir comprando");
    botonSeguirComprando.append(iconSeguirComprando);

    let botonCheckout = $("<button/>").addClass("checkout").text("Checkout  ");
    let iconCheckout = $("<i/>").addClass("fas fa-play");
    botonCheckout.append(iconCheckout);

    sectionCarrito.append(botonSeguirComprando);
    sectionCarrito.append(botonCheckout);
    $("#contenido-r").append(sectionCarrito);
}

function mostrarProductos() {
    
    $("#contenido-r").empty();
    $("#contenido-l").empty();
    $("#contenido-c").empty();

    console.log("Estas en mostrarProductos");
    alert("Estas en mostrarProductos");
}

function mostrarEventos() {
    
    $("#contenido-r").empty();
    $("#contenido-l").empty();
    $("#contenido-c").empty();

    console.log("Estas en mostrarEventos");
    alert("Estas en mostrarEventos");
}

function mostrarBlog() {
    
    $("#contenido-r").empty();
    $("#contenido-l").empty();
    $("#contenido-c").empty();

    console.log("Estas en mostrarBlog");
    alert("Estas en mostrarBlog");
}

function mostrarContactos() {
    
    $("#contenido-r").empty();
    $("#contenido-l").empty();
    $("#contenido-c").empty();

    console.log("Estas en mostrarContactos");
    alert("Estas en mostrarContactos");
}

export { mostrarCarrito, mostrarProductos, mostrarEventos, mostrarBlog, mostrarContactos };









