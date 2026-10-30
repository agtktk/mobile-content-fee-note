import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {contentEntries} from './content-utils.mjs';
import {isPublished} from '../src/lib/publication.ts';
const entries=contentEntries();
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const ids=new Set(entries.map(a=>a.id));const titles=new Set();
for(const {id,data:d,body} of entries){
 assert.match(id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
 assert(!titles.has(d.title),'Duplicate title: '+id);titles.add(d.title);
 assert(d.description.length>=25 && d.answer.length>=45,'Short description or answer: '+id);
 for(const key of ['publishedAt','updatedAt','checkedAt']){assert.match(d[key],/^\d{4}-\d{2}-\d{2}$/);assert.equal(new Date(d[key]).toISOString().slice(0,10),d[key]);}
 assert((!isPublished(d)||d.updatedAt>=d.publishedAt) && d.updatedAt<=today,'Invalid modification date: '+id);
 assert(d.checkedAt<=today,'Future source check: '+id);
 assert(Array.isArray(d.related));for(const ref of d.related){assert(ids.has(ref),'Missing related '+ref);assert(ref!==id);}
 assert(d.sources.length>0);for(const s of d.sources){assert.equal(new URL(s.url).protocol,'https:');assert(s.name&&s.note);}
 assert(d.faq.length>=2);assert(!/^# /m.test(body),'Body H1: '+id);assert((body.match(/^## /gm)||[]).length>=3,'Insufficient article sections: '+id);
 assert(!body.includes(d.answer),'Repeated core answer: '+id);
}
const before=new Date('2026-10-06T14:59:59Z');const after=new Date('2026-10-06T15:00:00Z');
assert.equal(isPublished({draft:false,publishedAt:'2026-10-07'},before),false);
assert.equal(isPublished({draft:false,publishedAt:'2026-10-07'},after),true);
assert.equal(isPublished({draft:true,publishedAt:'2026-10-07'},after),false);
assert.equal(isPublished({draft:false,publishedAt:'2099-01-01'},after),false);
const config=readFileSync('src/data/site.ts','utf8');
for(const value of ['누티켓','010-8111-1555','N1348','2026-10-03','https://qr.kakao.com/talk/MBsKvshDmtamG2EuQNKdmPuGFJQ-','https://xn--od1b246c0uc.kr'])assert(config.includes(value));
console.log(`PASS: ${entries.length} article schemas, dates, related links, official sources, unique intent titles, fixed contact, draft/future & KST publication boundary.`);
