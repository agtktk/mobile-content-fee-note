import type {APIRoute} from 'astro';
import {publishedArticles,articleUrl} from '../lib/content';
import {site as settings} from '../data/site';
export const GET:APIRoute=async({site})=>{const articles=await publishedArticles();const pages:{path:string;date:string}[]=['/','/guide/','/topics/','/topics/basics/','/articles/','/about/','/contact/','/privacy/'].map(path=>({path,date:settings.updatedAt}));pages.push(...articles.map(a=>({path:articleUrl(a.id),date:a.data.updatedAt})));return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pages.map(p=>'<url><loc>'+new URL(p.path,site).href+'</loc><lastmod>'+p.date+'</lastmod></url>').join('')+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8'}});};
