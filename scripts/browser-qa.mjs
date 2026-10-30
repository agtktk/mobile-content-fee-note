import {chromium} from 'playwright';
import {load} from 'cheerio';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.QA_URL||'http://127.0.0.1:4323';
const sitemap=load(await (await fetch(base+'/sitemap.xml')).text(),{xmlMode:true});
const paths=[...sitemap('loc').toArray().map(e=>new URL(sitemap(e).text()).pathname),'/search/'];
const browser=await chromium.launch();const context=await browser.newContext({permissions:['clipboard-read','clipboard-write']});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
let checks=0;
try{
 for(const width of [390,1440]){await page.setViewportSize({width,height:900});for(const path of paths){const r=await page.goto(base+path);assert.equal(r.status(),200,path);assert.equal(await page.locator('h1').count(),1);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow '+path);checks++;}await page.goto(base+'/');fs.mkdirSync('artifacts',{recursive:true});await page.screenshot({path:'artifacts/home-'+width+'.png',fullPage:true});}
 const article=paths.find(p=>p.startsWith('/articles/')&&p!='/articles/');await page.goto(base+article);await page.locator('summary').first().click();assert(await page.locator('details').first().getAttribute('open')!==null);
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='200%');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.goto(base+'/search/?q=存在しないXYZ');assert.equal(await page.locator('.search-item').count(),0);
 await page.locator('#query').fill('');await page.getByRole('button',{name:'검색',exact:true}).click();assert((await page.locator('.search-item').count())>0);
 await page.goto(base+'/contact/');await page.getByRole('button',{name:'누티켓 카카오톡 ID 복사'}).click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'N1348');
 const nojs=await browser.newContext({javaScriptEnabled:false});const p=await nojs.newPage();await p.goto(base+article);assert((await p.locator('#answer').textContent()).length>45);await nojs.close();
 const missing=await page.goto(base+'/missing-page/');assert.equal(missing.status(),404);assert.deepEqual(errors,[]);
 console.log(`PASS: ${checks} viewport/routes, 390px, 200% text, FAQ, search, clipboard, no-JS, 404.`);
}finally{await browser.close();}
