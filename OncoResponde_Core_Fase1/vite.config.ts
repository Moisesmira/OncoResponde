import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  plugins:[react(),VitePWA({registerType:'autoUpdate',includeAssets:['assets/camino.png'],manifest:{name:'OncoResponde',short_name:'OncoResponde',description:'Información que acompaña',theme_color:'#0f4c81',background_color:'#f4f8fb',display:'standalone',start_url:'/',icons:[{src:'assets/camino.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}]}})],
  build:{outDir:'dist'}
});
