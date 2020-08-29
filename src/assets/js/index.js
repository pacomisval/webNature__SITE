//import { setListenerSidebarItems } from './listeners.js';
import { mostrarCarrito, mostrarProductos, mostrarEventos, mostrarBlog, mostrarContactos } from './Carrito/carrito.js';
import { Router } from './Router/router.js';
import { Carrito } from './Carrito/classCarrito.js';
import { Producto } from './Carrito/producto.js';



let imgsCarousel;              // array imagenes carousel de la DB
let categorias;                // array categorias de la DB
let productos;                 // array productos de la DB
let productosPorIdCategoria;   // array productos por categoria de la DB

let productosShoppinCart = [];      // array productos comprados

let nombreCategoria;

let valorNatureT; 

let misCookies = document.cookie;  // String con todas las cookies de esta página

$(window).on("load", function() {

    console.log("COOKIES: ", misCookies);

    if(misCookies) {
        console.log("Hay cookies en miscookies: ", misCookies);
        let boolnatureT = leerCookie("natureT");
        console.log("Existe cookie natureT?: ", boolnatureT);
        if(boolnatureT) {
            // Debe existir la cookie NatureT y eso es que existen productos en el localStorage.
            productosShoppinCart = JSON.parse(localStorage.getItem("carritoPendiente"));
            let carrito = new Carrito(valorNatureT, productosShoppinCart);
            let count = carrito.getTotalUnidadesProductosComprados();
            $(".c-menu__count").text(" (" + parseInt(count) + ")");
        }
        else {
            console.log("No existe la cookie natureT");
            localStorage.removeItem("carritoPendiente");
            crearCookieT();
        }
    }
    else {
        console.log("No existe ninguna cookie");
        localStorage.removeItem("carritoPendiente");
        crearCookieT();
    }
});


var urlActual = window.location;
console.log("Url actual: " + urlActual);

const BASEURL = "http://localhost:8000/";

///////////////////////////// ROUTER ///////////////////////////
const router = new Router();
router.root = 'http://localhost:8088/nature/site';
router.add({name: 'inicio', path: '/', handler: ()=>/* console.log("inicio selected")*/ recargarInicio() });
router.add({name: 'tienda', path: '/tienda', handler: ()=> mostrarProductos() /* console.log('handler to productos') */});
router.add({name: 'eventos', path: '/eventos', handler: ()=> mostrarEventos() /* console.log('handler to eventos') */});
router.add({name: 'blog', path: '/blog', handler: ()=> mostrarBlog() /* console.log('handler to blog') */});
router.add({name: 'contacto', path: '/contacto', handler: ()=> mostrarContactos() /* console.log('handler to contanto') */});
router.add({name: 'carrito', path: '/carrito', handler: ()=> mostrarCarrito()});
// router.add({name: 'minicart', path: '/minicart', handler: ()=> mostrarTablaMinicart()});
router.add({name: 'producto', path: '/productos/:id', handler: (params)=>console.log('handler to product/id: ' + params)});

const activeRoutes = Array.from(document.querySelectorAll('[route]'));
activeRoutes.forEach((route) => route.addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate(e.target.getAttribute('route'))
}, false));

if (window.performance.navigation.type == 1) {
    console.log("has refrescado el navegador");
}

///////////////////////// END ROUTER ///////////////////////////

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
    setListenerMostrarMinicart();

    
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
            class: "c-card__title",
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
            class: "c-card__title",
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
            .attr("src", "assets/images/productos/" + elem.foto)
            .addClass("c-card__image");
        let cardContent = $("<div/>").addClass("c-card__content");
        let cardName = $("<h4/>").addClass("c-card__name").append(elem.nombre);
        let cardPrice = $("<h3/>").addClass("c-card__price").append(elem.precio + " €");
        let cardButton = $("<div/>").addClass("c-card__button");
        let linkButton = $("<a/>")
            .attr("id", elem.id)
            .addClass("c-card__link-add")
            .append("Añadir al carrito");

        cardButton.append(linkButton);
        cardContent.append(cardName);
        cardContent.append(cardPrice);
        componentCard.append(cardImage);
        componentCard.append(cardContent);
        componentCard.append(cardButton);
        columnsArea.append(componentCard);

        $("#cartas").append(columnsArea);
    });
}


function crearCookieT() {
    $.ajax({
        url: BASEURL + "init",
        type: "GET",
        dataType: "json",
		xhrFields: {
			withCredentials: true
		}
    })
    .done(response => {
        console.log("Response crear cookie: " , response);
		if (response != null || response != undefined) {
            console.log("cookie: ", true);
			return true;
		}
		else {
			console.log("cookie: ", false);
			return false;
		}
    })
    .fail(responseError => {
        console.log("Error en comprobar cookie: " , responseError);
    });
}

function leerCookie(cookie) {   
    let cookieEncontrada;
    let valorCookie = "";
    let claveCookie;
    let obtenerPosicionIgual;
    console.log("Valor de mis cookies: ", misCookies);
    

    if(misCookies !== null || misCookies !== undefined) {
        let arrayCookies = misCookies.split(";");

        $.each(arrayCookies, function(index, elem) {
            cookieEncontrada = elem;
            obtenerPosicionIgual = cookieEncontrada.indexOf("=");
            claveCookie = cookieEncontrada.substring(0, obtenerPosicionIgual);
    
            if (claveCookie == cookie) {
                //valorCookie = cookieEncontrada.substring(obtenerPosicionIgual + 1);
                valorCookie = true;
            }
            else {
                //valorCookie = "no se ha encontrado valor de cookie natureT";
                valorCookie = false;
            }
        });
    }

    return valorCookie;
}

