# OncoResponde 3.4.0 — voz fija oficial

La síntesis de voz utiliza exclusivamente la voz de ElevenLabs con identificador:

`dNjJKg63Fr5AXwIdkATa`

La selección se impone en la función segura de Netlify. La función ignora cualquier `voiceId`, género o preferencia antigua enviada por el navegador. Ya no se requieren las variables `ELEVENLABS_FEMALE_VOICE_ID` ni `ELEVENLABS_MALE_VOICE_ID`; únicamente debe mantenerse `ELEVENLABS_API_KEY`.

Se ha retirado el selector dinámico de voces y se eliminan del almacenamiento local las preferencias heredadas de versiones anteriores.


## Corrección de voz predeterminada

- La voz `dNjJKg63Fr5AXwIdkATa` queda fijada directamente en la función `voz.mjs`.
- El navegador comprueba la cabecera `X-OncoResponde-Voice-Id` antes de reproducir el audio.
- Se desactiva el cambio silencioso a una voz del dispositivo cuando ElevenLabs falla, para evitar que parezca que se ha utilizado otra voz.
- Se fuerza `no-store` y una nueva caché PWA para impedir que se reutilice código anterior.
- En Netlify solo es necesaria `ELEVENLABS_API_KEY`; las variables femenina y masculina no se utilizan.
