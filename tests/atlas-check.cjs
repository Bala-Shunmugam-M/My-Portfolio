const {chromium}=require('playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');
const base=(process.env.PORTFOLIO_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
(async()=>{const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||undefined,headless:true});const results=[],errors=[];
try{
 const c=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await c.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
 const p=await c.newPage();p.setDefaultTimeout(2500);p.on('pageerror',e=>errors.push(e.message));
 async function check(name,fn){try{await fn();results.push({name,pass:true});}catch(e){results.push({name,pass:false,error:e.message});}}
 await check('Guided introduction covers four factual chapters with correct destinations',async()=>{
  await p.goto(base);await p.locator('#openTour').click();
  assert.equal(await p.locator('#tourDialog').isVisible(),true);
  assert.match(await p.locator('#tourTitle').textContent(),/Engineering/);
  assert.equal(await p.locator('#tourPrevious').isDisabled(),true);
  await p.locator('#tourNext').click();assert.match(await p.locator('#tourTitle').textContent(),/plant floor/);
  assert.equal(await p.locator('#tourLink').getAttribute('href'),'project-14.html');
  await p.keyboard.press('ArrowRight');assert.match(await p.locator('#tourTitle').textContent(),/decisions/);
  assert.equal(await p.locator('#tourLink').getAttribute('href'),'project-07.html');
  await p.keyboard.press('ArrowRight');assert.match(await p.locator('#tourTitle').textContent(),/next/);
  await p.locator('#tourNext').click();assert.equal(await p.locator('#tourDialog').isVisible(),false);
  assert.equal(await p.locator('#openTour').evaluate(e=>e===document.activeElement),true);
 });
 await check('Tour escape restores focus, reopens at start and keeps quick navigation separate',async()=>{
  await p.locator('#openTour').click();await p.locator('#tourNext').click();await p.keyboard.press('Control+k');
  assert.equal(await p.locator('#commandDialog').isVisible(),false);await p.keyboard.press('Escape');
  assert.equal(await p.locator('#openTour').evaluate(e=>e===document.activeElement),true);
  await p.locator('#openTour').click();assert.match(await p.locator('#tourPosition').textContent(),/01/);
  await p.keyboard.press('Escape');
 });
 await check('Career choices update narrative, evidence image, skills and recommendations together',async()=>{
  for(const [key,title,href] of [['operations','Operations','project-14.html'],['analytics','Analytics','project-09.html'],['energy','Energy','project-08.html']]){
   await p.locator('[data-focus="'+key+'"]').click();
   assert.match(await p.locator('#focusEvidenceTitle').textContent(),new RegExp(title));
   assert.equal(await p.locator('#focusEvidenceLink').getAttribute('href'),href);
   assert.equal(await p.locator('#focusResults .focus-card').count(),3);
   assert.ok(await p.locator('#focusSkills li').count()>=3);
   await p.waitForFunction(()=>document.querySelector('#focusEvidenceImage').naturalWidth>0);
  }
 });
 await check('Recruiter profile has career evidence, current résumé, GitHub and print action',async()=>{
  await p.goto(base+'/profile.html');assert.match(await p.locator('h1').textContent(),/Bala Shunmugam/);
  assert.ok(await p.locator('a[href="Bala_Shunmugam_resume.pdf"]').count()>0);
  assert.ok(await p.locator('a[href="https://github.com/Bala-Shunmugam-M"]').count()>0);
  assert.equal(await p.locator('.profile-evidence a').count(),3);
  await p.evaluate(()=>{window.print=()=>{window.didPrint=true;};});await p.locator('#printProfile').click();
  assert.equal(await p.evaluate(()=>window.didPrint),true);
  await p.evaluate(()=>document.documentElement.dataset.theme='dark');
  await p.emulateMedia({media:'print'});assert.equal(await p.locator('.profile-actions').isVisible(),false);
  assert.equal(await p.locator('.profile-meta').evaluate(e=>getComputedStyle(e).color),'rgb(92, 105, 122)');
  assert.equal(await p.locator('.profile-evidence').isVisible(),true);await p.emulateMedia({media:'screen'});
 });
 await check('Tour and evidence panels fit touch screens and dark mode',async()=>{
  await p.setViewportSize({width:360,height:800});await p.goto(base);
  await p.locator('#themeToggle').click();await p.locator('#openTour').click();
  assert.ok(await p.locator('#tourDialog').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
  for(let i=0;i<3;i++)await p.locator('#tourNext').click();
  assert.equal(await p.locator('#tourLink').isVisible(),true);await p.keyboard.press('Escape');
  await p.locator('[data-focus="operations"]').click();
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await p.goto(base+'/profile.html');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 });
 await check('No JavaScript retains readable profile and hides the guided-tour trigger',async()=>{
  const nc=await browser.newContext({javaScriptEnabled:false});const np=await nc.newPage();await np.goto(base);
  assert.equal(await np.locator('#openTour').isVisible(),false);
  assert.ok(await np.locator('a[href="profile.html"]').count()>0);await np.goto(base+'/profile.html');
  assert.equal(await np.locator('.profile-evidence').isVisible(),true);assert.equal(await np.locator('#printProfile').isVisible(),false);await nc.close();
 });
 await check('New motion responds immediately to the system preference and tour boundaries retain keyboard focus',async()=>{
  await p.emulateMedia({reducedMotion:'no-preference'});await p.goto(base);await p.locator('#openTour').click();
  await p.locator('#tourNext').click();await p.locator('#tourPrevious').click();
  assert.equal(await p.locator('#tourNext').evaluate(e=>e===document.activeElement),true);
  await p.keyboard.press('Escape');
  assert.notEqual(await p.locator('.atlas-atmosphere>span').first().evaluate(e=>getComputedStyle(e).animationName),'none');
  await p.emulateMedia({reducedMotion:'reduce'});
  await p.waitForFunction(()=>document.documentElement.dataset.motion==='off');
  assert.equal(await p.locator('.atlas-atmosphere>span').first().evaluate(e=>getComputedStyle(e).animationName),'none');
 });
 results.push({name:'No uncaught errors in Atlas interactions',pass:errors.length===0,errors});
 const out=process.env.PORTFOLIO_TEST_OUTPUT||'test-results';fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/atlas-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));process.exitCode=results.some(r=>!r.pass)?1:0;
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
