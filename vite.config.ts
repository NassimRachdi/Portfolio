import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` permet d'héberger le site dans n'importe quel sous-dossier
// (GitHub Pages, hébergement statique…) : la navigation repose sur le hash de l'URL.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5173, host: 'localhost' },
  preview: { port: 4173, host: 'localhost' },
});
