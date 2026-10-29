const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=(process.env.PORTFOLIO_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
(async()=>{
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||undefined,headless:true});
 const results=[],errors=[];
 try {
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await context.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
  const p=await context.newPage();p.setDefaultTimeout(1800);p.on('pageerror',e=>errors.push(e.message));
  async function check(name,fn){try{await p.goto(base);await fn();results.push({name,pass:true});}catch(e){results.push({name,pass:false,error:e.message});}}
  await check('Resume dates, current city and GitHub are accessible',async()=>{
   assert.ok((await p.locator('#about').textContent()).includes('2021–2025'));
   assert.ok((await p.locator('.hero-meta').textContent()).includes('Coimbatore'));
   assert.ok(await p.locator('a[href="https://github.com/Bala-Shunmugam-M"]').count()>0);
   assert.equal((await p.request.get(base+'/Bala_Shunmugam_resume.pdf')).status(),200);
   await p.getByRole('link',{name:'View résumé',exact:true}).click();assert.ok(p.url().endsWith('.pdf'));
  });
  await check('Career journey reveals internship evidence',async()=>{
   await p.locator('#agniExperience summary').click();
   assert.equal(await p.locator('#agniExperience').getAttribute('open'),'');
   assert.ok((await p.locator('#agniExperience').textContent()).includes('shift logs'));
  });
  await check('Inventory demo calculates EOQ and reorder point with documented units',async()=>{
   assert.equal(await p.locator('#eoqValue').textContent(),'849');
   assert.equal(await p.locator('#ropValue').textContent(),'240');
   await p.getByLabel('Monthly demand (units)').fill('1200');
   assert.equal(await p.locator('#eoqValue').textContent(),'1,200');
   assert.equal(await p.locator('#ropValue').textContent(),'480');
   await p.getByRole('button',{name:'Reset example'}).click();
   assert.equal(await p.locator('#eoqValue').textContent(),'849');
  });
  await check('Same-page quick navigation dismisses the dialog',async()=>{
   await p.goto(base+'/index.html');await p.getByRole('button',{name:'Quick navigation',exact:true}).click();
   await p.getByRole('searchbox',{name:'Search pages and projects'}).fill('Career journey');
   await p.locator('#commandResults a').click();
   assert.equal(await p.locator('#commandDialog').isVisible(),false);
   assert.equal(new URL(p.url()).hash,'#career');
  });
  await check('Reorder rounding is exact and large valid inputs fit mobile',async()=>{
   await p.getByLabel('Monthly demand (units)').fill('7');
   await p.getByLabel('Lead time (working days)').fill('22');
   assert.equal(await p.locator('#ropValue').textContent(),'7');
   await p.setViewportSize({width:360,height:800});
   await p.getByLabel('Monthly demand (units)').fill('100000');
   await p.getByLabel('Cost per order (₹)').fill('100000');
   await p.getByLabel('Annual holding cost per unit (₹)').fill('1');
   await p.getByLabel('Lead time (working days)').fill('90');
   assert.equal(await p.locator('#eoqValue').textContent(),'4,89,898');
   assert.equal(await p.locator('#ropValue').textContent(),'3,72,000');
   assert.ok(await p.locator('#eoqValue').evaluate(e=>e.scrollWidth<=e.clientWidth));
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await p.getByLabel('Lead time (working days)').fill('91');
   assert.equal(await p.locator('#labResults').isVisible(),false);
  });
  await check('Invalid inventory inputs show guidance and do not leave stale results',async()=>{
   await p.getByLabel('Annual holding cost per unit (₹)').fill('0');
   assert.equal(await p.locator('#labResults').isVisible(),false);
   assert.ok((await p.locator('#labStatus').textContent()).includes('between'));
   await p.getByRole('button',{name:'Reset example'}).click();
   assert.equal(await p.locator('#labResults').isVisible(),true);
   await p.getByLabel('Monthly demand (units)').fill('');
   assert.equal(await p.locator('#labResults').isVisible(),false);
  });
  await check('Image viewer closes with Escape and returns focus',async()=>{
   const button=p.getByRole('button',{name:'Enlarge InventoryIQ dashboard'});
   await button.click();assert.equal(await p.locator('#imageDialog').isVisible(),true);
   assert.ok((await p.locator('#imageCaption').textContent()).includes('sample'));
   await p.keyboard.press('Escape');assert.equal(await button.evaluate(e=>e===document.activeElement),true);
  });
  await check('Email copy handles success and clipboard refusal',async()=>{
   await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async t=>{window.copiedEmail=t;}},configurable:true}));
   await p.getByRole('button',{name:'Copy email address'}).click();
   assert.equal(await p.evaluate(()=>window.copiedEmail),'balashunmugamruthran@gmail.com');
   assert.equal(await p.locator('#copyEmailStatus').textContent(),'Email address copied.');
   await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))},configurable:true}));
   await p.getByRole('button',{name:'Copy email address'}).click();
   assert.equal(await p.getByLabel('Email address to copy').inputValue(),'balashunmugamruthran@gmail.com');
  });
  await check('Career features fit mobile and dark mode',async()=>{
   await p.setViewportSize({width:360,height:800});await p.locator('#themeToggle').click();
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await p.getByRole('button',{name:'Enlarge InventoryIQ dashboard'}).click();
   const box=await p.locator('#imageDialog').boundingBox();assert.ok(box.x>=0&&box.width<=360);
   await p.keyboard.press('Escape');
  });
  await check('No-JavaScript retains career content and direct links',async()=>{
   const c=await browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:800}});const page=await c.newPage();await page.goto(base);
   assert.equal(await page.getByRole('link',{name:'View résumé',exact:true}).isVisible(),true);
   assert.equal(await page.locator('#decisionLab').isVisible(),false);
   assert.equal(await page.locator('#agniExperience summary').isVisible(),true);await c.close();
  });
  results.push({name:'No uncaught errors',pass:errors.length===0,errors});
  const out=process.env.PORTFOLIO_TEST_OUTPUT||'test-results';fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/career-results.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));process.exitCode=results.some(r=>!r.pass)?1:0;
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
