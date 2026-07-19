export type OneMinuteCategory = 'Primeros días' | 'Tratamiento' | 'Bienestar' | 'Espera' | 'Familia';

export type OneMinuteEpisode = {
  id: string;
  category: OneMinuteCategory;
  title: string;
  duration: string;
  description: string;
  script: string;
};

export const oneMinuteEpisodes: OneMinuteEpisode[] = [
  {
    id: 'cuando-todo-empieza', category: 'Primeros días', title: 'Cuando todo empieza', duration: '1 min',
    description: 'Un mensaje sereno para los primeros días después del diagnóstico.',
    script: 'Hola. Soy OncoResponde. Si acabas de recibir un diagnóstico de cáncer, probablemente tengas muchas preguntas y quizá también miedo. Quiero recordarte algo importante: no tienes que entenderlo todo hoy. Es normal sentirse desbordado y no recordar toda la información de la primera consulta. Poco a poco conocerás mejor tu enfermedad, el tratamiento y a las personas que van a acompañarte. Anota tus dudas y pregunta siempre que lo necesites. Comprender lo que está ocurriendo puede ayudar a disminuir la incertidumbre. No tienes que recorrer este camino en solitario. Tu equipo sanitario está contigo. Esto ha sido Un minuto con OncoResponde. Información orientativa que no sustituye las recomendaciones de tu equipo sanitario.'
  },
  {
    id: 'primera-radioterapia', category: 'Tratamiento', title: 'La primera sesión de radioterapia', duration: '1 min',
    description: 'Qué suele ocurrir y por qué no sentirás la radiación durante la sesión.',
    script: 'Hoy quiero contarte cómo suele ser el primer día de radioterapia. Muchas personas llegan con nervios, pero estos suelen disminuir cuando conocen la sala y el procedimiento. Durante la sesión permanecerás tumbado unos minutos mientras el equipo administra el tratamiento. No sentirás la radiación y la sesión no duele mientras se realiza. La máquina puede moverse a tu alrededor y producir algunos sonidos. Todo forma parte del funcionamiento habitual. El equipo te observará desde la sala de control y podrás comunicarte con ellos si lo necesitas. Respira con tranquilidad. Ya has dado el primer paso. Esto ha sido Un minuto con OncoResponde. Información orientativa que no sustituye las recomendaciones de tu equipo sanitario.'
  },
  {
    id: 'una-cosa-hoy', category: 'Bienestar', title: 'Una sola cosa para hoy', duration: '1 min',
    description: 'Una propuesta sencilla para cuidarte sin exigirte demasiado.',
    script: 'Hoy no necesitas hacer diez cosas. Elige solamente una. Puede ser caminar unos minutos, escuchar música, llamar a alguien, respirar despacio o descansar sin sentirte culpable. Los pequeños gestos repetidos cada día también forman parte del cuidado. Cuidarte no siempre significa hacer más. A veces significa bajar el ritmo y atender lo que necesitas en este momento. No busques hacerlo perfecto. Busca algo pequeño, posible y amable contigo. Esto ha sido Un minuto con OncoResponde. Información orientativa que no sustituye las recomendaciones de tu equipo sanitario.'
  },
  {
    id: 'esperando-resultados', category: 'Espera', title: 'Mientras llegan los resultados', duration: '1 min',
    description: 'Cómo atravesar la espera centrándote en lo que sí puedes controlar.',
    script: 'Esperar el resultado de una prueba puede ser uno de los momentos más difíciles. Es normal que aparezcan pensamientos repetitivos o que imagines distintos escenarios. Mientras llega la información, intenta centrarte en lo que sí puedes controlar hoy: mantener alguna rutina, descansar, comer adecuadamente, preparar tus preguntas o hablar con una persona que te haga sentir acompañado. Preocuparte no significa que estés afrontándolo mal. Estás atravesando una situación importante. Cuando lleguen los resultados, tu equipo sanitario te ayudará a interpretarlos. No tienes que hacerlo solo. Esto ha sido Un minuto con OncoResponde. Información orientativa que no sustituye las recomendaciones de tu equipo sanitario.'
  },
  {
    id: 'acompanar', category: 'Familia', title: 'Acompañar también es estar', duration: '1 min',
    description: 'Un mensaje breve para familiares y personas cuidadoras.',
    script: 'Acompañar a una persona con cáncer no exige saber siempre qué decir. A veces ayuda preguntar: ¿qué necesitas de mí hoy? Puede ser hablar, guardar silencio, acudir a una consulta o resolver algo práctico. Evita obligarte a mantener siempre una actitud positiva. Estar disponible con sinceridad suele ser más útil que buscar la frase perfecta. Y recuerda cuidarte también. Descansar o pedir relevo no significa abandonar. Permite sostener mejor el acompañamiento. Esto ha sido Un minuto con OncoResponde. Información orientativa que no sustituye las recomendaciones de tu equipo sanitario.'
  }
];

export function getDailyEpisode(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return oneMinuteEpisodes[day % oneMinuteEpisodes.length];
}
