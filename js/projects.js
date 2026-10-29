/* Project discovery: composable filters, local saves and contextual comparison. */
(function () {
  'use strict';
  var toolbar=document.getElementById('archiveToolbar');
  var bar=document.getElementById('projFilter');
  var search=document.getElementById('projectSearch');
  if(!toolbar || !bar || !search) return;
  var cards=Array.from(document.querySelectorAll('.proj[data-cat]'));
  var buttons=Array.from(bar.querySelectorAll('[data-filter]'));
  var selected='all';
  var reset=document.getElementById('resetFilters');
  var status=document.getElementById('projectStatus');
  var empty=document.getElementById('projectEmpty');
  var groups=document.querySelectorAll('[data-project-group]');
  var savedOnly=document.getElementById('savedOnly');
  var feedback=document.getElementById('archiveFeedback');
  var comparison=document.getElementById('compareDialog');
  var tray=document.getElementById('compareTray');
  var openComparison=document.getElementById('openComparison');
  var compareIds=new Set();
  var storageKey='portfolio-saved-projects';
  var storageAvailable=true;
  function node(tag,className,text){var el=document.createElement(tag);if(className)el.className=className;if(text)el.textContent=text;return el;}
  var index=cards.map(function(card){
    return {element:card,id:card.getAttribute('href'),categories:card.dataset.cat.split(/\s+/),
      text:card.textContent.toLowerCase().replace(/\s+/g,' '),
      title:card.querySelector('.proj-title').textContent.trim(),
      summary:card.querySelector('.proj-desc').textContent.replace(/\s+/g,' ').trim(),
      tags:Array.from(card.querySelectorAll('.tag')).map(function(t){return t.textContent.trim();}),
      evidence:Array.from(card.querySelectorAll('.proj-impact-item')).map(function(item){
        return Array.from(item.querySelectorAll('.proj-impact-val, .proj-impact-label')).map(function(part){return part.textContent.replace(/\s+/g,' ').trim();}).join(' — ');
      })};
  });
  function readSaved(){
    try {
      var data=JSON.parse(localStorage.getItem(storageKey) || '[]');
      return new Set(Array.isArray(data)?data.filter(function(id){return index.some(function(item){return item.id===id;});}):[]);
    } catch (_) { return new Set(); }
  }
  var saved=readSaved();
  function persistSaved(){
    try {localStorage.setItem(storageKey,JSON.stringify(Array.from(saved)));}
    catch(_){storageAvailable=false;document.getElementById('savedNote').textContent='Saved for this visit';}
  }
  function syncControls(){
    index.forEach(function(item){
      var isSaved=saved.has(item.id),isCompared=compareIds.has(item.id);
      item.save.setAttribute('aria-pressed',String(isSaved));item.save.textContent=isSaved?'★ Saved':'☆ Save';
      if(item.compare){item.compare.setAttribute('aria-pressed',String(isCompared));item.compare.textContent=isCompared?'✓ Selected':'+ Compare';item.compare.disabled=!isCompared&&compareIds.size>=3;}
    });
    document.getElementById('savedCount').textContent=saved.size;
    tray.hidden=compareIds.size===0;
    document.getElementById('compareCount').textContent=compareIds.size+' project'+(compareIds.size===1?'':'s')+' selected';
    openComparison.disabled=compareIds.size<2;
  }
  index.forEach(function(item){
    var wrapper=node('div','project-entry'+(item.element.classList.contains('proj-featured')?' entry-featured':item.element.classList.contains('proj-half')?' entry-half':''));
    item.element.before(wrapper);wrapper.append(item.element);item.container=wrapper;
    var actions=node('div','project-actions');actions.setAttribute('role','group');actions.setAttribute('aria-label','Actions for '+item.title);
    item.save=node('button','','☆ Save');item.save.type='button';item.save.dataset.save=item.id;
    item.save.setAttribute('aria-label','Save '+item.title);item.save.setAttribute('aria-pressed','false');
    item.save.addEventListener('click',function(){
      if(saved.has(item.id))saved.delete(item.id);else saved.add(item.id);
      persistSaved();apply();
      feedback.textContent=(saved.has(item.id)?'Project saved.':'Project removed from saved.')+(storageAvailable?'':' Saved choices are available for this visit only.');
      if(savedOnly.checked && !saved.has(item.id)) savedOnly.focus();
    });
    actions.append(item.save);
    if(typeof comparison.showModal==='function'){
      item.compare=node('button','','+ Compare');item.compare.type='button';item.compare.dataset.compare=item.id;
      item.compare.setAttribute('aria-label','Compare '+item.title);item.compare.setAttribute('aria-pressed','false');
      item.compare.addEventListener('click',function(){
        if(compareIds.has(item.id))compareIds.delete(item.id);else if(compareIds.size<3)compareIds.add(item.id);
        syncControls();
        feedback.textContent=compareIds.size===3?'Three projects selected. Remove one to choose another.':compareIds.size+' selected for comparison.';
      });actions.append(item.compare);
    }
    wrapper.append(actions);
  });
  buttons.forEach(function(button){
    var category=button.dataset.filter;
    button.querySelector('.chip-n').textContent=index.filter(function(item){return category==='all'||item.categories.includes(category);}).length;
  });
  function readUrl(){
    var params=new URLSearchParams(location.search);
    search.value=params.get('q')||'';
    var category=params.get('category');selected=buttons.some(function(b){return b.dataset.filter===category;})?category:'all';
  }
  function updateUrl(){
    var url=new URL(location.href);
    if(search.value.trim())url.searchParams.set('q',search.value.trim());else url.searchParams.delete('q');
    if(selected!=='all')url.searchParams.set('category',selected);else url.searchParams.delete('category');
    // file:// previews and restrictive browser settings may block history writes.
    try {history.replaceState(null,'',url);}catch(_){}
    document.getElementById('shareUrl').value=url.href;
  }
  function apply(){
    var words=search.value.toLowerCase().trim().split(/\s+/).filter(Boolean),shown=0;
    index.forEach(function(item){
      var matches=(selected==='all'||item.categories.includes(selected))&&words.every(function(word){return item.text.includes(word);})&&(!savedOnly.checked||saved.has(item.id));
      item.container.hidden=!matches;item.element.hidden=!matches;if(matches)shown++;
    });
    buttons.forEach(function(button){var active=button.dataset.filter===selected;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
    groups.forEach(function(group){group.hidden=!Array.from(group.querySelectorAll('.proj[data-cat]')).some(function(card){return !card.hidden;});});
    document.getElementById('projCount').textContent=shown;
    status.textContent='Showing '+shown+' of '+cards.length+' projects';
    empty.hidden=shown!==0;reset.hidden=selected==='all'&&!search.value&&!savedOnly.checked;
    empty.querySelector('h3').textContent=savedOnly.checked&&saved.size===0?'No saved projects yet':'No matching projects';
    empty.querySelector('p').textContent=savedOnly.checked&&saved.size===0?'Turn off Saved only to explore the archive, then save a project to return to it later.':'Try another skill or keyword, choose a different category, or reset the filters.';
    syncControls();updateUrl();
  }
  bar.addEventListener('click',function(event){var button=event.target.closest('[data-filter]');if(!button||!bar.contains(button))return;selected=button.dataset.filter;apply();});
  search.addEventListener('input',apply);savedOnly.addEventListener('change',apply);
  reset.addEventListener('click',function(){search.value='';selected='all';savedOnly.checked=false;apply();search.focus();});
  window.addEventListener('popstate',function(){readUrl();apply();});
  window.addEventListener('storage',function(event){if(event.key===storageKey||event.key===null){saved=readSaved();apply();}});

  document.getElementById('shareSearch').addEventListener('click',async function(){
    updateUrl();var fallback=document.getElementById('shareFallback'),field=document.getElementById('shareUrl');
    try {
      await navigator.clipboard.writeText(field.value);fallback.hidden=true;
      feedback.textContent='Search link copied.'+(savedOnly.checked?' Saved choices stay in this browser; the link shares keywords and category.':'');
    } catch(_) {
      fallback.hidden=false;field.focus();field.select();
      feedback.textContent='Copy the link above to share these keywords and category. Saved choices stay in this browser.';
    }
  });

  function renderComparison(){
    var items=index.filter(function(item){return compareIds.has(item.id);});
    var table=document.getElementById('comparisonTable');table.replaceChildren();
    var caption=node('caption','sr-only','Selected project case studies');table.append(caption);
    var head=node('thead'),headRow=node('tr'),corner=node('th','','Project');corner.scope='col';headRow.append(corner);
    items.forEach(function(item){
      var th=node('th');th.scope='col';var link=node('a','',item.title+' ↗');link.href=item.id;
      var remove=node('button','','Remove');remove.type='button';remove.dataset.removeCompare=item.id;remove.setAttribute('aria-label','Remove '+item.title+' from comparison');
      remove.addEventListener('click',function(){
        compareIds.delete(item.id);syncControls();
        if(!compareIds.size){comparison.close();return;}
        renderComparison();comparison.querySelector('[data-remove-compare]').focus();
      });th.append(link,remove);headRow.append(th);
    });head.append(headRow);table.append(head);
    var body=node('tbody');
    [['Summary','summary'],['Methods & tools','tags'],['Evidence in the case study','evidence']].forEach(function(row){
      var tr=node('tr'),label=node('th','',row[0]);label.scope='row';tr.append(label);
      items.forEach(function(item){
        var td=node('td');if(Array.isArray(item[row[1]])){var ul=node('ul');item[row[1]].forEach(function(text){ul.append(node('li','',text));});td.append(ul);}else td.textContent=item[row[1]];
        tr.append(td);
      });body.append(tr);
    });table.append(body);
  }
  openComparison.addEventListener('click',function(){if(compareIds.size<2)return;renderComparison();comparison.showModal();});
  document.getElementById('closeComparison').addEventListener('click',function(){comparison.close();});
  function focusVisibleProject(){
    var visible=index.find(function(item){return !item.container.hidden && item.compare && !item.compare.disabled;});
    if(visible)visible.compare.focus();else search.focus();
  }
  document.getElementById('clearComparison').addEventListener('click',function(){compareIds.clear();syncControls();focusVisibleProject();});
  comparison.addEventListener('close',function(){
    if(compareIds.size>=2)openComparison.focus();else if(compareIds.size)document.getElementById('clearComparison').focus();else focusVisibleProject();
  });
  readUrl();toolbar.hidden=false;apply();
}());
