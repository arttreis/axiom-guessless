export interface Archetype {
  name: string;
  color: string;
  icon: string;
  desc: string;
}

export const ARCHETYPES: Archetype[] = [
  { name: 'O Inocente',    color: '#8BA8FF', icon: '☀',  desc: 'Otimista, puro, nostálgico. Busca felicidade e harmonia.' },
  { name: 'O Explorador',  color: '#6B8FFF', icon: '⛰',  desc: 'Aventureiro, livre, autêntico. Descobre o novo.' },
  { name: 'O Sábio',       color: '#3D6FF8', icon: '◈',  desc: 'Inteligente, analítico, mentor. Compartilha conhecimento.' },
  { name: 'O Herói',       color: '#2B5EE8', icon: '⚡',  desc: 'Corajoso, determinado, inspirador. Supera desafios.' },
  { name: 'O Fora-da-Lei', color: '#4B7BFF', icon: '✦',  desc: 'Rebelde, disruptivo, iconoclasta. Quebra regras.' },
  { name: 'O Mago',        color: '#6B7FFF', icon: '✧',  desc: 'Visionário, transformador, carismático. Realiza sonhos.' },
  { name: 'O Cara Comum',  color: '#7B96C4', icon: '◉',  desc: 'Empático, confiável, real. Pertence ao grupo.' },
  { name: 'O Amante',      color: '#9BA8FF', icon: '♡',  desc: 'Apaixonado, sensual, comprometido. Cria conexões profundas.' },
  { name: 'O Bobo',        color: '#5B7FE8', icon: '★',  desc: 'Divertido, irreverente, espontâneo. Traz leveza.' },
  { name: 'O Cuidador',    color: '#4A70D8', icon: '❋',  desc: 'Generoso, protetor, empático. Serve ao próximo.' },
  { name: 'O Criador',     color: '#5578F0', icon: '◬',  desc: 'Inovador, artístico, visionário. Constrói coisas novas.' },
  { name: 'O Governante',  color: '#3050D0', icon: '♛',  desc: 'Líder, responsável, controlador. Cria ordem e estabilidade.' },
];

export function getArchetype(name: string): Archetype | undefined {
  return ARCHETYPES.find(a => a.name === name);
}
