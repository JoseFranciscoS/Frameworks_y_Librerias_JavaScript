var puntuacion = 0;
var movimientos =0;
var clicks = 0;

$('.btn-reinicio').click(function startTimer() {

  var timer = 120;
  var interval= setInterval(function () {

    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    $('#timer').text(minutes + ":" + seconds);

    if (--timer < 0) {
      $("body").trigger("finTiempo");
      clearInterval(interval);
      $('.main-titulo').stop();
      tiempoAcabo()
    }

  }, 1000);

  parpadear();
  firstClickIniciar();
});

function parpadear(){
  $('.main-titulo').animate({fontSize:"3em"},500,function(){
    $('.main-titulo').css('color','purple')
    $('.main-titulo').animate({fontSize:"3em"},500,function(){
      $('.main-titulo').css('color','yellow')
      $('.main-titulo').animate({fontSize:"3em"},500,parpadear)
    })
  })
};

function firstClickIniciar(){

  clicks++;
  if(clicks==1){
    $('.btn-reinicio').text('Reiniciar');
    llenarTodos();
    startTimer();
    postJugada();
  }else{
    location.reload();
  }
}

function llenarTodos(){
  var columna;
  for (var i = 1; i <= 7; i++) {
    columna = ".col-"+i;
    fillElemento($(columna), 7);
  }
}

function fillElemento(columna, espacios){
  for (var i = 0; i < espacios; i++) {
    var elemento = document.createElement("img");
    $(elemento)
    .attr("src", randomSrc())
    .addClass("elemento")
    .draggable({
      grid: [120,90],
      revert: "valid"
    })
    .droppable({
      accept: ".elemento",
      drop: function(event, ui){
        var srcFrom = $(this).attr("src");
        var srcTo = $(ui.draggable).attr("src");
        $(this).attr("src", srcTo);
        $(ui.draggable).attr("src", srcFrom);
        window.setTimeout(postJugada, 500);
        sumarMovimiento();
      }

    })
    $(columna).prepend(elemento);
  }
}

function randomSrc(){
  var sources = ['./image/1.png', './image/2.png', './image/3.png', './image/4.png'];
  return sources[getRandomInt()]
}

function getRandomInt() {
  return Math.floor(Math.random() * 4);
}

function postJugada(){
  checkMatch();
  window.setTimeout(eliminarElementos,100);
  window.setTimeout(llenarDespuesTurno, 100);
}

function checkMatch(){
  var elementoCompara;
  var actual;
  var matchIzquierda = false;
  var matchDerecha = false;
  var matchAbajo = false;
  var matchArriba = false;
  for (var col = 1; col <= 7; col++) {
    for (var row = 0; row < 7; row++) {
      matchArriba=matchAbajo=matchDerecha=matchIzquierda=false;
      actual = $(".col-"+col).find("img")[row]

      if($(".col-"+(col-1)).length > 0){ 
        elementoCompara = $(".col-"+(col-1)).find("img")[row]
        if (checkSrc(actual, elementoCompara)) {
          matchIzquierda = true;
          if($(".col-"+(col-2)).length > 0){ 
            elementoCompara = $(".col-"+(col-2)).find("img")[row]
            if(checkSrc(actual, elementoCompara)){
              punto(actual, $(".col-"+(col-1)).find("img")[row], elementoCompara )

            }
          }
        }
      }

      if($(".col-"+(col+1)).length > 0){ 
        elementoCompara = $(".col-"+(col+1)).find("img")[row]
        if (checkSrc(actual, elementoCompara)) {
          matchDerecha = true;
          if($(".col-"+(col+2)).length > 0){ 
            elementoCompara = $(".col-"+(col+2)).find("img")[row]
            if(checkSrc(actual, elementoCompara)){
              punto(actual, $(".col-"+(col+1)).find("img")[row], elementoCompara )

            }
          }
        }
      }
     
      if (matchIzquierda == true && matchDerecha == true) {
        punto(actual, $(".col-"+(col-1)).find("img")[row], $(".col-"+(col+1)).find("img")[row])

      }
     
      if($(".col-"+col).find("img")[row-1]){ 
        elementoCompara = $(".col-"+col).find("img")[row-1]
        if (checkSrc(actual, elementoCompara)) {
          matchArriba = true;
          if($(".col-"+col).find("img")[row-2]){ 
            elementoCompara = $(".col-"+col).find("img")[row-2]
            if(checkSrc(actual, elementoCompara)){
              punto(actual, $(".col-"+col).find("img")[row-1], elementoCompara)

            }
          }
        }
      }

      //Verificacion hacia abajo
      if($(".col-"+col).find("img")[row+1]){ 
        elementoCompara = $(".col-"+col).find("img")[row+1]
        if (checkSrc(actual, elementoCompara)) {
          matchAbajo = true;
          if($(".col-"+col).find("img")[row+2]){ 
            elementoCompara = $(".col-"+col).find("img")[row+2]
            if(checkSrc(actual, elementoCompara)){
              punto(actual, $(".col-"+col).find("img")[row+1], elementoCompara)

            }
          }
        }
      }
      
      if (matchArriba == true && matchAbajo == true) {
        punto(actual, $(".col-"+col).find("img")[row+1], $(".col-"+col).find("img")[row-1])

      }
    }
  }
}

function checkSrc(elemento1, elemento2){
  if ($(elemento1).attr("src")==$(elemento2).attr("src")) {
    return true;
  }else return false;
}

function punto(elemento1, elemento2, elemento3){
  puntuacion= puntuacion + 10;
  $("#score-text").text(puntuacion);
  $(elemento1).hide('pulsate', 500)
  $(elemento2).hide('pulsate', 500)
  $(elemento3).hide('pulsate', 500)

}

function eliminarElementos(){
  $("img:hidden").each(function(index){
    $(this).remove()
  })
}

function llenarDespuesTurno(){
  var numeroElementos = numeroFalta = 0;
  for (var i = 1; i <= 7; i++) {
    numeroElementos=$(".col-"+i).find("img").length;
    numeroFalta = 7 - numeroElementos;
    fillElemento($(".col-"+i), numeroFalta);
  }
  window.setTimeout(postJugada, 100)
}

function sumarMovimiento(){
  movimientos++;
  $('#movimientos-text').text(movimientos);
}

function tiempoAcabo(){
  $('.panel-tablero').hide(900);
  $('.panel-score')
  .animate({
    width: '100%'
  }, 1000, function(){
    $(this).prepend("<h2 class='titulo-over'>Juego Terminado</h2>")
  })
  $('.time').hide(500)
  $('#score-text').hide()
  $('.score').append("<span class='data-info' id='score-final'>"+puntuacion+"</span>")
}