// === TYPES ===
export interface Universe {
  id: string;
  name: string;
  description: string;
  era: string;
  image?: string;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  universeId: string;
  raceId: string;
  factionId?: string;
  backstory: string;
  stats: { force: number; agilite: number; intelligence: number; magie: number; charisme: number };
  image?: string;
}

export interface Race {
  id: string;
  name: string;
  description: string;
  universeId: string;
  traits: string[];
}

export interface Faction {
  id: string;
  name: string;
  description: string;
  universeId: string;
  memberCount: number;
  motto: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  era: string;
  title: string;
  description: string;
  universeId: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  universeId: string;
  type: string;
}

export interface Creature {
  id: string;
  name: string;
  description: string;
  dangerLevel: 1 | 2 | 3 | 4 | 5;
  universeId: string;
  habitat: string;
  abilities: string[];
}

// === DATA ===
export const universes: Universe[] = [
  { id: "u1", name: "Aethermonde", description: "Un monde où l'éther coule comme des rivières, alimentant une magie ancienne et puissante. Les cités flottent au-dessus de mers de brume, reliées par des ponts de lumière cristallisée.", era: "Ère de l'Éther" },
  { id: "u2", name: "Noctarion", description: "Le royaume de la nuit éternelle, où les étoiles sont des dieux morts et la lumière est une denrée rare. Seuls les plus braves osent traverser ses plaines d'ombre.", era: "Ère des Ombres" },
  { id: "u3", name: "Pyroveil", description: "Un monde forgé dans le feu primordial, où les volcans chantent et les flammes dansent avec une volonté propre. La civilisation s'est bâtie autour des forges éternelles.", era: "Ère du Brasier" },
  { id: "u4", name: "Crystallis", description: "Un univers entièrement cristallin où chaque surface réfracte la réalité en possibilités infinies. Les habitants naviguent entre les reflets pour voyager.", era: "Ère du Prisme" },
];

export const characters: Character[] = [
  { id: "c1", name: "Theron Ashveil", title: "Le Gardien de l'Éther", universeId: "u1", raceId: "r1", factionId: "f1", backstory: "Ancien archiviste devenu gardien après avoir découvert une faille dans le tissu de l'éther. Il porte le fardeau de protéger les archives contre ceux qui voudraient corrompre le savoir ancien.", stats: { force: 5, agilite: 7, intelligence: 9, magie: 10, charisme: 6 } },
  { id: "c2", name: "Lyra Noctis", title: "La Tisseuse d'Ombres", universeId: "u2", raceId: "r2", factionId: "f2", backstory: "Née dans la dernière lueur avant la nuit éternelle, Lyra a appris à tisser les ombres comme d'autres tissent la soie. Elle cherche à restaurer la lumière perdue de Noctarion.", stats: { force: 4, agilite: 9, intelligence: 8, magie: 8, charisme: 7 } },
  { id: "c3", name: "Vulkan Forgecoeur", title: "Le Maître des Flammes", universeId: "u3", raceId: "r3", factionId: "f3", backstory: "Forgeron légendaire qui a fusionné son âme avec le feu primordial. Chaque arme qu'il crée porte un fragment de sa volonté ardente.", stats: { force: 10, agilite: 4, intelligence: 6, magie: 9, charisme: 5 } },
  { id: "c4", name: "Prisma Reflet-d'Âme", title: "L'Éclat Vivant", universeId: "u4", raceId: "r4", factionId: "f4", backstory: "Être née de la convergence de mille reflets, Prisma peut exister simultanément dans plusieurs réalités. Elle cherche sa véritable identité parmi ses infinis reflets.", stats: { force: 3, agilite: 8, intelligence: 10, magie: 10, charisme: 9 } },
  { id: "c5", name: "Orion Brume-Noire", title: "Le Chasseur Silencieux", universeId: "u2", raceId: "r2", factionId: "f2", backstory: "Traqueur impitoyable des abominations de la nuit, Orion se déplace comme une ombre parmi les ombres. Son arc tire des flèches forgées dans la lumière stellaire mourante.", stats: { force: 7, agilite: 10, intelligence: 6, magie: 5, charisme: 4 } },
  { id: "c6", name: "Aelindra Étherée", title: "La Prophétesse du Voile", universeId: "u1", raceId: "r1", factionId: "f1", backstory: "Capable de lire les courants d'éther comme un livre ouvert, Aelindra prédit les cataclysmes et guide les peuples de l'Aethermonde vers leur destin.", stats: { force: 2, agilite: 5, intelligence: 10, magie: 10, charisme: 8 } },
];

