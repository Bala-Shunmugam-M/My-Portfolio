/* Atlas: a short, optional career story. All destinations remain ordinary links. */
(function(){
 'use strict';
 var dialog=document.getElementById('tourDialog'),trigger=document.getElementById('openTour');
 if(dialog&&trigger&&typeof dialog.showModal==='function'){
  var chapters=[
   {kicker:'01 / The foundation',title:'Engineering roots. Business perspective.',body:'I’m Bala, an electrical and electronics engineering graduate now pursuing an MBA in Operations Management & Business Analytics at Amrita School of Business, Coimbatore (2025–27).',image:'assets/bala.jpg',alt:'Bala Shunmugam M',caption:'Bala Shunmugam M · MBA candidate',href:'profile.html',link:'View my recruiter profile ↗',tone:'portrait'},
   {kicker:'02 / The field',title:'Learning from the plant floor.',body:'During a nine-week operations internship at Agni Steels, I mapped the 100 TPD sponge-iron process from receipt to dispatch and compared shift records with lab quality results to investigate downtime.',image:'figures/agni_sponge_plant.jpg',alt:'Material handling at the Agni Steels plant',caption:'Plant image from the Agni Steels case study',href:'project-14.html',link:'Read the field study ↗',tone:'field'},
   {kicker:'03 / The practice',title:'Turning data into decisions.',body:'InventoryIQ connects reorder suggestions to incoming stock and received deliveries. Its current web app also explores demand forecasts and scenarios. Five real screen captures show how an operations concept becomes a practical workflow, using clearly labeled sample data.',image:'assets/shots/inventory/01-dashboard.png',alt:'InventoryIQ dashboard with sample retail data',caption:'InventoryIQ · running manager dashboard · sample data',href:'project-07.html',link:'Explore InventoryIQ ↗',tone:'tool'},
   {kicker:'04 / What comes next',title:'Ready for the next conversation.',body:'I’m exploring opportunities where engineering, operations and analysis meet. Start with the résumé and selected evidence, then get in touch to discuss how my background connects with your team.',image:'assets/shots/pp-dashboard.png',alt:'ProcessPilot production analysis interface',caption:'ProcessPilot · interface preview · demonstration data',href:'profile.html',link:'Résumé, evidence & contact ↗',tone:'next'}
  ];
  var current=0,transition=null;
  var content=document.getElementById('tourContent'),previous=document.getElementById('tourPrevious'),next=document.getElementById('tourNext');
  function render(index,animate){
   current=Math.max(0,Math.min(chapters.length-1,index));var chapter=chapters[current];
   if(transition){transition.cancel();transition=null;}
   ['Kicker','Title','Body','Caption'].forEach(function(name){document.getElementById('tour'+name).textContent=chapter[name.toLowerCase()];});
   var img=document.getElementById('tourImage');img.src=chapter.image;img.alt=chapter.alt;
   var link=document.getElementById('tourLink');link.href=chapter.href;link.textContent=chapter.link;
   content.dataset.tone=chapter.tone;previous.disabled=current===0;
   // A disabled previous button must not strand keyboard focus at the boundary.
   if(previous.disabled&&document.activeElement===previous)next.focus();
   next.textContent=current===chapters.length-1?'Finish ✓':'Next →';
   document.getElementById('tourPosition').textContent='0'+(current+1)+' / 04 · '+chapter.kicker.split(' / ')[1];
   dialog.querySelectorAll('.tour-dots i').forEach(function(dot,i){dot.classList.toggle('is-current',i===current);});
   if(animate&&document.documentElement.dataset.motion==='on'&&content.animate)transition=content.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'cubic-bezier(.16,1,.3,1)'});
  }
  trigger.hidden=false;
  trigger.addEventListener('click',function(){render(0,false);dialog.showModal();document.getElementById('closeTour').focus();});
  document.getElementById('closeTour').addEventListener('click',function(){dialog.close();});
  previous.addEventListener('click',function(){render(current-1,true);});
  next.addEventListener('click',function(){if(current===chapters.length-1)dialog.close();else render(current+1,true);});
  dialog.addEventListener('keydown',function(event){if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();render(current+(event.key==='ArrowRight'?1:-1),true);}});
  dialog.addEventListener('close',function(){if(transition)transition.cancel();trigger.focus({preventScroll:true});});
  dialog.addEventListener('click',function(event){var r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
 }
 var print=document.getElementById('printProfile');if(print){print.hidden=false;print.addEventListener('click',function(){window.print();});}
}());
