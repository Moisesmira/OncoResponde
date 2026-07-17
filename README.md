# OncoResponde 3.0

Reconstrucción limpia de la aplicación React + TypeScript + Vite para GitHub y Netlify.

## Incluye

- Pantalla Hoy estable.
- Perfil oncológico opcional («Cuéntame lo que sabes de tu cáncer»).
- Más allá del tratamiento: alimentación, ejercicio, respiración, sueño, mindfulness, bienestar emocional y comunicación.
- Ejercicio de respiración guiada.
- Consulta mediante Netlify Function y OpenAI.
- PWA instalable sin depender de plugins pesados.
- Configuración de Node 20 y registro público de npm.

## Despliegue en Netlify

- Base directory: vacío.
- Build command: `npm run build`.
- Publish directory: `dist`.
- Functions directory: `netlify/functions`.
- Variable necesaria para la IA: `OPENAI_API_KEY`.

El proyecto incluye `package-lock.json` con enlaces al registro público de npm y `.npmrc` para evitar registros privados.