export const races: Race[] = [
  { id: "r1", name: "Éthériens", description: "Êtres semi-translucides qui absorbent l'éther ambiant. Leur peau scintille de lueurs bleutées et ils peuvent percevoir les flux magiques invisibles.", universeId: "u1", traits: ["Vision éthérique", "Absorption magique", "Longévité"] },
  { id: "r2", name: "Ombrais", description: "Peuple adapté à l'obscurité perpétuelle, leurs yeux brillent dans le noir comme des lanternes argentées. Ils peuvent fusionner avec les ombres.", universeId: "u2", traits: ["Vision nocturne", "Fusion d'ombres", "Silence naturel"] },
  { id: "r3", name: "Ignéens", description: "Race née des volcans, leur sang est du magma en fusion et leur souffle crée des flammes. Ils sont pratiquement immunisés au feu.", universeId: "u3", traits: ["Immunité au feu", "Sang de magma", "Souffle ardent"] },
  { id: "r4", name: "Cristallins", description: "Êtres faits de cristal vivant, capables de réfracter la lumière et de se diviser en reflets autonomes temporaires.", universeId: "u4", traits: ["Réfraction", "Division prismatique", "Mémoire cristalline"] },
  { id: "r5", name: "Spectres-nés", description: "Créatures entre la vie et la mort, nées dans les failles entre les mondes. Elles peuvent traverser les barrières dimensionnelles.", universeId: "u2", traits: ["Intangibilité", "Passage dimensionnel", "Perception spectrale"] },
];

export const factions: Faction[] = [
  { id: "f1", name: "L'Ordre de l'Archive Éternelle", description: "Gardiens du savoir ancestral, ils protègent les manuscrits magiques et les reliques du multivers contre toute corruption.", universeId: "u1", memberCount: 342, motto: "Le savoir est le dernier rempart" },
  { id: "f2", name: "Les Veilleurs de la Nuit", description: "Sentinelles qui patrouillent les frontières de Noctarion, empêchant les horreurs de la nuit profonde d'envahir les derniers refuges.", universeId: "u2", memberCount: 187, motto: "Nous veillons pour que d'autres dorment" },
  { id: "f3", name: "La Confrérie des Flammes", description: "Forgerons et pyromanciens unis par leur dévotion au feu primordial. Ils forgent les armes et armures les plus puissantes du multivers.", universeId: "u3", memberCount: 256, motto: "Par le feu, nous créons" },
  { id: "f4", name: "Le Conclave des Reflets", description: "Philosophes et mystiques qui étudient les réalités parallèles au sein du Crystallis, cherchant la vérité ultime entre les reflets.", universeId: "u4", memberCount: 128, motto: "Chaque reflet cache une vérité" },
];

export const timelineEvents: TimelineEvent[] = [
  { id: "e1", year: -5000, era: "Ère Primordiale", title: "La Naissance du Multivers", description: "L'explosion originelle crée les quatre plans fondamentaux, semant les graines de tous les univers à venir.", universeId: "u1" },
  { id: "e2", year: -3000, era: "Ère Primordiale", title: "L'Éveil de l'Éther", description: "Les premiers courants d'éther jaillissent, donnant vie à l'Aethermonde et à ses premières créatures conscientes.", universeId: "u1" },
  { id: "e3", year: -2500, era: "Ère des Ombres", title: "La Grande Éclipse", description: "Le soleil de Noctarion s'éteint définitivement, plongeant le monde dans une nuit éternelle.", universeId: "u2" },
  { id: "e4", year: -2000, era: "Ère du Brasier", title: "L'Éruption Fondatrice", description: "Le volcan Pyra-Mère entre en éruption, créant le continent igné et donnant naissance aux Ignéens.", universeId: "u3" },
  { id: "e5", year: -1500, era: "Ère du Prisme", title: "La Fracture Cristalline", description: "La réalité se brise en mille facettes, formant le Crystallis et ses infinies réflexions.", universeId: "u4" },
  { id: "e6", year: -1000, era: "Ère de l'Éther", title: "Fondation de l'Archive", description: "L'Ordre de l'Archive Éternelle est fondé pour préserver le savoir de tous les univers.", universeId: "u1" },
  { id: "e7", year: -500, era: "Ère des Conflits", title: "La Guerre des Reflets", description: "Les réalités parallèles du Crystallis entrent en collision, causant des ravages à travers le multivers.", universeId: "u4" },
  { id: "e8", year: 0, era: "Ère Présente", title: "L'Ouverture des Portails", description: "Les frontières entre les univers s'affaiblissent, permettant les premiers voyages inter-dimensionnels.", universeId: "u1" },
];

