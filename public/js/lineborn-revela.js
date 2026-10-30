/* lineborn-revela.js — as seções surgem com um leve deslocamento quando entram na tela (uma vez só).
   Sem JavaScript, ou com "reduzir movimento" ligado, tudo já aparece normalmente. */
(function(){
  if(!('IntersectionObserver' in window))return;
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var itens=document.querySelectorAll('.l-card, .l-etapa');
  if(!itens.length)return;
  document.documentElement.classList.add('js-revela');
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visto');io.unobserve(e.target);}});
  },{rootMargin:'0px 0px -8% 0px'});
  Array.prototype.forEach.call(itens,function(i){io.observe(i);});
  /* garantia: se algo não aparecer em 3 s, mostra tudo */
  setTimeout(function(){Array.prototype.forEach.call(itens,function(i){i.classList.add('visto');});},3000);
})();
