## 3.4.0 — voz fija oficial de OncoResponde

- Se fija en el servidor la voz de ElevenLabs `dNjJKg63Fr5AXwIdkATa`.
- La función de Netlify ignora cualquier voz o género enviado por el navegador.
- Se elimina el selector dinámico y las preferencias antiguas guardadas localmente.
- Ya no se utilizan `ELEVENLABS_FEMALE_VOICE_ID` ni `ELEVENLABS_MALE_VOICE_ID`.
- Se mantiene únicamente `ELEVENLABS_API_KEY` como variable obligatoria.
- Se actualiza la caché PWA a 3.4.0.

## 3.3.3

- Corrige el filtro de voces de ElevenLabs: ya no se interpreta la capacidad multilingüe `es-ES` como prueba de acento castellano.
- Solo se muestran voces cuya ficha declara explícitamente España, castellano, Castilian Spanish o acento peninsular.
- Se excluyen voces estadounidenses, británicas, australianas y latinoamericanas aunque puedan hablar español.
- La etiqueta de acento muestra los metadatos reales de ElevenLabs y deja de renombrar voces extranjeras como «Español de España».

## 3.3.0 — Voz ElevenLabs en castellano de España

- Sustituye el motor neuronal anterior por ElevenLabs en la función segura de Netlify.
- Mantiene el selector visible de voz femenina y masculina.
- Las dos voces se configuran mediante identificadores independientes para elegir voces nativas de España.
- Modelo multilingüe, idioma `es`, velocidad pausada y ajustes orientados a una locución sanitaria cálida y natural.
- La clave de ElevenLabs permanece protegida en Netlify y nunca se expone en el navegador.
- Conserva como respaldo una voz `es-ES` instalada en el dispositivo si ElevenLabs no está disponible.

## 3.2.9 — Voz peninsular y selector de género

- Refuerzo explícito de la distinción castellana entre **s** y **c/z** (sin seseo).
- Instrucciones fonéticas de ejemplo para palabras como «recibe» y «utiliza».
- Selector visible entre voz **femenina** y **masculina**.
- Preferencia guardada en el dispositivo.
- Respaldo con voces `es-ES` del sistema, diferenciadas por género cuando estén disponibles.

## 3.2.8 — Voz en español de España

- La voz neuronal de «Háblame» se configura explícitamente en castellano peninsular estándar.
- Se refuerzan la entonación, pronunciación y ritmo propios de España, evitando acentos latinoamericanos.
- Se mantiene un tono femenino adulto, cálido, sereno, cercano y profesional.
- La voz de respaldo del dispositivo queda limitada a voces etiquetadas como `es-ES`; ya no selecciona voces `es-MX`, `es-US` u otras variantes.

## 3.2.7 — Voz más humana en las respuestas

- Sustituida la voz principal del navegador por síntesis de voz neuronal generada en el servidor.
- Tono configurado como adulto, cálido, sereno, cercano y profesional.
- Añadidos controles de pausar, continuar y detener.
- Se muestra de forma transparente que la voz está generada por inteligencia artificial.
- Si el servicio de voz no está disponible, la app utiliza como respaldo la mejor voz española instalada en el dispositivo.

## 3.2.6 — Iconografía clínica mejorada

- Sustituidos los símbolos genéricos de TAC, resonancia magnética, PET/CT, radioterapia y cirugía por iconos clínicos ilustrados.
- Iconos adaptados a las tarjetas de Mi tratamiento y al selector de la guía Prepárate.
- Se conserva todo el contenido y funcionamiento de la versión 3.2.5.

# OncoResponde 3.2.5 — Nueva imagen de inicio

- Se integra la imagen de bienvenida seleccionada por el usuario.
- El logotipo queda situado en la parte superior derecha, sin cubrir la figura.
- La imagen se adapta de forma proporcional a móvil, tableta y escritorio.
- Se conserva toda la funcionalidad previa de OncoResponde 3.2.4.

# OncoResponde 3.2.4 — Nueva identidad visual

- Nuevo logotipo corporativo OncoResponde en la pantalla inicial.
- Nuevo icono minimalista para iPhone, iPad, Android y PWA.
- Nuevos favicon, Apple Touch Icon e iconos 192/512 px.
- Icono maskable específico para Android.
- Manifest, metadatos, caché PWA y título web actualizados.
- Se conserva la imagen del camino dentro de la experiencia de la aplicación.

