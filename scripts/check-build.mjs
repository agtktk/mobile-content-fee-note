import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {site} from '../src/data/site.ts';
import {contentEntries} from './content-utils.mjs';
import {isPublished} from '../src/lib/publication.ts';
const origin='https://'+JSON.parse(fs.readFileSync('package.json','utf8')).name+'.pages.dev';
const preview=process.env.SITE_PREVIEW==='true'||(process.env.CF_PAGES==='1'&&process.env.CF_PAGES_BRANCH!=='main');
fs.writeFileSync('dist/sitemap-index.xml',`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${origin}/sitemap.xml</loc></sitemap></sitemapindex>`);
fs.writeFileSync('dist/_headers',`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n/search/*\n  X-Robots-Tag: noindex, follow\n/404.html\n  X-Robots-Tag: noindex, follow\nhttps://:preview.${new URL(origin).hostname}/*\n  X-Robots-Tag: noindex, follow\n${preview?'/*\n  X-Robots-Tag: noindex, follow\n':''}`);
const files=fs.readdirSync('dist',{recursive:true}).filter(f=>String(f).endsWith('.html'));
const titles=new Set(),descriptions=new Set(),routes=new Map();let linkCount=0;
for(const file of files){
 const $=load(fs.readFileSync(path.join('dist',file),'utf8'));const route=file==='404.html'?'/404/':'/'+String(file).replaceAll('\\','/').replace(/index\.html$/,'');routes.set(route,$);
 assert.equal($('h1').length,1,route);assert.equal($('html').attr('lang'),'ko');
 const title=$('title').text(),description=$('meta[name="description"]').attr('content');assert(title&&description,route);assert(!titles.has(title),'Duplicate title '+route);assert(!descriptions.has(description),'Duplicate description '+route);titles.add(title);descriptions.add(description);
 assert.equal($('link[rel="canonical"]').attr('href'),origin+route,route);
 assert.equal($('meta[name="robots"]').attr('content').includes('noindex'),preview||route==='/search/'||route==='/404/',route);
 assert.equal($('meta[name$="site-verification"]').length,0,'Unprovided verification token');
 for(const script of $('script[type="application/ld+json"]').toArray())for(const s of JSON.parse($(script).text())){assert.notEqual(s['@type'],'FAQPage');if(s['@type']==='Article'){assert.equal(s.headline,$('h1').text());assert.equal(s.dateModified.slice(0,10),$('.article-meta time').last().attr('datetime'));}}
}
for(const [route,$] of routes)for(const a of $('a[href]').toArray()){
 const href=$(a).attr('href');if(href.startsWith('tel:'))assert.equal(href,'tel:01081111555');
 if($(a).attr('target')==='_blank')assert($(a).attr('rel').includes('noopener'));
 if(!href.startsWith('/')&&!href.startsWith('#'))continue;
 const u=new URL(href,origin+route);const target=u.pathname==='/404/'?'dist/404.html':path.join('dist',u.pathname,u.pathname.endsWith('/')?'index.html':'');
 assert(fs.existsSync(target),'Broken '+route+' -> '+href);linkCount++;
 if(u.hash){const targetDoc=routes.get(u.pathname);assert(targetDoc&&targetDoc('[id]').toArray().some(e=>targetDoc(e).attr('id')===decodeURIComponent(u.hash.slice(1))),'Broken anchor '+href);}
}
const xml=load(fs.readFileSync('dist/sitemap.xml','utf8'),{xmlMode:true}),feed=load(fs.readFileSync('dist/rss.xml','utf8'),{xmlMode:true});
const listed=xml('url > loc').toArray().map(e=>xml(e).text());
assert.equal(new Set(listed).size,listed.length);
for(const [route] of routes)assert.equal(listed.includes(origin+route),route!='/404/'&&route!='/search/');
const records=contentEntries(),published=records.filter(a=>isPublished(a.data));assert.equal(feed('item').length,published.length);
for(const a of records){const url=origin+'/articles/'+a.id+'/';const visible=isPublished(a.data);assert.equal(listed.includes(url),visible);assert.equal(fs.existsSync('dist/articles/'+a.id+'/index.html'),visible);assert.equal(fs.readFileSync('dist/search/index.html','utf8').includes('/articles/'+a.id+'/'),visible);if(visible)assert.equal(xml('url').filter((_,e)=>xml(e).find('loc').text()===url).find('lastmod').text(),a.data.updatedAt);}
assert(fs.readFileSync('dist/robots.txt','utf8').includes(origin+'/sitemap.xml'));assert.equal(site.contact.verifiedAt,'2026-10-03');
console.log(`PASS: ${files.length} HTML, ${listed.length} sitemap URLs, ${published.length} RSS items, ${linkCount} internal links, metadata/schema/contact/publication checks.`);
