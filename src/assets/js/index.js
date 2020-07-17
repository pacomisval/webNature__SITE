//import { setListenerSidebarItems } from './listeners.js';

let imgsCarousel;              // array imagenes carousel
let categorias;                // array categorias
let productos;                 // array productos
let productosPorIdCategoria;   // array productos por categoria

let nombreCategoria;

var urlActual = window.location;
console.log(urlActual);

const BASEURL = "http://localhost:8000/";

let peticionCarousel = $.ajax({
    url: BASEURL + "carousel",
    method: "GET",
    dataType: "json"
});

let peticionCategorias = $.ajax({
    url: BASEURL + "categorias",
    method: "GET",
    dataType: "json"
});

let peticionProductos = $.ajax({
    url: BASEURL + "productos",
    method: "GET",
    dataType: "json"
});

$(function() {
    $.when(peticionCarousel, peticionCategorias, peticionProductos)
        .done(function (resCarousel, resCategoria, resProductos) {

            imgsCarousel = resCarousel[0];
            console.log(imgsCarousel);
            categorias = resCategoria[0];
            console.log(categorias);
            productos = resProductos[0];
            console.log(productos);

            let categoriasReady = false;
            let carouselReady = false;
            let productosReady = false;

            if (categorias != null && categorias != undefined) {
                categoriasReady = true;
                console.log("Aprobado condicional categorias");
            }
            else {
                mostrarErrorByJson(categorias);
            }

            if (imgsCarousel != null && imgsCarousel != undefined) {
                carouselReady = true;
                console.log("Aprobado condicional carousel");
            }
            else {
                mostrarErrorByJson(imgsCarousel);
            }

            if (productos != null && productos != undefined) {
                productosReady = true;
                console.log("Aprobado condicional productos");
            }
            else {
                mostrarErrorByJson(productos);
            }
 
            if (categoriasReady && carouselReady && productosReady) {
                cargarPaginaInicio();
            }

        })
        .fail(function (xhr) {
            console.log("Error del servidor: " + xhr.status + "(" + xhr.statusText + ")");
            console.log("Más información: ", xhr);
        });
});

function mostrarErrorByJson(json) {
    console.log("Error al obtener las datos: " + json.status + "(" + json.code + "). Comprueba si hay datos en la DB");
    console.log("Más información: ", json); 
}

function cargarPaginaInicio() {
    cargarCarousel();
    cargarCategorias();
    cargarProductos(nombreCategoria);

    setListenerSidebarItems();
    setListenerMenu();
    setListenerButtonAddCarrito();
}

function cargarCarousel() {
    let section = $('<div/>').addClass('c-section c-section--light c-section--padding-vertical-xl c-section--padding-horiazontal-xs');
    let sectionContent = $('<div/>').addClass('c-section__content');
    let carouselContainer = $('<div/>').addClass('carousel slide').attr({
        id: 'carouselExampleCaptions',
        'data-ride': 'carousel'
    });
    let ol = $('<ol/>').addClass('carousel-indicators');
    let carouselInner = $('<div/>').addClass('carousel-inner');
    let aPrev = $('<a/>')
        .addClass('carousel-control-prev')
        .attr({
            href: '#carouselExampleCaptions',
            role: 'button',
            'data-slide': 'prev'
        });
    let spanPrevIcon = $('<span/>')
        .addClass('carousel-control-prev-icon')
        .attr('aria-hidden', 'true');
    let spanPrevOnly = $('<span/>')
        .addClass('sr-only')
        .text('Previous');
    let aNext = $('<a/>')
        .addClass('carousel-control-next')
        .attr({
            href: '#carouselExampleCaptions',
            role: 'button',
            "data-slide": 'next'
        });
    let spanNextIcon = $('<span/>')
        .addClass('carousel-control-next-icon')
        .attr('aria-hidden', 'true');
    let spanNextOnly = $('<span/>')
        .addClass('sr-only')
        .text('Next');

    aPrev.append(spanPrevOnly);
    aPrev.append(spanPrevIcon);
    aNext.append(spanNextOnly);
    aNext.append(spanNextIcon);
    carouselContainer.append(aPrev);
    carouselContainer.append(aNext);
    carouselContainer.append(carouselInner);
    carouselContainer.append(ol);
    sectionContent.append(carouselContainer);
    section.append(sectionContent);

    $("#contenido-r").append(section);
    getImgCarousel();

    $('.carousel').carousel({
        'data-pause': false,
        interval: 5000
    });   
}

