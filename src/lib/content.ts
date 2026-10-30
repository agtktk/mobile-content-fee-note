import { getCollection, type CollectionEntry } from 'astro:content';
import {isPublished} from './publication';
export {isPublished} from './publication';
export async function publishedArticles():Promise<CollectionEntry<'articles'>[]> {
  return (await getCollection('articles', ({data}) => isPublished(data))).sort((a,b)=>b.data.updatedAt.localeCompare(a.data.updatedAt)||a.id.localeCompare(b.id));
}
export const articleUrl = (id:string) => `/articles/${id}/`;
export const latestDate = (items:CollectionEntry<'articles'>[], fallback:string) => items.reduce((date,a)=>a.data.updatedAt>date?a.data.updatedAt:date,fallback);
