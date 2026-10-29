/* Studio motion is a progressive enhancement; no navigation is delayed. */
(function(){
 'use strict';
 var root=document.documentElement;
 var system=window.matchMedia('(prefers-reduced-motion: reduce)');
 var preference='on';try{if(localStorage.getItem('portfolio-motion')==='off')preference='off';}catch(_){}
 var utilities=document.createElement('div');utilities.className='studio-utilities';
 var label=document.createElement('span');label.textContent='Explore at your own pace.';
 var toggle=document.createElement('button');toggle.type='button';toggle.id='motionToggle';
 utilities.append(label,toggle);document.body.append(utilities);
 function syncMotion(){
  var enabled=!system.matches&&preference==='on';root.dataset.motion=enabled?'on':'off';
  toggle.textContent=system.matches?'Motion reduced by system':enabled?'Motion on · pause':'Motion off · enable';
  toggle.setAttribute('aria-label',system.matches?'Motion reduced by system':enabled?'Pause animations':'Enable animations');
  toggle.setAttribute('aria-pressed',String(enabled));toggle.disabled=system.matches;
  if(!enabled){
   document.querySelectorAll('.studio-pending').forEach(function(el){el.classList.remove('studio-pending');});
   document.getAnimations().forEach(function(animation){try{animation.cancel();}catch(_){}});
   if(portrait)portrait.style.transform='';
  }
 }
 toggle.addEventListener('click',function(){preference=preference==='on'?'off':'on';try{localStorage.setItem('portfolio-motion',preference);}catch(_){}syncMotion();});
 if(system.addEventListener)system.addEventListener('change',syncMotion);
 syncMotion();

 var progress=document.createElement('div');progress.className='studio-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 var top=document.createElement('button');top.className='studio-top';top.id='backToTop';top.type='button';top.textContent='↑';top.setAttribute('aria-label','Back to top');top.hidden=true;document.body.append(top);
 top.addEventListener('click',function(){window.scrollTo({top:0,behavior:root.dataset.motion==='on'?'smooth':'instant'});var main=document.querySelector('main')||document.querySelector('h1');if(main){if(!main.hasAttribute('tabindex'))main.tabIndex=-1;main.focus({preventScroll:true});}});
 var scrollFrame=false;
 function updateScroll(){var max=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(max>0?Math.min(1,scrollY/max):0)+')';top.hidden=scrollY<500;scrollFrame=false;}
 function requestScroll(){if(!scrollFrame){scrollFrame=true;requestAnimationFrame(updateScroll);}}
 addEventListener('scroll',requestScroll,{passive:true});addEventListener('resize',requestScroll,{passive:true});updateScroll();

 // Content is visible by default; only off-screen sections receive an entrance.
 if(root.dataset.motion==='on'&&'IntersectionObserver' in window){
  var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('studio-arrived');entry.target.classList.remove('studio-pending');observer.unobserve(entry.target);}});},{threshold:.08});
  document.querySelectorAll('.studio-showcase .section-head,.focus-intro,.career-journey,.gallery-card,.lab-grid,.resume-layout,.archive-toolbar').forEach(function(el){if(el.getBoundingClientRect().top>innerHeight){el.classList.add('studio-pending');observer.observe(el);}});
 }
 var portrait=document.querySelector('.career-portrait');
 var fine=window.matchMedia('(hover:hover) and (pointer:fine)');
 if(portrait&&fine.matches){
  var tiltFrame=0,position=null;
  portrait.addEventListener('pointermove',function(event){
   if(root.dataset.motion!=='on')return;position={x:event.clientX,y:event.clientY};if(tiltFrame)return;
   tiltFrame=requestAnimationFrame(function(){tiltFrame=0;if(!position||root.dataset.motion!=='on')return;var r=portrait.getBoundingClientRect();var x=(position.x-r.left)/r.width-.5,y=(position.y-r.top)/r.height-.5;portrait.style.transform='perspective(900px) rotateX('+(-y*4)+'deg) rotateY('+(x*4)+'deg)';});
  });
  portrait.addEventListener('pointerleave',function(){position=null;cancelAnimationFrame(tiltFrame);tiltFrame=0;portrait.style.transform='';});
 }
 var stage=document.getElementById('showcaseStage');
 if(stage){
  var slides=Array.from(stage.querySelectorAll('.showcase-slide')),current=0,transition=null;
  function select(next,animate){
   var restoreLink=stage.contains(document.activeElement);
   current=(next+slides.length)%slides.length;
   if(transition){transition.cancel();transition=null;}
   slides.forEach(function(slide,i){slide.hidden=i!==current;});
   if(restoreLink)slides[current].querySelector('a').focus({preventScroll:true});
   document.getElementById('showcaseStatus').textContent='0'+(current+1)+' / 0'+slides.length+' · '+slides[current].querySelector('h3').textContent;
   if(animate&&root.dataset.motion==='on'&&slides[current].animate)transition=slides[current].animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:380,easing:'cubic-bezier(.16,1,.3,1)'});
  }
  document.getElementById('showcasePrevious').addEventListener('click',function(){select(current-1,true);});
  document.getElementById('showcaseNext').addEventListener('click',function(){select(current+1,true);});
  var controls=document.getElementById('showcaseControls');controls.hidden=false;
  function keyboard(event){if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();select(current+(event.key==='ArrowRight'?1:-1),true);}}
  controls.addEventListener('keydown',keyboard);stage.addEventListener('keydown',keyboard);select(0,false);
 }
}());
