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
