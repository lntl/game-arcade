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
  status:'safe',
  name : 'Lucas',
  sprite : 'avatar2',
  score : 0,
}
var laps_time=0;
var gravity=30;
var ctimg=1;
let initGame;

$(function(){
  $('.before').css({"opacity":1, "visibility":'visible'});
  $('button').on('click', function(){
    if($('#input-name').val()!=""){
      perso.name = $('#input-name').val();
      $('.before').animate({opacity:0, visibility:'hidden', zIndex:-1}, 500);
      startGame();
    }
  })
})

function rmGame(){
  $('.end').animate({opacity:0, visibility:'hidden', zIndex:-1}, 300);
  perso.status = "safe";
  perso.move_to='';
  perso.action='';
  perso.move=0;
  perso.dir_y=0;
  perso.cur_jump=-50;
  perso.pos.left = 40;
  perso.pos.top=170;
  $('#hero').css({'top':$('#game').height()-$('#hero').height()-$('#floor').height()});
  $('#game').scrollLeft(perso.pos.left, 0);
  clearInterval(initGame);
  jump();

}

function restartGame(){

  if(perso.life!=0){
    $('#title-end').html('<p>Il te reste '+perso.life+' vie(s)</p>');
    $('.life').html('reesayer');
    $('.life').on('click', function(){
      rmGame();
    });
  } else {
    $('#title-end').html('<p>T\’es nul</p>');
    $('.life').remove();
    perso.life=0;
    setTimeout(function(){
      window.location="";
    },3000)
  }
  $('.end').css({"visibility":'visible'})
  $('.end').animate({opacity:1, zIndex:100}, 300)

  console.log(perso.life)
}

function startGame(){
  perso.move_to='';
  perso.action='';
  perso.move=0;
  perso.dir_y=0;
  perso.cur_jump=-50;

  $('#hero').css({'top':$('#game').height()-$('#hero').height()-$('#floor').height()});
  $('#game').scrollLeft(perso.pos.left, 0);
  if(perso.life===5){
    mapped();    
  }
  document.onkeydown = getActionStart;
  document.onkeyup = getActionEnd;
  $('#floor').css({'width':$('#screen-map')[0].scrollWidth+"px"})
  $('.name').html(document.createTextNode(perso.name));
  moveHero();
  jump();

  var cur_dalle="";
  var cntDalle=0;
  $('.map-sol').each(function(){
    if(cur_dalle===""){
      cur_dalle=$(this)[0].offsetTop;
    }
    if(cur_dalle!=$(this)[0].offsetTop){
      cur_dalle="";
    }
    if($(this)[0].offsetTop===cur_dalle){
      cntDalle++;
    } else {
      cur_dalle="";
      cntDalle=0;
    }

    if(cntDalle===2){
      console.log($(this));
      console.log("poser un mob");
    }

  })

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
    laps_time++;
    $('.time span').html(Math.round(((laps_time*60)/24)/100));
    $('.perso-life span').html(perso.life);
    initGame = setTimeout("jump()", gravity);
  } else {
    clearInterval(initGame);
    perso.life--;
    perso.status = "dead";
    restartGame();
  }
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
  if(touche===13 && perso.status==="dead" && perso.life>0){
    rmGame();
  }
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