export type WellnessTopic = {
  id: string;
  title: string;
  icon: string;
  message: string;
  explanation: string;
  tips: string[];
  questions: string[];
  askLabel: string;
  context: string;
};

export const wellnessTopics: Record<string, WellnessTopic> = {
  alimentacion: {
    id: 'alimentacion', title: 'Alimentación', icon: '🍎',
    message: 'Comer bien no significa hacerlo perfecto: significa encontrar lo que hoy puedes tolerar y te ayuda a mantenerte.',
    explanation: 'Durante el cáncer y sus tratamientos pueden cambiar el apetito, el gusto, la digestión o las necesidades nutricionales. No existe una dieta única para todas las personas; conviene priorizar una alimentación variada, suficiente y adaptada a los síntomas.',
    tips: ['Haz comidas pequeñas si te cuesta terminar un plato.', 'Mantén líquidos a mano y bebe en pequeñas cantidades.', 'Consulta antes de tomar suplementos o productos “anticáncer”.'],
    questions: ['No tengo apetito', 'Tengo náuseas', '¿Qué puedo comer?'],
    askLabel: 'Preguntar sobre alimentación',
    context: 'Área Cuídate: alimentación durante el proceso oncológico. Responde con lenguaje sencillo y prudente, ofrece medidas prácticas basadas en fuentes sanitarias fiables, indica señales de alarma y cuándo consultar al equipo sanitario. No hagas diagnósticos ni sustituyas la valoración profesional.',
  },
  ejercicio: {
    id: 'ejercicio', title: 'Ejercicio', icon: '🚶',
    message: 'Moverte un poco también cuenta. El objetivo es acompañar a tu cuerpo, no ponerlo a prueba.',
    explanation: 'La actividad física adaptada puede ayudar a conservar fuerza, funcionalidad y bienestar. La cantidad adecuada depende del tratamiento, los síntomas, la condición previa y las recomendaciones médicas.',
    tips: ['Empieza con periodos cortos y aumenta solo si te sienta bien.', 'Combina caminar con ejercicios suaves de fuerza cuando sea posible.', 'Detente y consulta ante dolor torácico, mareo intenso o dificultad respiratoria nueva.'],
    questions: ['¿Puedo hacer ejercicio?', 'Estoy muy cansado', '¿Qué actividad es recomendable?'],
    askLabel: 'Preguntar sobre ejercicio',
    context: 'Área Cuídate: ejercicio y actividad física durante el proceso oncológico. Adapta la orientación a síntomas, tratamiento y nivel funcional. Prioriza seguridad, progresión gradual y señales para detenerse o consultar. No hagas diagnósticos ni sustituyas al equipo sanitario.',
  },
  dormir: {
    id: 'dormir', title: 'Dormir mejor', icon: '😴',
    message: 'Una mala noche no significa que la siguiente vaya a ser igual. Podemos preparar el descanso sin forzarlo.',
    explanation: 'El sueño puede alterarse por la preocupación, el dolor, algunos tratamientos o los cambios de rutina. Las medidas sencillas y constantes suelen ayudar más que intentar “obligarse” a dormir.',
    tips: ['Mantén horarios parecidos para levantarte.', 'Reserva la cama para dormir y descansar.', 'Anota las preocupaciones antes de acostarte para sacarlas de la cabeza.'],
    questions: ['Me cuesta dormir', 'Me despierto muchas veces', 'Consejos para descansar'],
    askLabel: 'Preguntar sobre el sueño',
    context: 'Área Cuídate: sueño y descanso durante el proceso oncológico. Da recomendaciones de higiene del sueño sencillas y realistas, considera dolor, ansiedad y efectos del tratamiento, e indica cuándo conviene consultar. No indiques cambios de medicación ni sustituyas al equipo sanitario.',
  },
  mindfulness: {
    id: 'mindfulness', title: 'Mindfulness', icon: '🌿',
    message: 'No necesitas dejar la mente en blanco. Solo volver, una vez más, al momento presente.',
    explanation: 'Mindfulness consiste en prestar atención a la experiencia presente con curiosidad y sin juzgarla. Puede practicarse durante pocos minutos y no sustituye el apoyo psicológico cuando este es necesario.',
    tips: ['Empieza con uno o dos minutos.', 'Usa la respiración o los sonidos como punto de apoyo.', 'Cuando te distraigas, vuelve con amabilidad.'],
    questions: ['Ejercicio de 2 minutos', 'Atención plena', 'Relajación guiada'],
    askLabel: 'Preguntar sobre mindfulness',
    context: 'Área Cuídate: mindfulness, atención plena y relajación durante el proceso oncológico. Propón prácticas breves, accesibles y no exigentes. Evita promesas terapéuticas y recuerda que no sustituye el apoyo psicológico cuando hay malestar intenso o persistente.',
  },
  'bienestar-emocional': {
    id: 'bienestar-emocional', title: 'Bienestar emocional', icon: '❤️',
    message: 'Lo que sientes tiene sentido. No tienes que estar fuerte todo el tiempo.',
    explanation: 'Miedo, tristeza, enfado, culpa o incertidumbre son respuestas frecuentes. Compartirlas, ponerles nombre y pedir ayuda cuando desbordan puede reducir su peso.',
    tips: ['Identifica qué emoción aparece y qué necesitas en ese momento.', 'Habla con alguien de confianza sin sentir que debes protegerle de todo.', 'Solicita apoyo profesional si el malestar es intenso o persistente.'],
    questions: ['Tengo miedo', 'Estoy triste', 'Me siento desbordado'],
    askLabel: 'Hablar sobre cómo me siento',
    context: 'Área Cuídate: bienestar emocional en el proceso oncológico. Responde con empatía, valida sin dramatizar, ofrece pasos concretos y señala cuándo pedir apoyo profesional o ayuda urgente. No diagnostiques trastornos psicológicos ni sustituyas a profesionales sanitarios.',
  },
  comunicacion: {
    id: 'comunicacion', title: 'Comunicación', icon: '👨‍👩‍👧',
    message: 'Hablar no siempre resuelve el problema, pero puede hacer que no tengas que llevarlo en soledad.',
    explanation: 'Cada persona decide cuánto quiere contar y a quién. Preparar las conversaciones y expresar necesidades concretas puede facilitar el apoyo de la familia y la comunicación con el equipo sanitario.',
    tips: ['Elige un momento tranquilo y explica primero qué necesitas.', 'Puedes decir “ahora prefiero que me escuches” o “necesito ayuda práctica”.', 'Lleva tus preguntas escritas a las consultas.'],
    questions: ['¿Cómo hablar con mi familia?', '¿Qué puedo preguntar al oncólogo?', '¿Cómo hablar con mis hijos?'],
    askLabel: 'Preguntar sobre comunicación',
    context: 'Área Cuídate: comunicación con familia, hijos y equipo sanitario durante el proceso oncológico. Ayuda a preparar conversaciones claras, respetuosas y adaptadas a la edad o situación. No sustituyas el criterio del equipo asistencial.',
  },
};
