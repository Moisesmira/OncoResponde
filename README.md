# OncoResponde 4.1.0

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
