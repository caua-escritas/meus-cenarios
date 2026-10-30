/* lineborn-livro.js — transforma a página de regras em um "livro": cada etapa é uma página, e se vira de lado
   (botões, setas do teclado ou arrastando o dedo). Sem JavaScript, a página continua rolando normalmente.
   Para criar uma página nova do livro, basta criar uma nova etapa (.l-etapa + .l-cards) no HTML. */
(function(){
  var main=document.querySelector('main');
  if(!main)return;
  var ind=main.querySelector('.l-indice'),etapas=main.querySelectorAll('.l-etapa');
  if(!ind||!etapas.length)return;
  var reduz=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var el=function(t,c){var e=document.createElement(t);if(c)e.className=c;return e;};

  /* 1. monta as folhas: índice + uma por etapa */
  var livro=el('div','livro');
  main.insertBefore(livro,ind);
  var folhas=[],titulos=[];
  var f0=el('div','folha');f0.appendChild(ind);livro.appendChild(f0);folhas.push(f0);titulos.push('Índice');
  Array.prototype.forEach.call(etapas,function(et){
    var f=el('div','folha'),prox=et.nextElementSibling;
    titulos.push(et.querySelector('h2').textContent);
    f.appendChild(et);
    while(prox&&!prox.classList.contains('l-etapa')){var seg=prox.nextElementSibling;f.appendChild(prox);prox=seg;}
    livro.appendChild(f);folhas.push(f);
  });

  /* detalhe de livro: número da página no fim de cada folha */
  folhas.forEach(function(f,i){
    var fo=el('div','folio');fo.setAttribute('aria-hidden','true');fo.innerHTML='<i></i><span>'+(i+1)+'</span><i></i>';f.appendChild(fo);
  });

  /* 2. barra de navegação */
  var nav=el('nav','livro-nav');nav.setAttribute('aria-label','Virar página');
  nav.innerHTML='<button type="button" class="ant" aria-label="Página anterior">&larr;</button><div class="meio"><span class="rot"></span><span class="pontos"></span></div><button type="button" class="prox" aria-label="Próxima página">&rarr;</button>';
  main.appendChild(nav);
  var pontos=nav.querySelector('.pontos'),rot=nav.querySelector('.rot'),bAnt=nav.querySelector('.ant'),bProx=nav.querySelector('.prox');
  folhas.forEach(function(f,i){var b=el('button');b.type='button';b.setAttribute('aria-label','Ir para: '+titulos[i]);b.addEventListener('click',function(){vai(i);});pontos.appendChild(b);});

  document.documentElement.classList.add('livro-on');
  var atual=-1;

  function vai(i,dir,alvo){
    if(i<0||i>=folhas.length)return;
    var antes=atual;atual=i;
    folhas.forEach(function(f,k){f.hidden=(k!==i);f.classList.remove('vem-d','vem-e');});
    if(!reduz&&antes!==-1&&antes!==i){var d=dir||(i>antes?1:-1);void folhas[i].offsetWidth;folhas[i].classList.add(d>0?'vem-d':'vem-e');}
    var bs=pontos.children,k;for(k=0;k<bs.length;k++){bs[k].classList.toggle('on',k===i);if(k===i)bs[k].setAttribute('aria-current','true');else bs[k].removeAttribute('aria-current');}
    rot.textContent=i===0?'Índice':'Etapa '+i+' · '+titulos[i];
    bAnt.disabled=(i===0);bProx.disabled=(i===folhas.length-1);
    if(alvo&&alvo.id&&!alvo.classList.contains('l-etapa'))alvo.scrollIntoView({block:'start'});
    else window.scrollTo(0,Math.max(0,livro.getBoundingClientRect().top+window.pageYOffset-12));
    try{var id=i===0?'':(folhas[i].querySelector('.l-etapa').id);history.replaceState(null,'',id?'#'+id:location.pathname+location.search);}catch(e){}
  }
  function porHash(h,dir){
    var id=decodeURIComponent((h||'').replace('#','')),alvo=id?document.getElementById(id):null;
    if(!alvo){vai(0,dir);return;}
    var f=alvo.closest('.folha');vai(folhas.indexOf(f),dir,alvo);
  }

  bAnt.addEventListener('click',function(){vai(atual-1,-1);});
  bProx.addEventListener('click',function(){vai(atual+1,1);});
  /* links internos (#...) viram páginas */
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href^="#"]');
    if(!a||!main.contains(a)&&!a.closest('.l-indice'))return;
    var h=a.getAttribute('href');if(h.length<2)return;
    e.preventDefault();porHash(h);
  });
  window.addEventListener('hashchange',function(){porHash(location.hash);});
  /* teclado */
  document.addEventListener('keydown',function(e){
    if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;
    var t=e.target&&e.target.tagName;if(t==='INPUT'||t==='TEXTAREA'||t==='SELECT')return;
    if(e.key==='ArrowRight')vai(atual+1,1);else if(e.key==='ArrowLeft')vai(atual-1,-1);
  });
  /* arrastar o dedo para o lado */
  var x0=null,y0=0;
  livro.addEventListener('touchstart',function(e){
    if(e.touches.length!==1||e.target.closest('.l-rolagem')){x0=null;return;}
    x0=e.touches[0].clientX;y0=e.touches[0].clientY;
  },{passive:true});
  livro.addEventListener('touchend',function(e){
    if(x0===null)return;
    var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;
    if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.6)vai(atual+(dx<0?1:-1),dx<0?1:-1);
  },{passive:true});

  porHash(location.hash);
})();
