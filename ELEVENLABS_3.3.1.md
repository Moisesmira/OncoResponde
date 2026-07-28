# OncoResponde 3.3.1 — Selector dinámico de voces ElevenLabs

- Consulta las voces reales disponibles mediante `GET /v2/voices`.
- Filtra y prioriza voces identificadas como español de España/castellano.
- Separa voces femeninas, masculinas y sin género informado.
- Permite escuchar una muestra y guardar la voz elegida.
- La función TTS recibe el `voiceId` seleccionado; masculina y femenina ya no comparten automáticamente el mismo identificador.
- Muestra un aviso claro si la API Key carece de permisos.

## Permisos requeridos en la API Key

- Voices: Read
- Text to Speech

Solo es obligatoria `ELEVENLABS_API_KEY`. Los IDs fijos siguen siendo compatibles como respaldo.
