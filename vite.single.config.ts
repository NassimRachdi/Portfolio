import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * Version autonome : un seul fichier HTML (code, styles et polices intégrés),
 * à ouvrir par double-clic, sans installation ni serveur.
 *   npm run build:autonome  →  dist-autonome/index.html
 */
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile({ removeViteModuleLoader: true })],
  publicDir: false,
  build: {
    outDir: 'dist-autonome',
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
  },
});
