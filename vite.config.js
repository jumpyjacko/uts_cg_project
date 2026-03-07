import { defineConfig } from 'vite';

export default defineConfig({
    base: process.env.GITHUB_ACTIONS ? '/uts_cg_project/' : '/',
})
