const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=(process.env.PORTFOLIO_URL || 'http://127.0.0.1:8000').replace(/\/$/,'');
const outputDir=process.env.PORTFOLIO_TEST_OUTPUT || 'test-results';
fs.mkdirSync(outputDir,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL || undefined,headless:true});
 try {
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await context.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
  const p=await context.newPage();p.setDefaultTimeout(2500);
  const results=[],errors=[];p.on('pageerror',e=>errors.push(e.message));
  async function check(name,fn){try{await fn();results.push({name,pass:true});}catch(e){results.push({name,pass:false,error:e.message});}}
  await check('Quick navigation searches projects and Escape restores focus',async()=>{
   await p.goto(base);await p.getByRole('button',{name:'Quick navigation',exact:true}).click();
   await p.getByRole('searchbox',{name:'Search pages and projects'}).fill('wattsworth');
   assert.equal(await p.locator('#commandResults a').count(),1);
   await p.keyboard.press('ArrowDown');assert.equal(await p.locator('#commandResults a').evaluate(e=>e===document.activeElement),true);
   await p.keyboard.press('Escape');assert.equal(await p.locator('#commandDialog').isVisible(),false);
   assert.equal(await p.getByRole('button',{name:'Quick navigation',exact:true}).evaluate(e=>e===document.activeElement),true);
  });
  await check('Keyboard shortcut and no-match state work',async()=>{
   await p.goto(base);await p.keyboard.press('Control+k');
   await p.getByRole('searchbox',{name:'Search pages and projects'}).fill('zzzz-no-page');
   assert.equal(await p.locator('#commandResults a').count(),0);
   assert.equal(await p.locator('#commandEmpty').isVisible(),true);await p.keyboard.press('Escape');
  });
  await check('Homepage focus explorer switches to real analytics projects',async()=>{
   await p.goto(base);await p.getByRole('button',{name:'Analytics & ML',exact:true}).click();
   assert.equal(await p.locator('#focusResults a').count(),3);
   assert.ok((await p.locator('#focusResults').textContent()).includes('Customer Segmentation'));
  });
  await check('Saved projects persist and saved-only filtering can be cleared',async()=>{
   await p.goto(base+'/projects.html');await p.locator('[data-save="project-13.html"]').click();
   await p.reload();assert.equal(await p.locator('[data-save="project-13.html"]').getAttribute('aria-pressed'),'true');
   await p.getByLabel('Saved only').check();assert.equal(await p.locator('.proj[data-cat]:visible').count(),1);
   await p.locator('[data-save="project-13.html"]').click();assert.equal(await p.locator('.proj[data-cat]:visible').count(),0);
   await p.getByRole('button',{name:'Reset filters',exact:true}).click();assert.equal(await p.locator('.proj[data-cat]:visible').count(),17);
  });
  await check('Comparison is capped at three and can remove or clear selections',async()=>{
   await p.goto(base+'/projects.html');
   for(const id of ['13','07','02']) await p.locator('[data-compare="project-'+id+'.html"]').click();
   assert.equal(await p.locator('[data-compare="project-08.html"]').isDisabled(),true);
   await p.getByRole('button',{name:'Compare selected projects'}).click();
   assert.equal(await p.locator('#compareDialog').isVisible(),true);
   assert.equal(await p.locator('#comparisonTable thead th[scope="col"]').count(),4);
   await p.locator('[data-remove-compare="project-07.html"]').click();
   assert.equal(await p.locator('#comparisonTable thead th[scope="col"]').count(),3);
   await p.keyboard.press('Escape');await p.getByRole('button',{name:'Clear comparison'}).click();
   assert.equal(await p.locator('#compareTray').isVisible(),false);
  });
  await check('Comparison evidence keeps values separate from labels',async()=>{
   await p.goto(base+'/projects.html');
   for(const id of ['13','07']) await p.locator('[data-compare="project-'+id+'.html"]').click();
   await p.getByRole('button',{name:'Compare selected projects'}).click();
   assert.ok((await p.locator('#comparisonTable').textContent()).includes('151 — Automated tests'));
   await p.keyboard.press('Escape');
  });
  await check('Clearing a filtered comparison restores focus to a visible control',async()=>{
   await p.goto(base+'/projects.html?q=segmentation');
   await p.locator('.project-entry:visible [data-compare]').first().click();
   await p.getByRole('button',{name:'Clear comparison'}).click();
   assert.equal(await p.locator('.project-entry:visible [data-compare]').first().evaluate(el=>el===document.activeElement),true);
  });
  await check('Shared URL restores category and query',async()=>{
   await p.goto(base+'/projects.html?category=analytics&q=python');
   assert.equal(await p.getByRole('searchbox',{name:'Search projects'}).inputValue(),'python');
   assert.equal(await p.locator('[data-filter="analytics"]').getAttribute('aria-pressed'),'true');
   assert.equal(await p.locator('.proj[data-cat]:visible').count(),2);
   await p.getByRole('searchbox',{name:'Search projects'}).fill('wattsworth');
   await p.waitForURL(url=>url.searchParams.get('q')==='wattsworth');
   assert.equal(new URL(p.url()).searchParams.get('q'),'wattsworth');
  });
  await check('Clipboard rejection offers the actual share URL',async()=>{
   await p.goto(base+'/projects.html?q=wattsworth');
   await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))},configurable:true}));
   await p.getByRole('button',{name:'Share this search'}).click();
   assert.equal(await p.getByLabel('Link to this search').isVisible(),true);
   assert.equal(new URL(await p.getByLabel('Link to this search').inputValue()).searchParams.get('q'),'wattsworth');
  });
  await check('Malformed saved data recovers without crashing',async()=>{
   await p.goto(base);await p.evaluate(()=>localStorage.setItem('portfolio-saved-projects','{"invalid":true}'));
   await p.goto(base+'/projects.html');await p.locator('[data-save="project-13.html"]').click();
   assert.equal(await p.locator('[data-save="project-13.html"]').getAttribute('aria-pressed'),'true');
  });
  await check('Mobile navigation dialog fits and closes',async()=>{
   await p.setViewportSize({width:360,height:800});await p.goto(base);await p.getByRole('button',{name:'Quick navigation',exact:true}).click();
   const box=await p.locator('#commandDialog').boundingBox();assert.ok(box.width<=360&&box.x>=0);
   await p.getByRole('button',{name:'Close quick navigation'}).click();assert.equal(await p.locator('#commandDialog').isVisible(),false);
  });
  await check('Blocked browser storage keeps saves usable for this visit',async()=>{
   const restricted=await browser.newContext({reducedMotion:'reduce'});
   const page=await restricted.newPage();
   await page.addInitScript(()=>Object.defineProperty(Storage.prototype,'setItem',{value(){throw new DOMException('Blocked','SecurityError');}}));
   await page.goto(base+'/projects.html');await page.locator('[data-save="project-07.html"]').click();
   await page.getByLabel('Saved only').check();
   assert.equal(await page.locator('.proj[data-cat]:visible').count(),1);
   assert.equal(await page.locator('#savedNote').textContent(),'Saved for this visit');
   await restricted.close();
  });
  await check('Unknown category and unusual query remain safe and recoverable',async()=>{
   await p.goto(base+'/projects.html?category=not-real&q=%3Csvg%20onload%3Dalert(1)%3E');
   assert.equal(await p.locator('[data-filter="all"]').getAttribute('aria-pressed'),'true');
   assert.equal(await p.locator('.proj[data-cat]:visible').count(),0);
   await p.getByRole('button',{name:'Reset filters',exact:true}).click();
   assert.equal(await p.locator('.proj[data-cat]:visible').count(),17);
  });
  await check('Comparison remains usable within a narrow viewport',async()=>{
   await p.setViewportSize({width:360,height:800});await p.goto(base+'/projects.html');
   await p.locator('[data-compare="project-13.html"]').click();
   assert.equal(await p.getByRole('button',{name:'Compare selected projects'}).isDisabled(),true);
   await p.locator('[data-compare="project-07.html"]').click();
   await p.getByRole('button',{name:'Compare selected projects'}).click();
   const box=await p.locator('#compareDialog').boundingBox();assert.ok(box.x>=0&&box.width<=360);
   assert.ok(await p.locator('.compare-scroll').evaluate(el=>el.scrollWidth>el.clientWidth));
   await p.keyboard.press('Escape');assert.equal(await p.locator('#compareDialog').isVisible(),false);
  });
  await check('No uncaught browser errors',async()=>assert.deepEqual(errors,[]));
  fs.writeFileSync(require('node:path').join(outputDir,'interactive-results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
  process.exitCode=results.some(x=>!x.pass)?1:0;
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
