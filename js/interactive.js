/* Local, keyboard-accessible shortcuts and a curated view of existing work. */
(function () {
  'use strict';
  var catalog = window.PortfolioCatalog || [];
  function node(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  var trigger = document.getElementById('quickNavigation');
  var dialog = document.getElementById('commandDialog');
  if (trigger && dialog && typeof dialog.showModal === 'function') {
    var input = document.getElementById('commandSearch');
    var results = document.getElementById('commandResults');
    var pages = [
      {title:'Home',href:'index.html',description:'Portfolio overview'},
      {title:'Career journey',href:'index.html#career',description:'Education and operations internship'},
      {title:'Decision lab',href:'index.html#decisionLab',description:'Interactive inventory what-if example'},
      {title:'GitHub',href:'https://github.com/Bala-Shunmugam-M',description:'Source code and public repositories'},
      {title:'About & experience',href:'index.html#about',description:'Education, journey and field experience'},
      {title:'All projects',href:'projects.html',description:'Search, save and compare case studies'},
      {title:'Software & MLOps projects',href:'index.html#softwareProjects',description:'Running application screenshots for machine learning, data management and operations'},
      {title:'Working tools',href:'index.html#tools',description:'Try the operations tools'},
      {title:'Contact Bala',href:'index.html#contact',description:'Email, phone and LinkedIn'},
      {title:'Résumé',href:'Bala_Shunmugam_resume.pdf',description:'Open the résumé PDF'}
      ,{title:'Recruiter profile',href:'profile.html',description:'Concise career overview, selected evidence, résumé and contact; print or save as PDF'}
    ].concat(catalog);
    function renderCommands() {
      var words = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      var matches = pages.filter(function (page) {
        var text = (page.title + ' ' + page.description + ' ' + (page.tags || []).join(' ')).toLowerCase();
        return words.every(function (word) { return text.includes(word); });
      });
      results.replaceChildren();
      matches.forEach(function (page) {
        var li = node('li');
        var a = node('a', 'command-result'); a.href = page.href;
        var content = node('span');
        content.append(node('strong', '', page.title), node('small', '', page.categories ? 'Project case study' : page.description));
        a.append(content, node('span', 'command-arrow', '↗'));li.append(a);results.append(li);
      });
      document.getElementById('commandEmpty').hidden = matches.length !== 0;
      document.getElementById('commandStatus').textContent = matches.length + ' destinations';
    }
    function openCommands() {
      input.value = '';renderCommands();dialog.showModal();input.focus();
    }
    trigger.hidden = false;
    trigger.addEventListener('click',openCommands);
    document.getElementById('closeCommands').addEventListener('click',function(){dialog.close();});
    input.addEventListener('input',renderCommands);
    results.addEventListener('click',function(event){
      if(event.target.closest('a'))dialog.close();
    });
    dialog.addEventListener('keydown',function(event){
      var links = Array.from(results.querySelectorAll('a'));
      var current = links.indexOf(document.activeElement);
      if (event.key === 'ArrowDown' && links.length) {
        event.preventDefault();links[(current + 1) % links.length].focus();
      } else if (event.key === 'ArrowUp' && links.length) {
        event.preventDefault();if (current <= 0) input.focus();else links[current - 1].focus();
      } else if (event.key === 'Enter' && document.activeElement === input && links.length) {
        event.preventDefault();links[0].click();
      }
    });
    document.addEventListener('keydown',function(event){
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        if (document.querySelector('dialog[open]') && !dialog.open) return;
        event.preventDefault();if(dialog.open) dialog.close();else openCommands();
      }
    });
    dialog.addEventListener('click',function(event){
      var r=dialog.getBoundingClientRect();
      if(event.target===dialog && (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)) dialog.close();
    });
  }

  var explorer = document.getElementById('focusExplorer');
  if (explorer && catalog.length) {
    var tracks = {
      energy: {ids:['project-13.html','project-02.html','project-08.html'],category:'vgtps',description:'From energy baselines to power generation and protection systems.',title:'Energy & systems',body:'An electrical engineering foundation, power-station exposure and project work in energy analysis. Explore how I connect physical systems with measurement and operational decisions.',skills:['Electrical engineering','Energy baselines','MATLAB','Measurement & verification'],image:'figures/fig2_87G_dual_slope.png',alt:'Generator differential protection dual-slope characteristic',caption:'Generator protection study · 87G dual-slope characteristic',href:'project-08.html'},
      operations: {ids:['project-07.html','project-14.html','project-06.html'],category:'frameworks',description:'Inventory decisions, plant-floor observations and process improvement.',title:'Operations & improvement',body:'Nine weeks at Agni Steels gave me a practical view of material flow, shift records and quality checks. My project work extends that learning into inventory decisions and structured improvement methods.',skills:['Process mapping','Shift-log analysis','EOQ & reorder points','Six Sigma coursework'],image:'figures/agni_sponge_plant.jpg',alt:'Material handling in the Agni Steels case study',caption:'Agni Steels · existing case-study plant image',href:'project-14.html'},
      analytics: {ids:['project-09.html','project-10.html','project-12.html'],category:'analytics',description:'Explore segmentation, prediction and multivariate analysis with R and Python.',title:'Analytics & business questions',body:'Through MBA coursework and projects, I explore how data can describe customers, test relationships and support decisions. These studies show my methods and interpretation, with the project context kept visible.',skills:['R project work','Python / pandas basics','Customer segmentation','Multivariate analysis'],image:'analytics/segmentation/dendrogram.png',alt:'Customer segmentation hierarchical clustering dendrogram',caption:'Customer segmentation · hierarchical clustering output',href:'project-09.html'}
    };
    var focusResults=document.getElementById('focusResults');
    function showTrack(key) {
      var track=tracks[key];if(!track)return;
      explorer.querySelectorAll('[data-focus]').forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.focus===key));});
      document.getElementById('focusDescription').textContent=track.description;
      var evidence=document.getElementById('focusEvidence');
      if(evidence){
        document.getElementById('focusEvidenceTitle').textContent=track.title;
        document.getElementById('focusEvidenceBody').textContent=track.body;
        var img=document.getElementById('focusEvidenceImage');img.src=track.image;img.alt=track.alt;
        document.getElementById('focusEvidenceCaption').textContent=track.caption;
        document.getElementById('focusEvidenceLink').href=track.href;
        var skills=document.getElementById('focusSkills');skills.replaceChildren();track.skills.forEach(function(skill){skills.append(node('li','',skill));});
        evidence.dataset.track=key;
        if(document.documentElement.dataset.motion==='on'&&evidence.animate){evidence.getAnimations().forEach(function(a){a.cancel();});evidence.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'ease-out'});}
      }
      focusResults.replaceChildren();
      track.ids.forEach(function(id,index){
        var project=catalog.find(function(p){return p.href===id;});if(!project)return;
        var a=node('a','focus-card');a.href=project.href;
        a.append(node('span','focus-number','0'+(index+1)),node('h3','',project.title));
        a.append(node('p','',project.tags.slice(0,3).join(' · ')),node('span','focus-link','Explore case study ↗'));
        focusResults.append(a);
      });
      document.getElementById('focusArchive').href='projects.html?category='+track.category;
    }
    explorer.addEventListener('click',function(event){var button=event.target.closest('[data-focus]');if(button)showTrack(button.dataset.focus);});
    explorer.hidden=false;showTrack('energy');
  }
}());
