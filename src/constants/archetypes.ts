export interface Archetype {
  name: string;
  color: string;
  icon: string;
  desc: string;
}

export const ARCHETYPES: Archetype[] = [
  { name: 'O Inocente',    color: '#4070FF', icon: '☀',  desc: 'Otimista, puro e nostálgico. Acredita no bem e busca felicidade genuína. Marcas com esse arquétipo transmitem simplicidade, honestidade e esperança — criando uma sensação de segurança e pertencimento.' },
  { name: 'O Explorador',  color: '#4070FF', icon: '⛰',  desc: 'Aventureiro, livre e autêntico. Desafia o convencional em busca de novas experiências. Marcas exploradoras inspiram independência, descoberta e a coragem de sair da zona de conforto.' },
  { name: 'O Sábio',       color: '#4070FF', icon: '◈',  desc: 'Inteligente, analítico e mentor. Compartilha conhecimento com profundidade e clareza. Marcas sábias são referências de credibilidade — educam, orientam e empoderam seu público.' },
  { name: 'O Herói',       color: '#4070FF', icon: '⚡',  desc: 'Corajoso, determinado e inspirador. Enfrenta desafios e supera obstáculos. Marcas heroicas motivam ação, celebram conquistas e constroem uma narrativa de superação e excelência.' },
  { name: 'O Fora-da-Lei', color: '#4070FF', icon: '✦',  desc: 'Rebelde, disruptivo e iconoclasta. Quebra regras e questiona o status quo. Marcas fora-da-lei provocam, desafiam convenções e falam para quem quer mudar o mundo — ou pelo menos as regras do jogo.' },
  { name: 'O Mago',        color: '#4070FF', icon: '✧',  desc: 'Visionário, transformador e carismático. Realiza sonhos e transforma realidades. Marcas mágicas prometem experiências extraordinárias e criam momentos que parecem impossíveis até acontecerem.' },
  { name: 'O Cara Comum',  color: '#4070FF', icon: '◉',  desc: 'Empático, confiável e real. Pertence ao grupo e fala a língua de todos. Marcas do cara comum constroem conexão genuína pela igualdade — sem elitismo, sem pose, apenas autenticidade.' },
  { name: 'O Amante',      color: '#4070FF', icon: '♡',  desc: 'Apaixonado, sensual e comprometido. Cria conexões profundas e experiências inesquecíveis. Marcas amantes seduzem pelo desejo, pela beleza e pela promessa de uma relação intensa e exclusiva.' },
  { name: 'O Bobo',        color: '#4070FF', icon: '★',  desc: 'Divertido, irreverente e espontâneo. Traz leveza e humor para tudo. Marcas bobas criam alegria genuína — são as que fazem o público sorrir, compartilhar e associar a momentos felizes.' },
  { name: 'O Cuidador',    color: '#4070FF', icon: '❋',  desc: 'Generoso, protetor e empático. Serve ao próximo com dedicação. Marcas cuidadoras criam laços de confiança e lealdade ao colocar o bem-estar do cliente acima de qualquer outra coisa.' },
  { name: 'O Criador',     color: '#4070FF', icon: '◬',  desc: 'Inovador, artístico e visionário. Constrói coisas novas com propósito. Marcas criadoras valorizam originalidade e expressão — inspiram seu público a também criar, imaginar e inovar.' },
  { name: 'O Governante',  color: '#4070FF', icon: '♛',  desc: 'Líder, responsável e controlador. Cria ordem, estabilidade e excelência. Marcas governantes transmitem autoridade e prestígio — são escolhidas por quem busca o melhor e quer demonstrar status.' },
];

export function getArchetype(name: string): Archetype | undefined {
  return ARCHETYPES.find(a => a.name === name);
}