function getImgCarousel() {
    let caroInner = $('.carousel-inner');
    let caroIndicators = $('.carousel-indicators');
    var contador = 1;

    $.each(imgsCarousel, function(index, elem) {
        if (index === 0) {
            caroIndicators.append(
                '<li data-target="#carouselExampleCaptions" data-slide-to="0" class="active"></li>'
            );
            caroInner.append(
                '<div class="carousel-item active">' +
                "<img src='assets/images/carousel/" + elem.imagen +
                '\' class="d-block w-100">' +
                '<div class="carousel-caption d-none d-md-block">' +
                '<h1>' +
                elem.nombre +
                '</h1>' +
                '<h4>' +
                elem.descripcion +
                '</h4>' +
                '</div>' +
                '</div>'
            );
        }
        else {
            caroIndicators.append(
                '<li data-target="#carouselExampleCaptions" data-slide-to="' + contador + '"></li>'
            );
            caroInner.append(
                '<div class="carousel-item">' +
                "<img src='assets/images/carousel/" + elem.imagen +
                '\' class="d-block w-100">' +
                '<div class="carousel-caption d-none d-md-block">' +
                '<h1>' +
                elem.nombre +
                '</h1>' +
                '<h4>' +
                elem.descripcion +
                '</h4>' +
                '</div>' +
                '</div>'
            );
            contador += 1;
        }
    });
}

function cargarCategorias() {
    let sidebarTitle = $("<h1/>", {
        class: "c-sidebar__title",
        text: "CATEGORÍAS"
    })
    $("#contenido-l").append(sidebarTitle);

    $.each(categorias, function (index, categoria) {
        let item = $("<div/>", {
            class: "c-sidebar__item",
            id: "cat-" + categoria.id, 
            text: categoria.nombre
        });  
        $("#contenido-l").append(item);
    });
}

function cargarProductos(nombreCategoria) {
    let num = 0;
    let categoriaName = nombreCategoria;
    let categoriaDefault = "TODOS LOS PRODUCTOS";

    $("#contenido-c").empty();

    if (nombreCategoria != null || nombreCategoria != undefined) {
        let contenidoWeb = $("<h1/>", {
            class: "c-sidebar__title",
            text: categoriaName.toUpperCase()
        });
        $("#contenido-c").append(contenidoWeb);

        if (nombreCategoria == "Todos los productos") {
            num = 1; // Si tiene asignado especificamente este nombre, pasamos un 1.
        }
        else {
            num = 2; // Si tiene asignado un nombreCategoria, pasamos un 2.
        }   
    }
    else {
        let contenidoWeb = $("<h1/>", {
            class: "c-sidebar__title",
            text: categoriaDefault.toUpperCase()
        });
        $("#contenido-c").append(contenidoWeb);
        num = 1; // Si no tiene asignado un nombreCategoria, pasamos un 1.
    }

    let lColumns = $("<div/>")
        .addClass("l-columns")
        .attr("id", "l-columns-contenido");

    let lColumnsArea = $("<div/>").addClass("l-columns__area");
    let section = $("<div/>").addClass("c-section c-section--light c-section--padding-vertical-xxl c-section--padding-horizontal-m c-section--padding-horizontal-s@movil c-section--padding-vertical-l@movil");
    let sectionContent = $("<div/>").addClass("c-section__content");
    let lColumnsCartas = $("<div/>")
        .addClass("l-columns l-columns--3-columns l-columns--2-columns l-columns--1-columns@movil")
        .attr("id", "cartas");

    sectionContent.append(lColumnsCartas);
    section.append(sectionContent);
    lColumnsArea.append(section);
    lColumns.append(lColumnsArea);
    $("#contenido-c").append(lColumns);

    cargarCartasProductos(num);
}

