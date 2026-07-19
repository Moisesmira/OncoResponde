# OncoResponde 3.1.3

Aplicación web progresiva de información, educación sanitaria y acompañamiento para pacientes oncológicos y familiares.

## Versión actual

**3.1.3 — Sugerencias para iniciar una conversación en «Háblame».**

Consulta [`CHANGELOG.md`](CHANGELOG.md) para revisar todas las modificaciones.

## Actualización mediante GitHub Desktop

1. Descomprime este proyecto en la carpeta local vinculada al repositorio de OncoResponde.
2. Sustituye los archivos anteriores por los de esta versión, conservando la carpeta oculta `.git` de tu repositorio local.
3. Abre **GitHub Desktop** y selecciona el repositorio de OncoResponde.
4. Revisa los archivos modificados.
5. En **Summary**, escribe por ejemplo: `OncoResponde 3.1.3 - sugerencias en Háblame`.
6. Pulsa **Commit to main**.
7. Pulsa **Push origin**.
8. Netlify detectará el cambio y realizará un nuevo despliegue automáticamente.

No subas a Netlify el ZIP de despliegue si tu sitio ya está conectado a GitHub. En ese caso, el repositorio debe ser la fuente única de publicación.

## Desarrollo local

Requisitos: Node.js 20 o 22 y npm.

```bash
npm install
npm run dev
```

## Compilación de producción

```bash
npm run build
```

La salida se genera en la carpeta `dist`.

## Configuración de Netlify

- Comando de construcción: `npm run build`
- Directorio de publicación: `dist`
- Funciones: `netlify/functions`

El archivo `netlify.toml` ya contiene la configuración necesaria.

## Activar la IA en Netlify

1. Abre el sitio en Netlify.
2. Entra en **Site configuration → Environment variables**.
3. Crea `OPENAI_API_KEY` con tu clave privada de OpenAI.
4. Opcionalmente, configura `OPENAI_MODEL` con el modelo que utilice el proyecto.
5. Ejecuta un nuevo despliegue.

La clave se utiliza únicamente en la función de servidor `netlify/functions/consulta.mjs`; nunca debe añadirse al código del navegador ni al repositorio.

## Seguridad clínica

OncoResponde ofrece orientación general. No diagnostica, no sustituye al equipo sanitario y no recomienda iniciar, suspender o modificar tratamientos o medicación.
