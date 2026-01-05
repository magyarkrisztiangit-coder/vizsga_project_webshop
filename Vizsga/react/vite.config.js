import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Biztosítjuk, hogy a build kimenetek kiszámítható mappába és fájlnevekkel kerüljenek,
  // így a `Vizsga/index.html` közvetlenül hivatkozhat rájuk.
  base: './',
  build: {
  // helyezzük a build kimenetet a `react` mappával egy szintre (a `react` mellett)
    outDir: '../react-dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      // A beviteli fájl neve (index2.html) megadása azért, mert a sablon az
      // `index2.html`-t használja alapértelmezetten. Így a build megtalálja a
      // belépési pontot anélkül, hogy át kellene nevezni a fájlt.
      input: 'index2.html',
      output: {
        entryFileNames: 'assets/main.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
})