function cargarCartasProductos(num) {
    let listaProductos;

    switch(num) {
        case 1:
            listaProductos = productos;
        break;
        case 2:
            listaProductos = productosPorIdCategoria;
        break;
        default: console.log("Error en switch listaProductos");
    }

    $.each(listaProductos, function(index, elem) {
        let columnsArea = $("<div/>").addClass("l-columns__area");
        let componentCard = $("<div>")
            .attr("id", "c-card")
            .addClass("c-card");
        let cardImage = $("<img>")
            .attr("src", "assets/images/productos60/" + elem.foto)
            .addClass("c-card__image");
        let cardContent = $("<div/>").addClass("c-card__content");
        let cardTitle = $("<h4/>").addClass("c-card__title").append(elem.nombre);
        let cardPrice = $("<h2/>").addClass("c-card__price").append(elem.precio + " €");
        let cardButton = $("<div/>").addClass("c-card__button");
        let linkButton = $("<a/>")
            .attr("id", elem.id)
            .addClass("c-card__link-add")
            .append("Añadir al carrito");

        cardButton.append(linkButton);
        cardContent.append(cardTitle);
        cardContent.append(cardPrice);
        componentCard.append(cardImage);
        componentCard.append(cardContent);
        componentCard.append(cardButton);
        columnsArea.append(componentCard);

        $("#cartas").append(columnsArea);
    });
}

function getDatosProducto(id) {
    let productoComprado;
    $.each(productos, function(index, elem) {
        if(elem.id == id) {
            productoComprado = elem;
            //console.log(productoComprado);
        }
    });
    let nombre = productoComprado.nombre;
    let precio = productoComprado.precio;
    console.log(nombre);
    console.log(precio);
} 

////////////////////////// LISTENERS //////////////////////////
///////////////////////////////////////////////////////////////
/////////////////////// LISTENER MENU ////////////////////////
function setListenerMenu() {
    $("#contenido-t").on("click", ".c-menu__link", function() {
        let nombreItemMenu = this.childNodes[0].nodeValue;
        console.log(elementoMenu);
        
        // Carga el elemento de menu seleccionado
        menuSelected(nombreItemMenu);
    });
}

///////////////////// END LISTENER MENU ///////////////////////
////////////////////// LISTENER CATEGORIAS ///////////////////
function setListenerSidebarItems() {
    $("#contenido-l").on("click", ".c-sidebar__item", function() {
        //$(".c-menu__option--selected").removeClass("c-menu__option--selected");

        let idCategoria = this.id.split("-");
        console.log("Has hecho click en la categoria " + idCategoria[1]);
        
        nombreCategoria = this.childNodes[0].nodeValue;
        console.log(nombreCategoria);

        // Obtiene los datos de los productos por categoria seleccionada.
        productosByIdCategoria(idCategoria[1], nombreCategoria);
    });
}

//////////////////// END LISTENER CATEGORIAS //////////////////
/////////////// LISTENER BOTON AÑADIR CARRITO //////////////////
function setListenerButtonAddCarrito() {
    $("#contenido-c").on("click", ".c-card__link-add", function() {
        var idProducto = this.id;
        console.log("Producto con id: " + idProducto);

        // Obtiene los datos del producto, como nombre, precio, etc... .
        getDatosProducto(idProducto);
    }); 
}

//////////// END LISTENER BOTON AÑADIR CARRITO ////////////////
/////////////////// LISTENER //////////////////////////////////



//////////////////// END LISTENER ////////////////////////////

///////////////////////////////////////////////////////////////
///////////////// END LISTENERS //////////////////////////////

function productosByIdCategoria(idCategoria, nombreCategoria) {
    
    $.ajax({
        url: BASEURL + "productos/categoria/" + idCategoria,
        type: "GET",
        dataType: "json"
    })
    .done(response => {
        productosPorIdCategoria = response;
        console.log(productosPorIdCategoria);

        cargarProductos(nombreCategoria);  
    })
    .fail(errorResponse => {
        console.log("Error en la peticion de productos por categoria " + errorResponse);
    });
}














