import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const articles = defineCollection({loader: glob({pattern:'**/*.{md,mdx}',base:'./src/content/articles'}), schema:z.object({
  title:z.string(), description:z.string(), topic:z.enum(['basics','google-play','troubleshooting','safety']),
  publishedAt:z.string().regex(/^\d{4}-\d{2}-\d{2}$/), updatedAt:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkedAt:z.string().regex(/^\d{4}-\d{2}-\d{2}$/), draft:z.boolean().default(false),
  answer:z.string(), scope:z.string(), keywords:z.array(z.string()), related:z.array(z.string()),
  faq:z.array(z.object({q:z.string(),a:z.string()})).min(2),
  sources:z.array(z.object({name:z.string(),url:z.url(),note:z.string()})).min(1)
})});
export const collections = { articles };
