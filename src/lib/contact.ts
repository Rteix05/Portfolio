// Sujets proposés sur la page contact : la même liste sert au formulaire et aux mails
export const SUJETS_CONTACT = [
  "Proposition d'alternance",
  'Proposition de stage',
  'Collaboration freelance',
  'Question technique',
  'Autre',
] as const;

export const estSujetConnu = (sujet: string) => (SUJETS_CONTACT as readonly string[]).includes(sujet);
