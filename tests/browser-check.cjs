const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8000';
const baseline = process.argv.includes('--baseline');
const outputDir = path.resolve(process.env.PORTFOLIO_TEST_OUTPUT || 'test-results');
fs.mkdirSync(outputDir, {recursive:true});
(async () => {
  const browser = await chromium.launch({channel:process.env.BROWSER_CHANNEL || undefined, headless:true});
  try {
  const context = await browser.newContext({viewport:{width:1440,height:1000}, reducedMotion:'reduce'});
  // Keep tests deterministic and check that the site works without its CDNs.
  await context.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const results = [];
  async function check(name, fn) {
    try { await fn(); results.push({name,pass:true}); }
    catch(e) { results.push({name,pass:false,error:e.message.split('\n')[0]}); }
  }
  page.setDefaultTimeout(3000);
  await page.goto(base, {waitUntil:'networkidle'});
  await page.screenshot({path:path.join(outputDir,baseline?'before-home.png':'after-home.png'),fullPage:false});
  await page.setViewportSize({width:390,height:844});
  await check('Mobile navigation opens and closes with accurate expanded state', async()=>{
    await page.locator('#menuToggle').click();
    assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'),'true');
    await page.locator('.nav-links a[href="#about"]').click();
    assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'),'false');
  });
  await check('Escape dismisses mobile navigation and restores focus',async()=>{
    await page.reload();
    await page.locator('#menuToggle').click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'),'false');
    assert.equal(await page.locator('#menuToggle').evaluate(el=>el===document.activeElement),true);
  });
  await check('Outside click and desktop resize close the mobile menu',async()=>{
    await page.locator('#menuToggle').click();
    await page.locator('.hero-stat').first().click();
    assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'),'false');
    await page.locator('#menuToggle').click();
    await page.setViewportSize({width:1440,height:1000});
    await page.waitForFunction(()=>document.getElementById('menuToggle').getAttribute('aria-expanded')==='false');
  });
  await page.goto(base+'/projects.html',{waitUntil:'networkidle'});
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:path.join(outputDir,baseline?'before-projects.png':'after-projects.png'),fullPage:false});
  await check('Archive search returns WattsWorth and combines with category', async()=>{
    await page.getByRole('searchbox',{name:'Search projects'}).fill('  WATTSWORTH  ');
    assert.equal(await page.locator('.proj[data-cat]:visible').count(),1);
    await page.locator('[data-filter="vgtps"]').click();
    assert.equal(await page.locator('.proj[data-cat]:visible').count(),0);
    assert.equal(await page.locator('#projectEmpty').isVisible(),true);
    await page.getByRole('button',{name:'Reset filters'}).click();
    assert.equal(await page.locator('.proj[data-cat]:visible').count(),17);
  });
  await check('Unmatched search is recoverable and empty query shows all projects',async()=>{
    const search=page.getByRole('searchbox',{name:'Search projects'});
    await search.fill('zz-no-such-project-zz');
    assert.equal(await page.locator('.proj[data-cat]:visible').count(),0);
    await search.fill('');
    assert.equal(await page.locator('.proj[data-cat]:visible').count(),17);
  });
  await check('Multiword search and result count stay consistent',async()=>{
    await page.getByRole('searchbox').fill('  market   basket  ');
    assert.equal(await page.locator('.proj[data-cat]:visible').count(),1);
    assert.match(await page.locator('.proj[data-cat]:visible').textContent(),/Apriori/);
    assert.equal(await page.locator('#projectStatus').textContent(),'Showing 1 of 17 projects');
    await page.getByRole('button',{name:'Reset filters'}).click();
  });
  await check('Theme choice persists across page navigation',async()=>{
    await page.locator('#themeToggle').click();
    const chosen=await page.locator('html').getAttribute('data-theme');
    await page.goto(base);
    assert.equal(await page.locator('html').getAttribute('data-theme'),chosen);
  });
  await check('Homepage and archive fit narrow screens',async()=>{
    for (const file of ['index.html','projects.html']) {
      await page.setViewportSize({width:360,height:800});
      await page.goto(base+'/'+file);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),file+' overflows');
    }
  });
  await check('Homepage content is visible without JavaScript',async()=>{
    const noJs=await browser.newContext({javaScriptEnabled:false,viewport:{width:1280,height:800}});
    const p=await noJs.newPage();
    await p.goto(base);
    assert.equal(await p.locator('.about-text').evaluate(el=>Number(getComputedStyle(el).opacity)),1);
    await p.setViewportSize({width:390,height:844});
    assert.equal(await p.locator('.nav-links a[href="#about"]').isVisible(),true);
    await noJs.close();
  });
  await check('Touch devices retain content and skip the WebGL hero',async()=>{
    const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const p=await touch.newPage();
    await p.goto(base,{waitUntil:'networkidle'});
    await p.waitForFunction(()=>getComputedStyle(document.querySelector('.hero-title')).opacity==='1');
    assert.equal(await p.locator('.hero-canvas').count(),0);
    await p.screenshot({path:path.join(outputDir,'portfolio-mobile.png')});
    await touch.close();
  });
  await check('No uncaught browser errors',async()=>assert.deepEqual(errors,[]));
  fs.writeFileSync(path.join(outputDir,baseline?'baseline-results.json':'test-results.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  process.exitCode=results.some(r=>!r.pass)?1:0;
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});

