const {chromium}=require('playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');
const base=(process.env.PORTFOLIO_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
(async()=>{const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||undefined,headless:true});const results=[],errors=[];
try{
 const c=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
 await c.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
 const p=await c.newPage();p.setDefaultTimeout(2200);p.on('pageerror',e=>errors.push(e.message));
 async function check(name,fn){try{await fn();results.push({name,pass:true});}catch(e){results.push({name,pass:false,error:e.message});}}
 await check('Featured work changes with buttons and keyboard while links remain correct',async()=>{
  await p.goto(base);await p.getByRole('button',{name:'Next featured project'}).click();
  assert.equal(await p.locator('.showcase-slide:visible').count(),1);
  assert.ok((await p.locator('.showcase-slide:visible').textContent()).includes('ProcessPilot'));
  await p.keyboard.press('ArrowRight');assert.ok((await p.locator('.showcase-slide:visible').textContent()).includes('Agni Steels'));
  assert.equal(await p.locator('.showcase-slide:visible a').getAttribute('href'),'project-14.html');
  await p.getByRole('button',{name:'Next featured project'}).click();assert.ok((await p.locator('.showcase-slide:visible').textContent()).includes('InventoryIQ'));
  await p.locator('.showcase-slide:visible a').focus();await p.keyboard.press('ArrowRight');
  assert.equal(await p.locator('.showcase-slide:visible a').evaluate(e=>e===document.activeElement),true);
 });
 await check('Motion can be paused and persists across pages',async()=>{
  await p.goto(base);await p.locator('#motionToggle').click();
  assert.equal(await p.locator('html').getAttribute('data-motion'),'off');
  await p.goto(base+'/projects.html');assert.equal(await p.locator('html').getAttribute('data-motion'),'off');
  await p.locator('#motionToggle').click();assert.equal(await p.locator('html').getAttribute('data-motion'),'on');
 });
 await check('System reduced motion always disables decorative motion',async()=>{
  await p.emulateMedia({reducedMotion:'reduce'});await p.goto(base);
  assert.equal(await p.locator('html').getAttribute('data-motion'),'off');
  assert.equal(await p.locator('#motionToggle').isDisabled(),true);
  await p.getByRole('button',{name:'Next featured project'}).click();
  assert.ok((await p.locator('.showcase-slide:visible').textContent()).includes('ProcessPilot'));
 });
 await check('Back-to-top is keyboard reachable and returns to page start',async()=>{
  await p.locator('#resume').scrollIntoViewIfNeeded();await p.locator('#backToTop').click();
  await p.waitForFunction(()=>scrollY<5);assert.ok(await p.evaluate(()=>scrollY<5));
 });
 await check('No-JavaScript keeps all featured work and career content available',async()=>{
  const nc=await browser.newContext({javaScriptEnabled:false});const np=await nc.newPage();await np.goto(base);
  assert.equal(await np.locator('.showcase-slide:visible').count(),3);
  assert.equal(await np.locator('#showcaseControls').isVisible(),false);await nc.close();
 });
 await check('All 13 case studies share the new theme and fit mobile',async()=>{
  await p.setViewportSize({width:390,height:844});
  for(const id of ['02','04','05','06','07','08','09','10','11','12','13','14','15']){
   await p.goto(base+'/project-'+id+'.html');
   assert.ok(await p.locator('html').evaluate(e=>e.classList.contains('studio-theme')),'missing theme '+id);
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'overflow '+id);
   assert.ok(await p.locator('h1').isVisible(),'heading hidden '+id);
  }
 });
 results.push({name:'No uncaught errors during new interactions',pass:errors.length===0,errors});
 const out=process.env.PORTFOLIO_TEST_OUTPUT||'test-results';fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/studio-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));process.exitCode=results.some(r=>!r.pass)?1:0;
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
