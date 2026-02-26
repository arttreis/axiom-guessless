export interface Archetype {
  name: string;
  color: string;
  icon: string;
  desc: string;
}

export const ARCHETYPES: Archetype[] = [
  { name: 'O Inocente',    color: '#FFD93D', icon: '☀',  desc: 'Otimista, puro, nostálgico. Busca felicidade e harmonia.' },
  { name: 'O Explorador',  color: '#6BCB77', icon: '⛰',  desc: 'Aventureiro, livre, autêntico. Descobre o novo.' },
  { name: 'O Sábio',       color: '#4D96FF', icon: '◈',  desc: 'Inteligente, analítico, mentor. Compartilha conhecimento.' },
  { name: 'O Herói',       color: '#FF6B6B', icon: '⚡',  desc: 'Corajoso, determinado, inspirador. Supera desafios.' },
  { name: 'O Fora-da-Lei', color: '#FF922B', icon: '✦',  desc: 'Rebelde, disruptivo, iconoclasta. Quebra regras.' },
  { name: 'O Mago',        color: '#CC5DE8', icon: '✧',  desc: 'Visionário, transformador, carismático. Realiza sonhos.' },
  { name: 'O Cara Comum',  color: '#74C0FC', icon: '◉',  desc: 'Empático, confiável, real. Pertence ao grupo.' },
  { name: 'O Amante',      color: '#F783AC', icon: '♡',  desc: 'Apaixonado, sensual, comprometido. Cria conexões profundas.' },
  { name: 'O Bobo',        color: '#FFA94D', icon: '★',  desc: 'Divertido, irreverente, espontâneo. Traz leveza.' },
  { name: 'O Cuidador',    color: '#63E6BE', icon: '❋',  desc: 'Generoso, protetor, empático. Serve ao próximo.' },
  { name: 'O Criador',     color: '#A9E34B', icon: '◬',  desc: 'Inovador, artístico, visionário. Constrói coisas novas.' },
  { name: 'O Governante',  color: '#FFD43B', icon: '♛',  desc: 'Líder, responsável, controlador. Cria ordem e estabilidade.' },
];

export function getArchetype(name: string): Archetype | undefined {
  return ARCHETYPES.find(a => a.name === name);
}
