var perso = {
  move_to : '',
  action : '',
  move : 0,
  dir_y :0,
  life : 5,
  cur_jump : -50,
  pos : {
    top : 170,
    left : 40,
  },
  status:'life',
  name : 'Lucas',
  sprite : 'avatar2',
  score : 0,
}

var ctimg=1;


$(function(){
  $('.before').css({"opacity":1, "visibility":'visible'})

  $('button').on('click', function(){
    if($('#input-name').val()!=""){
      perso.name = $('#input-name').val();
      $('.before').animate({opacity:0, visibility:'hidden', zIndex:-1}, 500)
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
  if(perso.action==="play"){
    if(perso.move_to==="left" || perso.move_to==="right") {

      $('#hero').html('<img src=sprite/heros/hero-m-'+ctimg+'.png>');
      if(ctimg>0 && ctimg<3){
        ctimg++;
      } else {
        ctimg--;
      }
    } else if(perso.move_to==="top"){
      $('#hero').html('<img src=sprite/heros/hero-t.png>');
    } else if(perso.move_to==="down"){
      $('#hero').html('<img src=sprite/heros/hero-b.png>');
    }
  } else if(perso.action==="stop"){
    if(perso.move_to==="left") {
      $('#hero').html('<img src=sprite/heros/hero-l.png>');
    } else if(perso.move_to==="right"){
      $('#hero').html('<img src=sprite/heros/hero-r.png>');
    } else {
      $('#hero').html('<img src=sprite/heros/hero-l.png>');
    }
  }
}

function jump(){
  if(perso.pos.top - perso.dir_y<$("#floor").position().top && perso.pos.left>-20){
    //droite et gauche
    if (Math.abs(perso.move) == 5) {
      perso.pos.left += perso.move;
    }
    if(perso.cur_jump!= -50){
      perso.cur_jump++;
      perso.dir_y -= perso.cur_jump;
    }
    if ((perso.pos.top - perso.dir_y >= map[Math.round(perso.pos.left / 20)] - 37) && (perso.pos.top - perso.dir_y <= map[Math.round(perso.pos.left / 20)] - 27)) {
      perso.cur_jump = -50;
      perso.dir_y = 0;
      perso.pos.top = map[Math.round(perso.pos.left / 20)] - 34;
      // console.log('colision')
    } else {
      if ((perso.pos.top - perso.dir_y < map[Math.round(perso.pos.left / 20)] - 37) && (perso.cur_jump == -50)) {
        perso.cur_jump = 1;
        //console.log('no - jump')
      }
      if ((perso.pos.top - perso.dir_y > map[Math.round(perso.pos.left / 20)] - 27) && (perso.cur_jump == -50)) {
        perso.cur_jump = 1;
        //console.log('jump - down')
      }
    }
    $('#hero').css({'left':perso.pos.left,'top': perso.pos.top - perso.dir_y});
    $('#game').scrollLeft(perso.pos.left - 200, 0);
    $('#score span').html(perso.score)
    //COUNT COINT
    var herotop=perso.pos.top - perso.dir_y;
    var curent_i_map = Math.round(perso.pos.left / 20);
    //console.log(curent_i_map, perso.pos.left);
    if($.inArray(curent_i_map, hit)){
      if($('.hit').data("id")===curent_i_map){
        if(herotop<$('.hit[data-id='+curent_i_map+']')[0].offsetTop && herotop<$('.hit[data-id='+curent_i_map+']')[0].offsetTop+20){
          $('.hit[data-id='+curent_i_map+']').remove();
          perso.score+=10;
        }
      }
    }
  } else {
    perso.status = "dead";
    $('.end').css({"visibility":'visible'})
    $('.end').animate({opacity:1, zIndex:100}, 500)
  }
  setTimeout("jump()", 30);
}

function getActionStart(keyStroke) {

  isNetscape = (document.getElementById && !document.all);
  touche = (isNetscape) ? keyStroke.which : event.keyCode;
  if(touche===37 || touche===39 || touche===38 || touche===40 || touche===32) {
    if ((touche == 37)) {
      perso.move = -5;
      perso.move_to="right";
    }
    if ((touche == 39)) {
      perso.move = 5;
      perso.move_to="left";
    }
    if (((touche == 38) && (perso.cur_jump == -50) )|| ((touche == 32) && (perso.cur_jump == -50) )) {
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
  } else {
    return false;
  }

}

function getActionEnd(keyStroke) {
  isNetscape = (document.getElementById && !document.all);
  touche = (isNetscape) ? keyStroke.which : event.keyCode;
  if(touche===37 || touche===39 || touche===38 || touche===40) {
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
  } else {
    return false;
  }

}