export interface FighterStats {
  pace: number;
  shot: number;
  skill: number;
  defend: number;
}

export interface Fighter {
  id: string;
  name: string;
  shortName: string;
  teamId: string;
  fullImage: string | null;
  nationality: string;
  group: string;
  stats: FighterStats;
  moves: { label: string; input: string }[];
}

export const fighters: Fighter[] = [
  {
    id: "davies",
    name: "Alphonso Davies",
    shortName: "DAVIES",
    teamId: "canada",
    fullImage: "/character/canada-basic.png",
    nationality: "Canada",
    group: "A",
    stats: { pace: 97, shot: 75, skill: 84, defend: 68 },
    moves: [
      { label: "Phonzy Burst", input: "→ → →" },
      { label: "Maple Leaf Rush", input: "↓ → ✦" },
      { label: "Red Surge", input: "↑ ✦" },
    ],
  },
  {
    id: "debruyne",
    name: "Kevin De Bruyne",
    shortName: "DE BRUYNE",
    teamId: "belgium",
    fullImage: "/character/belgium-basic.png",
    nationality: "Belgium",
    group: "C",
    stats: { pace: 76, shot: 88, skill: 94, defend: 64 },
    moves: [
      { label: "Golden Thread", input: "↓ → ✦" },
      { label: "Brussels Arc", input: "← → ✦" },
      { label: "Red Devil Drive", input: "↑ ↓ ✦" },
    ],
  },
  {
    id: "modric",
    name: "Luka Modrić",
    shortName: "MODRIĆ",
    teamId: "croatia",
    fullImage: "/character/croatia-basic.png",
    nationality: "Croatia",
    group: "G",
    stats: { pace: 70, shot: 80, skill: 94, defend: 72 },
    moves: [
      { label: "Vatreni Pivot", input: "← ↓ ←" },
      { label: "Adriatic Turn", input: "← → ✦" },
      { label: "Chess Master", input: "↓ ↓ →" },
    ],
  },
  {
    id: "bellingham",
    name: "Jude Bellingham",
    shortName: "BELLINGHAM",
    teamId: "england",
    fullImage: "/character/england-basic.png",
    nationality: "England",
    group: "B",
    stats: { pace: 85, shot: 82, skill: 86, defend: 78 },
    moves: [
      { label: "Three Lions Charge", input: "↑ ✦" },
      { label: "Wembley Rush", input: "→ ↓ ✦" },
      { label: "Lion's Paw", input: "← ✦" },
    ],
  },
  {
    id: "mbappe",
    name: "Kylian Mbappé",
    shortName: "MBAPPÉ",
    teamId: "france",
    fullImage: "/character/france-basic.png",
    nationality: "France",
    group: "E",
    stats: { pace: 99, shot: 92, skill: 88, defend: 45 },
    moves: [
      { label: "Bleu Sprint", input: "→ → ✦" },
      { label: "Arc Strike", input: "↓ ← ✦" },
      { label: "Les Bleus Wall", input: "← ← →" },
    ],
  },
  {
    id: "vandijk",
    name: "Virgil van Dijk",
    shortName: "VAN DIJK",
    teamId: "netherlands",
    fullImage: "/character/netherlands-basic.png",
    nationality: "Netherlands",
    group: "H",
    stats: { pace: 78, shot: 60, skill: 72, defend: 96 },
    moves: [
      { label: "Oranje Wall", input: "← ← ✦" },
      { label: "Kop van Noord", input: "↑ ✦" },
      { label: "Total Defence", input: "↓ ↑ ✦" },
    ],
  },
  {
    id: "haaland",
    name: "Erling Haaland",
    shortName: "HAALAND",
    teamId: "norway",
    fullImage: "/character/norway-basic.png",
    nationality: "Norway",
    group: "D",
    stats: { pace: 89, shot: 96, skill: 80, defend: 45 },
    moves: [
      { label: "Viking Hammer", input: "↑ ↑ ✦" },
      { label: "Nordic Rush", input: "→ → ✦" },
      { label: "Fjord Strike", input: "↓ → ✦" },
    ],
  },
  {
    id: "ronaldo",
    name: "Cristiano Ronaldo",
    shortName: "RONALDO",
    teamId: "portugal",
    fullImage: "/character/portugal-basic.png",
    nationality: "Portugal",
    group: "F",
    stats: { pace: 85, shot: 95, skill: 88, defend: 42 },
    moves: [
      { label: "Siuuu Cannon", input: "↑ ↑ ✦" },
      { label: "Chop Header", input: "↑ ✦" },
      { label: "Águias Dive", input: "→ ← ✦" },
    ],
  },
  {
    id: "yamal",
    name: "Lamine Yamal",
    shortName: "YAMAL",
    teamId: "spain",
    fullImage: "/character/spain-basic.png",
    nationality: "Spain",
    group: "D",
    stats: { pace: 91, shot: 84, skill: 92, defend: 42 },
    moves: [
      { label: "La Roja Flash", input: "→ ↓ ✦" },
      { label: "Barça Cut", input: "← → ✦" },
      { label: "Furia Burst", input: "↑ → ✦" },
    ],
  },
  {
    id: "diaz",
    name: "Luis Díaz",
    shortName: "DÍAZ",
    teamId: "colombia",
    fullImage: "/character/columbia-basic.png",
    nationality: "Colombia",
    group: "F",
    stats: { pace: 92, shot: 85, skill: 86, defend: 48 },
    moves: [
      { label: "Cafetero Blaze", input: "→ → ✦" },
      { label: "Amazon Cut", input: "↓ ← ✦" },
      { label: "Tricolor Drive", input: "← → →" },
    ],
  },
  {
    id: "messi",
    name: "Lionel Messi",
    shortName: "MESSI",
    teamId: "argentina",
    fullImage: "/character/argentina-basic.png",
    nationality: "Argentina",
    group: "A",
    stats: { pace: 88, shot: 95, skill: 99, defend: 40 },
    moves: [
      { label: "La Pulga Burst", input: "↓ → ✦" },
      { label: "Ghost Dribble", input: "← ↓ ←" },
      { label: "Free Arc", input: "Hold ✦" },
    ],
  },
  {
    id: "neymar",
    name: "Neymar Jr.",
    shortName: "NEYMAR",
    teamId: "brazil",
    fullImage: "/character/brazil-basic.png",
    nationality: "Brazil",
    group: "G",
    stats: { pace: 91, shot: 87, skill: 97, defend: 35 },
    moves: [
      { label: "Ginga Flow", input: "↓ ↓ ✦" },
      { label: "Samba Drive", input: "→ ↓ →" },
      { label: "Jogo Bonito", input: "↑ → ✦" },
    ],
  },
  {
    id: "salah",
    name: "Mohamed Salah",
    shortName: "SALAH",
    teamId: "egypt",
    fullImage: "/character/egypt-basic.png",
    nationality: "Egypt",
    group: "E",
    stats: { pace: 93, shot: 90, skill: 90, defend: 45 },
    moves: [
      { label: "Pharaoh Sprint", input: "→ → ✦" },
      { label: "Nile Curl", input: "↓ → ✦" },
      { label: "Desert King", input: "↑ ← ✦" },
    ],
  },
  {
    id: "hakimi",
    name: "Achraf Hakimi",
    shortName: "HAKIMI",
    teamId: "morocco",
    fullImage: "/character/morocco-basic.png",
    nationality: "Morocco",
    group: "F",
    stats: { pace: 91, shot: 76, skill: 82, defend: 80 },
    moves: [
      { label: "Atlas Rocket", input: "→ ↓ ✦" },
      { label: "Desert Wind", input: "← → ✦" },
      { label: "Panenka Flip", input: "↑ ← →" },
    ],
  },
  {
    id: "kubo",
    name: "Takefusa Kubo",
    shortName: "KUBO",
    teamId: "japan",
    fullImage: "/character/japan-basic.png",
    nationality: "Japan",
    group: "C",
    stats: { pace: 84, shot: 80, skill: 90, defend: 55 },
    moves: [
      { label: "Samurai Cut", input: "← → ✦" },
      { label: "Fuji Drive", input: "↓ ← ✦" },
      { label: "Rising Sun", input: "↑ ↑ →" },
    ],
  },
  {
    id: "son",
    name: "Son Heung-min",
    shortName: "SON",
    teamId: "korea",
    fullImage: "/character/korea-basic.png",
    nationality: "Korea Republic",
    group: "G",
    stats: { pace: 89, shot: 88, skill: 87, defend: 42 },
    moves: [
      { label: "Tiger Strike", input: "↑ → ✦" },
      { label: "Seoul Rush", input: "→ ↓ ✦" },
      { label: "Taeguk Flash", input: "← → ✦" },
    ],
  },
];
