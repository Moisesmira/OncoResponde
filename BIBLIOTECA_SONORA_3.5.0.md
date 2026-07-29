# Biblioteca Sonora OncoResponde 3.5.0

## Integración realizada

- Nueva tarjeta «Biblioteca Sonora» en la pantalla de inicio.
- Nueva ruta `/biblioteca-sonora`.
- Volumen I con cinco pistas visibles.
- Audio 1 «Bienvenido a OncoResponde» activado.
- Generación con la función ElevenLabs ya existente y la voz Cristina (`dNjJKg63Fr5AXwIdkATa`).
- El audio se guarda en la caché del navegador después de la primera generación para evitar consumir créditos en reproducciones posteriores desde el mismo dispositivo.
- Reproductor con pausa, controles nativos y velocidades 0,75×, 1× y 1,25×.

## Funcionamiento

La primera vez que se pulsa «Escuchar», la aplicación llama a `/.netlify/functions/voz`. Es necesario mantener `ELEVENLABS_API_KEY` configurada en Netlify. Después, el MP3 queda guardado localmente en la caché del dispositivo.

## Verificación

La estructura y las rutas se han integrado. No se ha podido ejecutar la compilación local porque el registro de paquetes del entorno no tenía disponible la dependencia `zustand@5.0.8`. Netlify instalará las dependencias usando su propio registro durante el despliegue.
