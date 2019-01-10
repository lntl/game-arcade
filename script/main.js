var perso = {
  move_to : '',
  action : '',
  move : 0,
  dir_y :0,
  cur_jump : -50,
  pos : {
    top : 170,
    left : 40,
  },
  status:'life',
  name : 'Lucas',
  sprite : 'avatar2',
}


$(function(){

  $('button').on('click', function(){
    if($('#input-name').val()!=""){
      perso.name = $('#input-name').val();
      $('.before').animate({opacity:0}, 500)
      startGame();
    }
  })

  
})

function startGame(){
  $('#hero').css({'top':$('#game').height()-$('#hero').height()-$('#floor').height()});
  
  document.onkeydown = getActionStart;
  document.onkeyup = getActionEnd;
  mapped();     
  $('#floor').css({'width':$('#screen-map')[0].scrollWidth+"px"})
  $('.name').html(document.createTextNode(perso.name));
  
  moveHero();
  jump();
}



function moveHero(){
  // console.log(perso)
  if(perso.action==="play"){
    if(perso.move_to==="left") {
      $('#hero').html('<img src=sprite/heros/hero-lm.gif >');
    } else if(perso.move_to==="right"){
      $('#hero').html('<img src=sprite/heros/hero-rm.gif>');
    } else if(perso.move_to==="top"){
      $('#hero').html('<img src=sprite/heros/hero-t.png>');
    } 
  } else if(perso.action==="stop"){
    if(perso.move_to==="left") {
      $('#hero').html('<img src=sprite/heros/hero-l.gif>');
    } else if(perso.move_to==="right"){
      $('#hero').html('<img src=sprite/heros/hero-r.gif>');
    } else {
      $('#hero').html('<img src=sprite/heros/hero-l.png>');
    }
  }
}

function jump(){
  
  if(perso.cur_jump!= -50){
    perso.cur_jump++;
    perso.dir_y -= perso.cur_jump;
  }
  if ((perso.pos.top - perso.dir_y >= map[Math.round(perso.pos.left / 20)] - 37) && (perso.pos.top - perso.dir_y <= map[Math.round(perso.pos.left / 20)] - 27)) {
    perso.cur_jump = -50;
    perso.dir_y = 0;
    perso.pos.top = map[Math.round(perso.pos.left / 20)] - 34;
  } else {
    if ((perso.pos.top - perso.dir_y < map[Math.round(perso.pos.left / 20)] - 37) && (perso.cur_jump == -50)) {
      perso.cur_jump = 1;
    }
    if ((perso.pos.top - perso.dir_y > map[Math.round(perso.pos.left / 20)] - 27) && (perso.cur_jump == -50)) {
      perso.cur_jump = 1;
    }
  }
  //droite et gauche
  if (Math.abs(perso.move) == 5) {
    perso.pos.left += perso.move;
  }

  if(perso.dir_y<-100){
    perso.status = "dead";
    //alert('Mort :) ');
    $('.end').animate({opacity:1, zIndex:100}, 500)
    //window.location="";
  }
  //console.log(perso.cur_jump);
  $('#hero').css({'left':perso.pos.left,'top': perso.pos.top - perso.dir_y});
  $('#game').scrollLeft(perso.pos.left - 200, 0);
  //window.scrollTo(perso.pos.left - 200, 0);
  //
  $('#score span').html(perso.pos.left);
  setTimeout("jump()", 30);
}

function getActionStart(keyStroke) {
  isNetscape = (document.getElementById && !document.all);
  touche = (isNetscape) ? keyStroke.which : event.keyCode;
  if ((touche == 37)) {
    perso.move = -5;
    perso.move_to="right";
  }
  if ((touche == 39)) {
    perso.move = 5;
    perso.move_to="left";
  }
  if ((touche == 38) && (perso.cur_jump == -50)) {
    perso.cur_jump = -12;
  }
  if(touche == 38) {
    perso.move_to="top";
  }
  if(touche == 40) {
    perso.move_to="down";
  }
  perso.action="play";
  moveHero('play');
}

function getActionEnd(keyStroke) {
  isNetscape = (document.getElementById && !document.all);
  touche = (isNetscape) ? keyStroke.which : event.keyCode;
  if ((touche == 37)) {
    perso.move = 0;
    perso.move_to="right";
  }
  if ((touche == 39)) {
    perso.move = 0;
    perso.move_to="left";
  }
  if(touche == 38) {
    perso.move_to="top";
  }
  if(touche == 40) {
    perso.move_to="down";
  }
  perso.action="stop";
  moveHero('stop');
}