export const locations: Location[] = [
  { id: "l1", name: "La Citadelle des Brumes", description: "Forteresse flottante au cœur de l'Aethermonde, siège de l'Ordre de l'Archive Éternelle. Ses tours transpercent les nuages d'éther pur.", universeId: "u1", type: "Citadelle" },
  { id: "l2", name: "Les Abysses Silencieux", description: "Les profondeurs les plus obscures de Noctarion, où même les Ombrais n'osent s'aventurer. On dit que les ténèbres y sont vivantes.", universeId: "u2", type: "Souterrain" },
  { id: "l3", name: "La Forge Primordiale", description: "Le cœur volcanique de Pyroveil, où brûle une flamme qui n'a jamais cessé depuis la création. Les armes forgées ici sont légendaires.", universeId: "u3", type: "Forge" },
  { id: "l4", name: "Le Palais des Mille Reflets", description: "Structure cristalline impossible où chaque couloir mène à une réalité différente. Les visiteurs s'y perdent pour des siècles.", universeId: "u4", type: "Palais" },
  { id: "l5", name: "La Bibliothèque Infinie", description: "Extension impossible de l'Archive, contenant des livres de tous les univers passés, présents et futurs. Nul n'en a jamais vu la fin.", universeId: "u1", type: "Bibliothèque" },
  { id: "l6", name: "Le Marché des Ombres", description: "Bazaar souterrain où les marchands ombrais échangent des secrets, des souvenirs et des fragments de lumière.", universeId: "u2", type: "Marché" },
];

export const creatures: Creature[] = [
  { id: "cr1", name: "Dévoreur d'Éther", description: "Créature amorphe qui se nourrit de magie pure. Sa présence draine l'éther ambiant, créant des zones de vide magique mortelles pour les Éthériens.", dangerLevel: 4, universeId: "u1", habitat: "Failles éthériques", abilities: ["Drain magique", "Invisibilité éthérique", "Corruption"] },
  { id: "cr2", name: "Ombre Ancestrale", description: "Entité primordiale née de l'obscurité originelle de Noctarion. Elle dévore la lumière et les souvenirs de ses victimes.", dangerLevel: 5, universeId: "u2", habitat: "Abysses Silencieux", abilities: ["Dévorement de lumière", "Vol de mémoire", "Terreur psychique"] },
  { id: "cr3", name: "Salamandre Titanesque", description: "Lézard géant fait de magma vivant, gardien des veines volcaniques de Pyroveil. Son souffle peut faire fondre l'acier le plus pur.", dangerLevel: 4, universeId: "u3", habitat: "Veines volcaniques", abilities: ["Souffle de magma", "Régénération ignée", "Tremblement de terre"] },
  { id: "cr4", name: "Écho Brisé", description: "Fragment de réalité devenu conscient et hostile. Il copie l'apparence de ses victimes avant de les piéger dans des boucles temporelles.", dangerLevel: 3, universeId: "u4", habitat: "Fractures prismatiques", abilities: ["Mimétisme", "Boucle temporelle", "Fragmentation"] },
  { id: "cr5", name: "Luciole Funeste", description: "Essaim de créatures bioluminescentes qui attirent les voyageurs dans les ténèbres de Noctarion. Leur lumière est un leurre mortel.", dangerLevel: 2, universeId: "u2", habitat: "Marécages sombres", abilities: ["Leurre lumineux", "Paralysie", "Essaim coordonné"] },
  { id: "cr6", name: "Golem de Cristal", description: "Automate fait de cristal vivant, gardien silencieux des structures anciennes du Crystallis. Pratiquement indestructible.", dangerLevel: 3, universeId: "u4", habitat: "Ruines cristallines", abilities: ["Bouclier prismatique", "Rayon réfracté", "Régénération cristalline"] },
];

// Helper functions
export const getUniverseName = (id: string) => universes.find(u => u.id === id)?.name || "Inconnu";
export const getRaceName = (id: string) => races.find(r => r.id === id)?.name || "Inconnue";
export const getFactionName = (id: string) => factions.find(f => f.id === id)?.name || "Inconnue";
export const getCharactersByUniverse = (uid: string) => characters.filter(c => c.universeId === uid);
export const getRacesByUniverse = (uid: string) => races.filter(r => r.universeId === uid);
export const getFactionsByUniverse = (uid: string) => factions.filter(f => f.universeId === uid);
export const getEventsByUniverse = (uid: string) => timelineEvents.filter(e => e.universeId === uid);
export const getLocationsByUniverse = (uid: string) => locations.filter(l => l.universeId === uid);