## 3.2.3

- Añadido en la tarjeta principal «Háblame» un acceso siempre visible: «Ahora no sé qué preguntar. Ayúdame a empezar».
- El acceso abre la pantalla de Háblame, donde se muestran cinco sugerencias generales editables.
- Diseño destacado y traducciones al catalán y al inglés.
- Actualizada la caché PWA.

## 3.2.1 — Sugerencias de Háblame siempre visibles

- El bloque “Ahora no sé qué preguntar. Ayúdame a empezar” deja de ser desplegable y aparece siempre abierto.
- Se muestran cinco preguntas sugeridas de forma inmediata.
- Al pulsar una sugerencia, se copia al cuadro de texto para editarla o enviarla.
- Se mantiene “Mostrar otras preguntas”.
- Se refuerza la visibilidad en móvil y escritorio.
- Se actualiza la caché de la PWA.

# Changelog

## 3.2.0 — Base estable

- El bloque «Ahora no sé qué preguntar. Ayúdame a empezar» aparece abierto por defecto en «Háblame».
- Cinco sugerencias iniciales visibles, selección editable y botón «Mostrar otras preguntas».
- Se mantienen separados podcasts, sonidos ambientales y recursos externos de YouTube.
- Compilación de producción desacoplada del chequeo TypeScript para evitar fallos de despliegue por cachés incompletas de `tsc` en Netlify.
- Se añade `npm run typecheck` y `npm run verify` para validación local completa.
- Configuración de Netlify y caché PWA actualizadas a la versión 3.2.0.

# Registro de cambios de OncoResponde

Este archivo documenta las modificaciones incorporadas en cada versión. El formato sigue una estructura sencilla basada en versiones semánticas: `mayor.menor.corrección`.

## [3.1.3] — 2026-07-19

### Añadido
- En **Háblame**, mensaje introductorio para reducir la dificultad de iniciar una conversación.
- Botón desplegable **«Ahora no sé qué preguntar»**.
- Cinco sugerencias generales para iniciar una consulta.
- Botón **«Mostrar otras preguntas»** para renovar las propuestas.
- Posibilidad de copiar una sugerencia al cuadro de texto antes de enviarla.
- Sugerencias disponibles en español, catalán e inglés.

### Corregido
- Reconstrucción completa de los archivos de producción.
- Actualización de la caché de la PWA para evitar que se muestre una versión anterior.

### Conservado
- Podcasts y audios guiados.
- Sonidos de lluvia, mar y naturaleza.
- Enlaces externos de música y naturaleza en YouTube, con advertencia sobre publicidad.
- Resto de funciones y diseño de OncoResponde 3.1.

## [3.1.2] — 2026-07-19

### Añadido
- Separación de **Podcasts y audios guiados**, **Sonidos de la naturaleza** y **Música y naturaleza en YouTube**.
- Enlaces de YouTube solicitados y aviso para omitir anuncios.

### Corregido
- Acceso correcto desde **Escuchar y relajarte**.

## [3.1.1] — 2026-07-19

### Añadido
- Recuperación de los sonidos continuos de lluvia, oleaje y naturaleza.
- Ampliación de la biblioteca de relajación.

## [3.1.0]

### Añadido
- Versión multilingüe de OncoResponde 3.1.

## 3.2.2
- Reubicado el bloque de inicio de conversación fuera de la tarjeta principal de Háblame.
- Bloque siempre visible, sin desplegable y con estilos en línea para evitar que cualquier CSS lo oculte.
- Cinco sugerencias visibles, selección editable y botón «Mostrar otras preguntas».
- Actualización forzada del service worker y cabeceras sin caché para `index.html` y `sw.js`.

## 3.3.1
- Selector dinámico de voces españolas disponibles en ElevenLabs.
- Voces femeninas y masculinas con identificadores independientes.
- Botón Escuchar muestra y diagnóstico de permisos.
## 3.3.2
- Filtro estricto: solo se muestran voces verificadas como español de España (`es-ES`).
- Se excluyen voces latinoamericanas, estadounidenses, británicas y australianas.
- La mejor voz femenina disponible se marca como «Recomendada para OncoResponde»; si no hay voz femenina, se recomienda la mejor voz es-ES disponible.
- La voz recomendada se selecciona automáticamente cuando el usuario todavía no ha guardado una preferencia.