// Este método hay que cambiarlo
function recargarInicio() {
    setTimeout(function () {
        window.location.reload();
    }, 200);
    
}

function pushArrayProductos(id) {
    let productoComprado;
    let carrito = new Carrito(valorNatureT, productosShoppinCart);
    $.each(productos, function(index, elem) {
        if(elem.id == id) {
            productoComprado = new Producto(elem.id, elem.nombre, elem.descripcion, elem.precio, elem.idCategoria, elem.foto, elem.cantidad);
            carrito.addProducto(productoComprado);
        }
    });
    let count = carrito.getTotalUnidadesProductosComprados();
    $(".c-menu__count").text(" (" + parseInt(count) + ")");

    let nombre = productoComprado.nombre;
    let precio = productoComprado.precio;
    console.log(nombre);
    console.log(precio);

    return productoComprado;
} 

////////////////////////// LISTENERS //////////////////////////
///////////////////////////////////////////////////////////////
/////////////////////// LISTENER MENU ////////////////////////
function setListenerMenu() {
    $("#contenido-t").on("click", ".c-menu__link", function() {
        let nombreItemMenu = this.childNodes[0].nodeValue;
        console.log("Has seleccionado item menu: ",nombreItemMenu);

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
//////////////////////////////////////////////////////////////////
///////////// LISTENER BOTON AÑADIR PRODUCTO AL CARRITO ////////
function setListenerButtonAddCarrito() {

    $("#contenido-c").on("click", ".c-card__link-add", function() {

        var idProducto = this.id;
        console.log("Producto con id: " + idProducto);

        // Llena el array de productos comprados.
        let carritoPendiente = pushArrayProductos(idProducto);
        console.log("carritoPendiente: ",carritoPendiente);

        guardarCarritoPendienteLocalStorage();
   
    }); 
}
 
//////////// END LISTENER BOTON AÑADIR CARRITO ////////////////
//////////// LISTERNER MOSTRAR MINICART ////////////////////////
function setListenerMostrarMinicart() {
    let count = 0;
    let result;
    let num;
    let num2;

    $('.dropdown').mouseover(function(){
        if (count == 0) {
            if(productosShoppinCart != null) {
                num = productosShoppinCart.length;
                console.log("valor de num: ", num);
            }
            else {
                num = 0;
            }      
            $('.dropdown-menu').hide();
            $(".dropdown-menu").show();
            result = mostrarTablaMinicart(productosShoppinCart);

        }
        else {
            if(productosShoppinCart != null) {
                num2 = productosShoppinCart.length;
                console.log("valor de num2: ", num2);
            }
            else {
                num2 = 0;
            }
            $('.dropdown-menu').hide();
            $(".dropdown-menu").show();
            result;

            $("#contenido-t").on("click", "c-menu__button-link", function() {
                $('.dropdown-menu').hide();
            });
        }
        count ++;
    });
    $('.dropdown').mouseout(function() {
        setTimeout(function() {
            
            $('.dropdown-menu').hide();
        }, 3500);
    });

    
}

///////////// END MOSTRAR MINICART ////////////////////////////

/////////////////////////////////////////////////////////////////
///////////////// END LISTENERS //////////////////////////////
function guardarCarritoPendienteLocalStorage() {
    // Almacena en localStorage el array de productos comprados.
    localStorage.setItem("carritoPendiente", JSON.stringify(productosShoppinCart));

    let carritoDeVuelta = localStorage.getItem("carritoPendiente");
    console.log("valor de carrito de vuelta: ", JSON.parse(carritoDeVuelta));
}

function eliminarCarritoPendienteLocalStorage() {
    localStorage.removeItem("carritoPendiente");
    console.log("He eliminado el carritoPendiente");
}


function mostrarTablaMinicart(productosShoppinCart) {
    let tbody;

    let fila = $("<tr/>");
    let elementoImg = $("<th/>").addClass("c-menu__tbody-title").text("Imagen");
    let elementoNom = $("<th/>").addClass("c-menu__tbody-title").text("Nombre");
    let elementoUni = $("<th/>").addClass("c-menu__tbody-title").text("Unidades");
    let elementoPre = $("<th/>").addClass("c-menu__tbody-title").text("Precio");

    fila.append(elementoImg);
    fila.append(elementoNom);
    fila.append(elementoUni);
    fila.append(elementoPre);

    tbody = $(".c-menu__tbody").append(fila);

    let carrito = new Carrito(valorNatureT, productosShoppinCart);
    let arrayProductosComprados = carrito.getProductosComprados();
    console.log("Productos comprados: ", arrayProductosComprados);

    $.each(arrayProductosComprados, function(index, elem) {
        let fila1 = $("<tr/>");
        let elemImg = $("<td/>");
        let img = $("<img>").attr("src","assets/images/productos/" + elem.foto).attr("style", "width: 70px");
        let elemNom = $("<td/>").text(elem.nombre);
        let elemUni = $("<td/>").addClass("c-menu__tbody-title").text(elem.cantidad);
        let elemPre = $("<td/>").text(elem.precio);

        elemImg.append(img);

        fila1.append(elemImg);
        fila1.append(elemNom);
        fila1.append(elemUni);
        fila1.append(elemPre);

        tbody += $(".c-menu__tbody").append(fila1);
    }); 
    return tbody;
}


function eliminarTablaMinicart() {
    let tabla = "";
    $(".c-menu__tbody").append(tabla);
    console.log("Eliminado tabla minicart: ", tabla);
}


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


export { productosShoppinCart, valorNatureT };










