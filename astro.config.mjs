import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';
export default defineConfig({site:'https://mobile-content-fee-note.pages.dev',output:'static',trailingSlash:'always',integrations:[mdx()],devToolbar:{enabled:false}});
