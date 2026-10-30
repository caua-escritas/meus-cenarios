/* lineborn-dados.js — lançador de dados da página Regras básicas (3d6: dois verdes e um azul; escolhe 2).
   Só funciona onde existir o bloco <div id="dados">. Estilo em css/lineborn.css (.l-dados). */
(function(){
  var raiz=document.getElementById('dados');
  if(!raiz)return;
  var S={bonus:2,dados:null,sel:[],rolando:false};
  var $=function(c){return raiz.querySelector(c);};
  var NOMES=['Verde','Verde','Azul'];
  var reduz=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MAPA={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
  function sorteia(){return 1+Math.floor(Math.random()*6);}
  function pontos(n){var on=MAPA[n]||[],h='',i;for(i=0;i<9;i++)h+='<i'+(on.indexOf(i)>-1?' class="p"':'')+'></i>';return h;}

  function mesa(anima){
    var h='',i;
    for(i=0;i<3;i++){
      var v=S.dados?S.dados[i]:null,cls='dado '+(i===2?'azul':'verde');
      if(!S.dados)cls+=' idle';else if(S.sel.indexOf(i)>-1)cls+=' escolhido';else if(S.sel.length===2)cls+=' fora';
      if(anima)cls+=' rolando';
      h+='<div class="dado-box"><div class="'+cls+'" role="button" tabindex="'+(S.dados&&!S.rolando?0:-1)+'" aria-pressed="'+(S.sel.indexOf(i)>-1)+'" aria-label="Dado '+NOMES[i].toLowerCase()+': '+(v||'ainda sem valor')+'" data-i="'+i+'" style="'+(anima?'animation-delay:'+(i*110)+'ms':'')+'">'+pontos(v||0)+'</div><span class="chao"></span><b class="astro"'+(S.sel.indexOf(i)>-1?'':' hidden')+'></b><small>'+NOMES[i]+(i===2?' · adaptação':'')+'</small></div>';
    }
    $('.mesa').innerHTML=h;
    Array.prototype.forEach.call(raiz.querySelectorAll('.dado'),function(d){
      var vai=function(){escolhe(+d.getAttribute('data-i'));};
      d.addEventListener('click',vai);
      d.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();vai();}});
    });
  }
  function escolhe(i){
    if(!S.dados||S.rolando)return;
    var at=S.sel.indexOf(i);
    if(at>-1)S.sel.splice(at,1);else if(S.sel.length<2)S.sel.push(i);else S.sel=[S.sel[1],i];
    S.sel.sort();mesa(false);resultado();
  }
  function resultado(){
    var r=$('.res'),dica=$('.dica');
    if(!S.dados||S.sel.length<2){r.hidden=true;dica.textContent=S.dados?'Toque em dois dados para somar.':'Os dados aparecem aqui.';return;}
    var d=S.dados,a=d[S.sel[0]],b=d[S.sel[1]],total=a+b+S.bonus,crit=d.filter(function(v){return v===6;}).length>=2;
    dica.textContent='Toque em outro dado para trocar a escolha.';
    r.hidden=false;
    r.className='res'+(crit?' critico':'');
    r.innerHTML='<p class="total">'+total+'</p><p class="conta">'+a+' + '+b+' + bônus '+S.bonus+'</p>'+(crit?'<span class="crit">Crítico: dois dados em 6</span>':'');
  }
  function rola(){
    if(S.rolando)return;
    S.rolando=true;S.dados=[sorteia(),sorteia(),sorteia()];S.sel=[];
    $('.rolar').disabled=true;$('.res').hidden=true;$('.dica').textContent='Rolando...';
    mesa(!reduz);
    setTimeout(function(){S.rolando=false;$('.rolar').disabled=false;mesa(false);$('.dica').textContent='Escolha dois dos três dados.';},reduz?0:900);
  }
  $('.menos').addEventListener('click',function(){S.bonus=Math.max(0,S.bonus-1);$('output').textContent=S.bonus;resultado();});
  $('.mais').addEventListener('click',function(){S.bonus=Math.min(10,S.bonus+1);$('output').textContent=S.bonus;resultado();});
  $('.rolar').addEventListener('click',rola);
  mesa(false);
})();
