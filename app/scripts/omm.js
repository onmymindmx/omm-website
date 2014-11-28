$(document).ready(function () {
    'use strict';
    Ymbb.init();
    /* fix vertical when not overflow
    call fullscreenFix() if .fullscreen content changes */
    function fullscreenFix(){
        var h = $('body').height();
        // set .fullscreen height
        $(".content-b").each(function(i){
            if($(this).innerHeight() <= h){
                $(this).closest(".fullscreen").addClass("not-overflow");
            }
        });
    }
    $(window).resize(fullscreenFix);
    fullscreenFix();

    /* resize background images */
    function backgroundResize(){
        var windowH = $(window).height();
        $(".background").each(function(i){
            var path = $(this);
            // variables
            var contW = path.width();
            var contH = path.height();
            var imgW = path.attr("data-img-width");
            var imgH = path.attr("data-img-height");
            var ratio = imgW / imgH;
            // overflowing difference
            var diff = parseFloat(path.attr("data-diff"));
            diff = diff ? diff : 0;
            // remaining height to have fullscreen image only on parallax
            var remainingH = 0;
            if(path.hasClass("parallax")){
                var maxH = contH > windowH ? contH : windowH;
                remainingH = windowH - contH;
            }
            // set img values depending on cont
            imgH = contH + remainingH + diff;
            imgW = imgH * ratio;
            // fix when too large
            if(contW > imgW){
                imgW = contW;
                imgH = imgW / ratio;
            }
            //
            path.data("resized-imgW", imgW);
            path.data("resized-imgH", imgH);
            path.css("background-size", imgW + "px " + imgH + "px");
        });
    }
    $(window).resize(backgroundResize);
    $(window).focus(backgroundResize);
    backgroundResize();

    // scrollTo
    $("#go-to-services").click(function(){
        $.scrollTo($("#services"), 800, {offset: {top: -51}});
    });

    $("#go-to-us").click(function(){
        $.scrollTo($("#nosotros"), 800, {offset: {top: -51}});
    });

    $("#go-to-portfolio").click(function(){
        $.scrollTo($("#portafolio"), 800, {offset: {top: -51}});
    });

    $("#go-to-contact").click(function(){
        $.scrollTo($("#contacto"), 800, {offset: {top: -51}});
    });

    // Menu
    $("#secciones").on("click", "a", null, function () {
        if($("#secciones").hasClass("in")){
            $("#secciones").collapse('hide');
        }
    }); 

    // Cursor
    $(".navbar-right")
        .mouseenter(function(){
            $("body").css({"cursor":"pointer"});
        })
        .mouseleave(function(){
            $("body").css({"cursor":"default"});
        });

    $('.carousel').carousel();

    // Send mail
    $("#forma-contacto").on('submit', function(e){
        // Obtenemos los datos
        var nombre = $("#nombre").val(),
            apellidos = $("#apellidos").val(),
            email = $('#email').val(),
            empresa = $('#empresa').val(),
            mensaje = $('#mensaje').val();
        // Create a modal view class
        var Modal = Backbone.Modal.extend({
            template: _.template($('#modal-template').html()),
            cancelEl: '.bbm-button'
        });

        if(empresa.length > 1){
            mensaje = "Empresa del contacto: " + empresa + "</br>" + mensaje;
        }

        $.ajax({
            type: "POST",
            url: "https://mandrillapp.com/api/1.0/messages/send.json",
            data: {
                'key': 'sdN9qnxgZMdbSJSMoa3KSA',
                'message': {
                    'from_email': email,
                    'from_name': nombre + ' '+ apellidos,
                    'to': [{
                        'email': 'hola@onmymind.com.mx',
                        'type': 'to'
                    }],
                    'autotext': 'true',
                    'subject': 'Contacto',
                    'html': mensaje
                }
            }
        }).done(function(response){
            if(response[0].status === "sent"){
                // Render an instance of the modal
                var modalView = new Modal();
                $('#mensaje_enviado').html(modalView.render().el);
                nombre = $("#nombre").val('');
                apellidos = $("#apellidos").val('');
                email = $('#email').val('');
                empresa = $('#empresa').val('');
                mensaje = $('#mensaje').val('');
            }
        });
        e.preventDefault();
    })
});