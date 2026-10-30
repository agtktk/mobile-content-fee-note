export function isPublished(data: {draft:boolean;publishedAt:string}, now = new Date()) {
  return !data.draft && new Date(data.publishedAt+'T00:00:00+09:00').getTime() <= now.getTime();
}
