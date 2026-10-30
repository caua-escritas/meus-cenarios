/* lineborn-capa.js — desenha os fios, nuvens e estrelas da capa do Lineborn (sistemas/lineborn/).
   Estilo em css/lineborn-capa.css.
   Tudo é calculado a partir do tamanho da tela e do texto, para os fios nunca cruzarem as letras. */
(function(){
  var NS='http://www.w3.org/2000/svg', reduz=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function mk(t,a){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);return e;}
  function f(v){return (+v).toFixed(1);}
  var capa=document.getElementById('capa');
  var cab=document.getElementById('cabos'),ast=document.getElementById('astros'),nuv=document.getElementById('nuvens');
  var idLuz=0;

  function estrela(cx,cy,r){return 'M'+f(cx)+' '+f(cy-r)+' Q'+f(cx)+' '+f(cy)+' '+f(cx+r)+' '+f(cy)+' Q'+f(cx)+' '+f(cy)+' '+f(cx)+' '+f(cy+r)+' Q'+f(cx)+' '+f(cy)+' '+f(cx-r)+' '+f(cy)+' Q'+f(cx)+' '+f(cy)+' '+f(cx)+' '+f(cy-r)+'Z';}
  /* cabo: quadrática de (0,y0) a (W,y1) com flecha; x é linear em t */
  function cabo(W,y0,y1,sag){var cy=(y0+y1)/2+sag*2;return{y0:y0,y1:y1,cy:cy,W:W,
    d:'M0 '+f(y0)+' Q'+f(W/2)+' '+f(cy)+' '+f(W)+' '+f(y1),
    em:function(x){var t=x/W;return (1-t)*(1-t)*y0+2*(1-t)*t*cy+t*t*y1;}};}
  function ponto(c,t){var x=c.W*t,y=(1-t)*(1-t)*c.y0+2*(1-t)*t*c.cy+t*t*c.y1;return{x:x,y:y};}

  var cs={};
  function desenhar(){
    var W=capa.clientWidth,H=capa.clientHeight;
    [cab,ast,nuv].forEach(function(s){s.setAttribute('viewBox','0 0 '+W+' '+H);s.setAttribute('width',W);s.setAttribute('height',H);s.innerHTML='';});

    /* nuvens: formas chapadas e suaves */
    function nuvem(x,y,w,h){return 'M'+f(x)+' '+f(y+h)+' C'+f(x)+' '+f(y+h*.4)+' '+f(x+w*.18)+' '+f(y+h*.3)+' '+f(x+w*.28)+' '+f(y+h*.45)+' C'+f(x+w*.32)+' '+f(y)+' '+f(x+w*.62)+' '+f(y-h*.1)+' '+f(x+w*.68)+' '+f(y+h*.38)+' C'+f(x+w*.85)+' '+f(y+h*.22)+' '+f(x+w)+' '+f(y+h*.5)+' '+f(x+w)+' '+f(y+h)+'Z';}
    nuv.appendChild(mk('path',{d:nuvem(-W*.1,H*.60,W*.75,H*.15)}));
    nuv.appendChild(mk('path',{d:nuvem(W*.45,H*.52,W*.7,H*.17)}));
    nuv.appendChild(mk('path',{d:nuvem(-W*.05,H*.18,W*.5,H*.09)}));

    /* astros: poucos, bem espaçados (estrelas de 4 pontas, círculos e um mais) */
    [[.82,.12,7],[.62,.065,3.5],[.12,.055,3],[.91,.50,4.5],[.07,.58,3.5],[.78,.64,5],[.5,.62,3]].forEach(function(s){ast.appendChild(mk('path',{'class':'e',d:estrela(W*s[0],H*s[1],s[2])}));});
    ast.appendChild(mk('circle',{'class':'c',cx:W*.93,cy:H*.075,r:5}));
    ast.appendChild(mk('circle',{'class':'c',cx:W*.94,cy:H*.58,r:3.5}));
    var px=W*.38,py=H*.035;ast.appendChild(mk('path',{'class':'p',d:'M'+f(px-5)+' '+f(py)+'H'+f(px+5)+'M'+f(px)+' '+f(py-5)+'V'+f(py+5)}));

    /* cabos (fios) cruzando o céu */
    var cr0=capa.getBoundingClientRect(),bl=document.getElementById('balao').getBoundingClientRect();
    var yb=bl.bottom-cr0.top;
    cs.a=cabo(W,H*.045,H*.10,H*.02);
    cs.b=cabo(W,yb+34,yb+10,H*.02);
    [['c1',cs.a],['c2',cs.b]].forEach(function(p){var el=mk('path',{'class':p[0]+' desenha',d:p[1].d,pathLength:1});cab.appendChild(el);});

    cab.appendChild(mk('circle',{'class':'no',cx:W*.14,cy:cs.b.em(W*.14),r:4}));
    cab.appendChild(mk('circle',{'class':'no',cx:W*.88,cy:cs.a.em(W*.88),r:4}));
  }

  /* luz que percorre um cabo (lenta; só ao carregar e ao interagir com o menu) */
  function luz(c,dur){
    if(reduz||!c)return;
    var id=++idLuz,t0=null,g=mk('circle',{'class':'halo',r:9,opacity:0}),p=mk('circle',{'class':'luz',r:2.8,opacity:0});
    cab.appendChild(g);cab.appendChild(p);
    function passo(t){if(id!==idLuz||!g.parentNode)return;if(!t0)t0=t;var u=Math.min(1,(t-t0)/dur),q=ponto(c,u),o=Math.min(1,u*10,(1-u)*10);
      [g,p].forEach(function(x){x.setAttribute('cx',q.x);x.setAttribute('cy',q.y)});g.setAttribute('opacity',o*.3);p.setAttribute('opacity',o);
      if(u<1)requestAnimationFrame(passo);else{g.remove();p.remove();}}
    requestAnimationFrame(passo);
  }

  desenhar();
  setTimeout(function(){luz(cs.a,7000)},2200);
  var bal=document.getElementById('balao');
  bal.addEventListener('pointerenter',function(){luz(cs.a,3600)});
  bal.addEventListener('focusin',function(){luz(cs.a,3600)});
  var rz=null;window.addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(desenhar,150);});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(desenhar);
})();
