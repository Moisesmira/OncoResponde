# OncoResponde 3.3.0 — ElevenLabs y castellano de España

La aplicación utiliza ahora ElevenLabs para leer las respuestas mediante una función de Netlify. La clave privada nunca se envía al navegador.

## Configuración necesaria en Netlify

En **Site configuration → Environment variables**, añade:

- `ELEVENLABS_API_KEY`: clave privada de ElevenLabs.
- `ELEVENLABS_FEMALE_VOICE_ID`: identificador de una voz femenina nativa de España.
- `ELEVENLABS_MALE_VOICE_ID`: identificador de una voz masculina nativa de España.

Variables opcionales:

- `ELEVENLABS_MODEL_ID`: por defecto `eleven_multilingual_v2`.
- `ELEVENLABS_OUTPUT_FORMAT`: por defecto `mp3_44100_128`.

Después ejecuta **Trigger deploy → Clear cache and deploy site**.

## Elección correcta de las voces

En ElevenLabs, guarda en *My Voices* dos voces cuyo perfil indique español/castellano de España. Comprueba la muestra antes de copiar cada `voice_id`. No utilices voces etiquetadas como Latin American, Mexican, Argentine, Colombian o neutral Spanish si deseas distinción peninsular entre `s` y `c/z`.

## Seguridad y funcionamiento

- La petición se realiza desde `/.netlify/functions/voz`.
- La clave se lee únicamente desde las variables del servidor.
- El selector femenina/masculina ya existente determina qué identificador de voz usa la función.
- Si falta la clave, falta un identificador o falla ElevenLabs, la app intenta una voz local `es-ES` del dispositivo.
