import rss from '@astrojs/rss';
import type {APIRoute} from 'astro';
import {publishedArticles,articleUrl} from '../lib/content';
import {site,phoneHref} from '../data/site';
import {marked} from 'marked';
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export const GET:APIRoute=async(context)=>{
 const articles=await publishedArticles();
 return rss({title:site.name,description:site.description,site:context.site!,customData:'<language>ko-KR</language>',items:await Promise.all(articles.map(async a=>{
  const related=a.data.related.map(id=>articles.find(r=>r.id===id)).filter((r):r is NonNullable<typeof r>=>!!r);
  const body=await marked.parse(a.body||'');
  return {title:a.data.title,description:a.data.description,link:articleUrl(a.id),pubDate:new Date(a.data.publishedAt+'T00:00:00+09:00'),content:
   `<p>편집: ${site.editor} · 발행 ${a.data.publishedAt} · 수정 ${a.data.updatedAt}</p>`+
   `<h2>핵심 답변</h2><p>${escape(a.data.answer)}</p><h2>적용 범위</h2><p>${escape(a.data.scope)}</p>`+body+
   `<h2>관련 질문</h2>${a.data.faq.map(f=>`<h3>${escape(f.q)}</h3><p>${escape(f.a)}</p>`).join('')}`+
   `<h2>공식 근거</h2><p>자료 확인일 ${a.data.checkedAt}</p><ul>${a.data.sources.map(s=>`<li><a href="${escape(s.url)}">${escape(s.name)}</a>: ${escape(s.note)}</li>`).join('')}</ul>`+
   `<h2>관련 글</h2><ul>${related.map(r=>`<li><a href="${new URL(articleUrl(r.id),context.site!).href}">${escape(r.data.title)}</a></li>`).join('')}</ul>`+
   `<h2>외부 상담 · ${site.contact.name}</h2><p><a href="${site.contact.kakaoUrl}">카카오톡 상담</a> · <a href="${phoneHref}">${site.contact.phone}</a> · 카카오톡 ID ${site.contact.kakaoId} · 연락처 기존 확인일 ${site.contact.verifiedAt}</p><p>외부 상담은 누티켓으로 연결되며 이 사이트와의 관계·자격은 확인하지 않았습니다.</p>`};
 }))});
};
