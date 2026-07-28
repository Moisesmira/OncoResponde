# Voz natural — OncoResponde 3.2.7

La lectura de las respuestas de «Háblame» utiliza ahora una voz neuronal generada mediante la función Netlify `voz.mjs`.

## Funcionamiento

- Voz principal: adulta, cálida, serena y cercana.
- Ritmo pausado y conversacional.
- Controles de pausa, continuación y detención.
- Aviso transparente: «Voz generada por inteligencia artificial».
- Respaldo automático: si el servicio no está disponible, se utiliza la mejor voz española instalada en el dispositivo.

## Configuración

Utiliza la misma variable de entorno `OPENAI_API_KEY` que ya emplea la función de consultas. No es necesario añadir una nueva clave.
