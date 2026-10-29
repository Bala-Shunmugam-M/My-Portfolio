/* Career interactions: local-only, with native controls and honest example data. */
(function(){
  'use strict';
  var imageDialog=document.getElementById('imageDialog');
  if(imageDialog && typeof imageDialog.showModal==='function'){
    document.querySelectorAll('[data-preview]').forEach(function(button){
      button.hidden=false;
      button.addEventListener('click',function(){
        var img=document.getElementById('previewImage');
        img.src=button.dataset.preview;
        img.alt=button.parentElement.querySelector('img').alt;
        document.getElementById('imageCaption').textContent=button.dataset.caption;
        imageDialog.showModal();
      });
    });
    document.getElementById('closeImage').addEventListener('click',function(){imageDialog.close();});
    imageDialog.addEventListener('click',function(event){
      var box=imageDialog.getBoundingClientRect();
      if(event.target===imageDialog && (event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom))imageDialog.close();
    });
  }
  var copy=document.getElementById('copyEmail');
  if(copy){
    copy.hidden=false;
    copy.addEventListener('click',async function(){
      var fallback=document.getElementById('copyEmailFallback');
      var status=document.getElementById('copyEmailStatus');
      try {
        await navigator.clipboard.writeText('balashunmugamruthran@gmail.com');
        fallback.hidden=true;status.textContent='Email address copied.';
      }catch(_){
        fallback.hidden=false;var field=fallback.querySelector('input');field.focus();field.select();
        status.textContent='Select and copy the email address below.';
      }
    });
  }
  var form=document.getElementById('inventoryExample');
  if(form){
    var inputs=Array.from(form.querySelectorAll('input'));
    var status=document.getElementById('labStatus');
    var results=document.getElementById('labResults');
    var format=new Intl.NumberFormat('en-IN',{maximumFractionDigits:0});
    function calculate(){
      var invalid=inputs.filter(function(input){
        var n=input.valueAsNumber;
        var bad=!Number.isFinite(n)||n<Number(input.min)||n>Number(input.max)||!Number.isInteger(n);
        input.setAttribute('aria-invalid',String(bad));return bad;
      });
      results.hidden=invalid.length>0;
      if(invalid.length){
        var first=invalid[0];
        status.textContent='Enter a whole number between '+first.min+' and '+first.max+' for '+first.labels[0].childNodes[0].textContent.trim().toLowerCase()+'.';
        return;
      }
      var demand=inputs[0].valueAsNumber*12,order=inputs[1].valueAsNumber,holding=inputs[2].valueAsNumber,lead=inputs[3].valueAsNumber;
      var eoq=Math.max(1,Math.round(Math.sqrt(2*demand*order/holding)));
      var reorder=Math.ceil(demand*(lead+3)/300);
      document.getElementById('eoqValue').textContent=format.format(eoq);
      document.getElementById('ropValue').textContent=format.format(reorder);
      document.getElementById('labInterpretation').textContent='In this example, balance ordering and holding costs with about '+format.format(eoq)+' units per order. Reorder at '+format.format(reorder)+' units to cover lead-time demand and the fixed buffer.';
      status.textContent='';
    }
    form.addEventListener('input',calculate);
    form.addEventListener('submit',function(event){event.preventDefault();calculate();});
    form.addEventListener('reset',function(event){
      event.preventDefault();inputs.forEach(function(input){input.value=input.defaultValue;});calculate();
    });
    // Make updated results available to assistive technology without moving focus.
    results.setAttribute('aria-live','polite');results.setAttribute('aria-atomic','true');
    document.getElementById('decisionLab').hidden=false;calculate();
  }
}());
