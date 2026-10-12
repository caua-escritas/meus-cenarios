/* tema.js — botão claro/escuro, compartilhado por todas as páginas.
   Cria o botão sozinho (canto superior direito), lembra a escolha no aparelho
   e, sem escolha salva, segue o tema do aparelho. Se falhar, nada quebra. */
(function(){
  var r=document.documentElement, q=window.matchMedia('(prefers-color-scheme: dark)');
  function salvo(){ try{ return localStorage.getItem('tema'); }catch(e){ return null; } }
  function aplicar(t){ r.setAttribute('data-theme',t); r.setAttribute('data-escuro', t==='dark'?'1':'0'); }
  aplicar(salvo()||(q.matches?'dark':'light'));

  var css=document.createElement('style');
  css.textContent=
    '#tema{position:fixed;top:calc(12px + env(safe-area-inset-top,0px));right:12px;z-index:50;width:44px;height:44px;'+
    'border-radius:50%;border:1px solid rgba(255,255,255,.4);background:rgba(20,30,28,.5);color:#fff;display:grid;'+
    'place-items:center;cursor:pointer;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);padding:0}'+
    '#tema:hover{background:rgba(20,30,28,.7)}#tema:focus-visible{outline:3px solid #8fd1a4;outline-offset:2px}'+
    '#tema .lua{display:none}[data-escuro="1"] #tema .sol-i{display:none}[data-escuro="1"] #tema .lua{display:block}';
  document.head.appendChild(css);

  var b=document.createElement('button');
  b.id='tema'; b.type='button';
  b.setAttribute('aria-label','Alternar entre cena clara e escura'); b.title='Claro / escuro';
  b.innerHTML=
    '<svg class="sol-i" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/>'+
    '<path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'+
    '<svg class="lua" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" fill="currentColor"/></svg>';
  b.addEventListener('click',function(){
    var novo=r.getAttribute('data-theme')==='dark'?'light':'dark'; aplicar(novo);
    try{ localStorage.setItem('tema',novo); }catch(e){}
  });
  document.body.appendChild(b);
})();
