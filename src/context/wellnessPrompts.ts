export type WellnessContextId =
  | 'alimentacion'
  | 'ejercicio'
  | 'dormir'
  | 'mindfulness'
  | 'bienestar-emocional'
  | 'comunicacion'
  | 'respiracion';

export type WellnessPrompt = {
  id: WellnessContextId;
  label: string;
  clientContext: string;
};

export const wellnessPrompts: Record<WellnessContextId, WellnessPrompt> = {
  alimentacion: {
    id: 'alimentacion',
    label: 'Alimentación',
    clientContext: 'Alimentación y síntomas que afectan a la ingesta durante el proceso oncológico.',
  },
  ejercicio: {
    id: 'ejercicio',
    label: 'Ejercicio',
    clientContext: 'Actividad física segura y adaptada durante el proceso oncológico.',
  },
  dormir: {
    id: 'dormir',
    label: 'Dormir mejor',
    clientContext: 'Sueño, descanso e higiene del sueño durante el proceso oncológico.',
  },
  mindfulness: {
    id: 'mindfulness',
    label: 'Mindfulness',
    clientContext: 'Atención plena, respiración consciente y prácticas breves de relajación.',
  },
  'bienestar-emocional': {
    id: 'bienestar-emocional',
    label: 'Bienestar emocional',
    clientContext: 'Miedo, tristeza, incertidumbre y otras reacciones emocionales relacionadas con el cáncer.',
  },
  comunicacion: {
    id: 'comunicacion',
    label: 'Comunicación',
    clientContext: 'Comunicación con familia, hijos, amistades y equipo sanitario.',
  },
  respiracion: {
    id: 'respiracion',
    label: 'Respiración',
    clientContext: 'Respiración guiada y regulación de la tensión en situaciones difíciles.',
  },
};
