$(document).ready(() => {

    repartirCartas()

    let fondo = new Audio("./mp3/fondo.mp3")
    fondo.loop= true
    fondo.volume =0.3;
    
    let sonidoCorrecto = new Audio("./mp3/correcto.mp3")
    sonidoCorrecto.volume= 1;
    let sonidoError = new Audio("./mp3/error.mp3")
    sonidoError.volume=1;

    let sonidoVictoria = new Audio("./mp3/victoria.mp3")
    sonidoVictoria.volume=0.5;

    let tiempoStorage = localStorage.getItem("tiempRec")

    let puntuacion = 0;

    let contadorVolteadas = 0;

    let carta1 = "";
    let carta2 = "";

    let tiempoActual = []

    let timerInterval="";

    if(tiempoStorage==undefined){
        $("#tiempoRecord").text("00")
    }else{
        try {
            record = JSON.parse(tiempoStorage)
            $("#tiempoRecord").text(record.minutos+ "m:"+record.segundos+"s")
           
        } catch (e) {
            $("#tiempoRecord").text("00")
        }
    }

    $('#staticBackdrop').modal('show');

    $("#btniniciar").click(function () {
        comenzarJuego();
    })




    $(".cartacontenedor").click(function () {



        if ($(this).hasClass("volteado")) {
            // $(this).css({transform: `rotateY(0deg)`})

        } else {
            if ($(this).hasClass("enanimasion")) {

            } else {
                if (!$(this).hasClass("correcta")) {

                    $(this).toggleClass("volteado")
                    contadorVolteadas += 1;
                    $(this).css({ transform: `rotateY(-180deg)` });

                    if (carta1 == "") {
                        carta1 = $(this).find("div:eq(1)").find("img").attr(`src`)

                    } else {
                        carta2 = $(this).find("div:eq(1)").find("img").attr(`src`)
                    }
                }
            }


        }



        if (contadorVolteadas == 2 && !$(".cartacontenedor").hasClass("enanimasion")) {
            $(".cartacontenedor").toggleClass("enanimasion");

            $(".volteado").animate({ borderWidth: "1px" }, "slow")
                .promise().then(function () {
                    if (carta1 == carta2) {
                        $(".cartacontenedor").removeClass("enanimasion")
                        $(".volteado").toggleClass("correcta")
                        $(".volteado").toggleClass("volteado")
                        sonidoCorrecto.play()
                        animacionAcertaste();
                        puntuacion++;
                        cambiarPuntuacion(puntuacion);
                        contadorVolteadas = 0;
                        carta1 = ""
                        carta2 = ""

                    } else {
                        animacionFallastes()
                        $(this).animate({ borderWidth: "0px" }, 1500)
                            .promise().then(function () {
                                sonidoError.play()
                                $(".volteado").css({ transform: `rotateY(0deg)` });
                                $(".volteado").toggleClass("volteado")
                                $(".cartacontenedor").removeClass("enanimasion")
                                contadorVolteadas = 0;
                                carta1 = ""
                                carta2 = ""

                            })
                    }

                });

        }

        function cambiarPuntuacion(p) {
            
        
            $("#puntos").text(p);
        
            if (p == 8) {
                terminarJuego()
            }
        
        }

        function terminarJuego() {
            fondo.pause()
            sonidoVictoria.play()
            
            clearInterval(timerInterval);
            let t ={
                
                "horas":tiempoActual[0],
                "minutos":tiempoActual[1],
                "segundos":tiempoActual[2],
                
            }
            
            if(tiempoStorage==undefined){
                $("#tiempoRecord").text(t.minutos+ "m:"+t.segundos+"s")
                localStorage.setItem("tiempRec",JSON.stringify(t))     
            }
            
            record = JSON.parse(tiempoStorage)
            
            if((t.horas+t.minutos+t.segundos)<(record.horas+record.minutos+record.segundos)){
                
                $("#tiempoRecord").text(t.minutos+ "m:"+t.segundos+"s")
                localStorage.setItem("tiempRec",JSON.stringify(t))
                
            }
            
            $('#staticBackdrop2').modal('show');
            
        }

    


    })



    startTimer = () => {
        clearInterval(timerInterval);
    
        let segundos= 0,
            minutos = 0,
            horas = 0;
    
        
        timerInterval = setInterval(function () {
           
            
            $("#timer").html((horas ? horas + ':' : '') +
            (minutos < 10 ? '0' + minutos : minutos) +
            ':' +
            (segundos < 10 ? '0' + segundos : segundos))
           
            segundos++;
    
           
            if (segundos == 60) {
                
                minutos++;
                segundos  = 0;
            }
    
            if (minutos == 60) {
                horas++;
                minutos = 0;
            }
            

            tiempoActual[0] = horas
            tiempoActual[1] = minutos
            tiempoActual[2] = segundos
            
        }, 1000);
       
    };
    
    function comenzarJuego() {
        fondo.play()
        startTimer()
    
    }



})


function repartirCartas() {
    let usadas = [];
    let x = 0;

    for (let i = 0; i < nomCart.length; i++) {
        let valido = false;
        while ((valido == false)) {

            x = Math.round(Math.random() * 15)

            for (let o = 0; o < nomCart.length; o++) {

                if (x == usadas[o]) {
                    valido = false;
                    o = 16

                } else {
                    valido = true;

                }

            }

        };
        $(nomCart[i].id).attr("src", imgCartas[x].src);
        usadas.push(x)

    }

}

function animacionAcertaste() {
    $("#correcto").animate({ opacity: "1", fontSize: "60px" }, 1000, function () {
        $(this).css("color", "yellow");
    });

    $("#correcto").animate({ opacity: "0", fontSize: "40px" }, 1000, function () {
        $(this).css("color", "white");
    });
}

function animacionFallastes() {
    $("#incorrecto").animate({ opacity: "1", fontSize: "60px" }, 1000, function () {
        $(this).css("color", "black");
    });

    $("#incorrecto").animate({ opacity: "0", fontSize: "40px" }, 1000, function () {
        $(this).css("color", "white");
    });

}











