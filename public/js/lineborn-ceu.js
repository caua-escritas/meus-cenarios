/* lineborn-ceu.js — desenha o céu (nuvens, fio, estrelas) no cabeçalho das páginas internas do Lineborn.
   É só decoração: o texto e o menu estão no HTML. Sem JavaScript, o cabeçalho continua com o degradê e o corte escuro.
   Para mudar o desenho, mude aqui; o estilo (cores, animações) está em css/lineborn.css (.l-cena, .l-nos, .l-est, .l-luz). */
(function(){
  var hero=document.querySelector('.l-hero');
  if(!hero)return;
  hero.insertAdjacentHTML('afterbegin',
    '<svg class="l-cena" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">'+
      '<path class="nuvem" d="M0,220 C30,190 80,188 104,210 C128,184 196,186 212,214 C228,198 266,200 280,224 C288,252 270,280 258,300 L0,300Z"/>'+
      '<path class="nuvem" d="M170,300 C196,246 290,196 330,232 C348,220 384,220 400,234 L400,300Z"/>'+
      '<path class="fio cabo" d="M-5,16 C80,28 200,10 405,30"/>'+
      '<path class="fio trac" d="M-5,196 C50,176 110,214 190,192 S320,170 405,200"/>'+
    '</svg>'+
    '<i class="l-nos a"></i><i class="l-nos b"></i>'+
    '<i class="l-est e1"></i><i class="l-est e2"></i><i class="l-est e3"></i><i class="l-est e4"></i>'+
    '<i class="l-luz"></i>');
})();
