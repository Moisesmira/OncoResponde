# OncoResponde 1.0 4.1.0

Aplicación web progresiva de educación sanitaria y acompañamiento para pacientes oncológicos y familiares.

## Desarrollo local

```bash
npm install
npm run dev
```

## Compilación

```bash
npm run build
```

## Activar la IA en Netlify

1. Abre el sitio en Netlify.
2. Entra en **Site configuration → Environment variables**.
3. Crea `OPENAI_API_KEY` con tu clave privada de OpenAI.
4. Opcionalmente crea `OPENAI_MODEL` con el valor `gpt-5-mini`.
5. Ejecuta un nuevo despliegue.

La clave se utiliza únicamente en la función de servidor `netlify/functions/consulta.mjs`; nunca debe añadirse al código del navegador ni al repositorio.

## Seguridad

OncoResponde ofrece orientación general. No diagnostica, no sustituye al equipo sanitario y no recomienda iniciar, suspender o modificar tratamientos o medicación.

## Corrección 4.1.2 de la consulta con OpenAI

La función de Netlify valida las respuestas vacías o no JSON, utiliza salida estructurada y devuelve mensajes claros para errores de clave, saldo/límite, tiempo de espera y despliegue. Tras actualizar, realiza un nuevo despliegue en Netlify y verifica que `OPENAI_API_KEY` esté disponible para producción.

## Versión 2.0 — Biblioteca de audio

Incluye una nueva sección «Escuchar y relajarte» con 32 cápsulas de apoyo, buscador, filtros por categoría, favoritos, historial local, recomendación según el estado de ánimo, controles de voz, valoración y enlace contextual a Háblame.

Los favoritos, el historial y las valoraciones se guardan únicamente en el dispositivo mediante almacenamiento local.
