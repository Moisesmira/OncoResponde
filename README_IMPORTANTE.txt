FIX PARA NETLIFY

Se ha eliminado package-lock.json.

Pasos:
1. Copia el contenido del ZIP al repositorio.
2. En tu ordenador, dentro del proyecto ejecuta:
   npm install
3. Esto generará un nuevo package-lock.json válido.
4. Sube también ese package-lock.json a GitHub.
5. Vuelve a desplegar en Netlify.

