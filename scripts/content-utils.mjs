import {readFileSync,readdirSync} from 'node:fs';
import {parse} from 'yaml';
export function contentEntries(){return readdirSync('src/content/articles').filter(f=>/\.(md|mdx)$/.test(f)).map(file=>{
 const text=readFileSync('src/content/articles/'+file,'utf8');
 const match=text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
 if(!match)throw new Error('Invalid frontmatter: '+file);
 return {id:file.replace(/\.(md|mdx)$/,''),data:parse(match[1]),body:match[2]};
});}
