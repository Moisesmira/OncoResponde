export const tumorQuestionOverrides: Record<string, Record<string, string[]>> = {
  mama: {
    ejercicio: ['¿Qué ejercicio puedo hacer tras la cirugía?', '¿Cómo reducir el riesgo de linfedema?', 'Estoy muy cansada durante el tratamiento'],
    alimentacion: ['¿Cómo mantener un peso saludable?', 'Tengo náuseas o poco apetito', '¿Debo evitar algún alimento?'],
    comunicacion: ['¿Cómo hablar del cambio corporal?', '¿Qué preguntar sobre la menopausia inducida?', '¿Cómo pedir apoyo en casa?'],
  },
  prostata: {
    ejercicio: ['¿Qué ejercicios ayudan al suelo pélvico?', '¿Puedo hacer fuerza durante el tratamiento?', 'Estoy perdiendo masa muscular'],
    alimentacion: ['¿Cómo cuidar el peso durante hormonoterapia?', '¿Qué puedo comer si tengo diarrea?', '¿Hay alimentos que protejan la próstata?'],
    'bienestar-emocional': ['Me preocupa la sexualidad', 'Tengo miedo a la recaída', 'Me cuesta hablar de incontinencia'],
  },
  pulmon: {
    ejercicio: ['Me falta el aire al caminar', '¿Qué actividad puedo hacer con fatiga?', '¿Cuándo debo parar y consultar?'],
    alimentacion: ['Me cuesta comer por falta de aire', '¿Cómo aumentar proteínas y energía?', 'Estoy perdiendo peso'],
    respiracion: ['¿Cómo respirar cuando me falta el aire?', 'Respiración antes de una prueba', '¿Cuándo la falta de aire es urgente?'],
  },
  colorrectal: {
    alimentacion: ['Tengo diarrea', 'Tengo estreñimiento', '¿Qué comer con una ostomía?'],
    ejercicio: ['¿Cómo volver a caminar tras la cirugía?', '¿Puedo hacer abdominales?', 'Estoy muy cansado'],
  },
  ginecologico: {
    ejercicio: ['¿Puedo hacer ejercicio tras la cirugía?', '¿Cómo cuidar el suelo pélvico?', 'Tengo fatiga durante el tratamiento'],
    'bienestar-emocional': ['Me preocupa la sexualidad', 'Tengo miedo a los cambios corporales', 'Me siento desbordada'],
  },
  'cabeza-cuello': {
    alimentacion: ['Me cuesta tragar', 'Tengo la boca seca', '¿Cómo mantener el peso?'],
    comunicacion: ['Me cuesta hablar', '¿Cómo explicar los cambios en mi voz?', '¿Qué preguntar sobre deglución?'],
  },
};
