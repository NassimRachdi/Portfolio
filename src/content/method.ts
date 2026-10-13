/**
 * MÉTHODE & CE QUE JE CONSTRUIS (chapitre 07)
 */

export interface MethodStep {
  id: string;
  verb: string;
  text: string;
  /** Exemple concret tiré de mes projets ou expériences. */
  example: string;
  exampleProject?: string;
}

export const methodSteps: MethodStep[] = [
  {
    id: 'comprendre',
    verb: 'Comprendre le besoin',
    text: 'Écouter les personnes concernées, observer ce qu’elles font vraiment, identifier ce qui leur fait perdre du temps.',
    example: 'Les échanges avec les utilisateurs autour de la modernisation d’EasyGOV.',
    exampleProject: 'easygov',
  },
  {
    id: 'analyser',
    verb: 'Analyser l’existant',
    text: 'Regarder ce qui fonctionne déjà, ce qui doit être conservé et ce qui bloque, avant de proposer autre chose.',
    example: 'Comprendre l’outil Excel/VBA existant avant de le faire évoluer.',
    exampleProject: 'easygov',
  },
  {
    id: 'structurer',
    verb: 'Structurer l’information',
    text: 'Organiser les données, les étapes et les responsabilités pour que le problème devienne lisible.',
    example: 'Construire une logique commune entre des sources hétérogènes dans UNI GOV.',
    exampleProject: 'uni-gov-uni-data',
  },
  {
    id: 'construire',
    verb: 'Construire une première solution',
    text: 'Produire vite une première version utilisable, pour avoir quelque chose de concret à confronter au réel.',
    example: 'Le prototype Airtable de mon application de gestion pour artisans.',
    exampleProject: 'gestion-artisans',
  },
  {
    id: 'tester',
    verb: 'Tester',
    text: 'Vérifier que la solution fait ce qu’elle doit faire — y compris quand elle est développée avec l’aide de l’IA.',
    example: 'Tests et validation dans le développement de mon application.',
    exampleProject: 'gestion-artisans',
  },
  {
    id: 'corriger',
    verb: 'Corriger',
    text: 'Accepter ce que les tests et les retours révèlent, et corriger sans attendre.',
    example: 'L’amélioration continue du comparateur de compositions.',
    exampleProject: 'comparateur-compositions',
  },
  {
    id: 'documenter',
    verb: 'Documenter',
    text: 'Écrire ce qu’il faut pour qu’un outil soit utilisable et transmissible, sans dépendre de moi.',
    example: 'Les modes opératoires rédigés pour EasyGOV.',
    exampleProject: 'easygov',
  },
  {
    id: 'ameliorer',
    verb: 'Améliorer',
    text: 'Reprendre la solution à partir de l’usage réel. Une bonne solution s’affine avec le temps.',
    example: 'L’évolution progressive de l’espace SharePoint à partir des retours.',
    exampleProject: 'espace-sharepoint',
  },
];

export interface GrowthAxis {
  id: string;
  title: string;
  now: string;
  next: string;
}

export const growthAxes: GrowthAxis[] = [
  {
    id: 'systemes-reseaux',
    title: 'Systèmes et réseaux',
    now: 'Les bases acquises en BTS SIO option SISR, par la pratique en formation.',
    next: 'Les consolider dans le Bachelor, avec une vision de chef de projet.',
  },
  {
    id: 'cybersecurite',
    title: 'Cybersécurité',
    now: 'Gestion des accès, sensibilisation et protection des données dans mes projets.',
    next: 'Approfondir la sécurisation des environnements ; préparer CCNA et Stormshield.',
  },
  {
    id: 'automatisation',
    title: 'Automatisation',
    now: 'Excel, VBA et simplification de processus en entreprise.',
    next: 'Automatiser des chaînes plus complètes, avec des workflows mieux structurés.',
  },
  {
    id: 'outils-metier',
    title: 'Développement d’outils métier',
    now: 'Participation à des outils métier à la SNCF et construction de mon application.',
    next: 'Mener une application jusqu’à une bêta solide, testée et documentée.',
  },
  {
    id: 'ia',
    title: 'Usage raisonné de l’intelligence artificielle',
    now: 'L’IA m’aide à concevoir, développer, vérifier et documenter mes projets.',
    next: 'Garder une méthode exigeante : comprendre, relire et tester ce que je livre.',
  },
];

export const aiStatement = {
  title: 'L’IA, un outil de travail — pas une posture',
  paragraphs: [
    'J’utilise des outils d’intelligence artificielle, notamment Claude Code, pour m’aider à concevoir, développer, vérifier et documenter mes projets.',
    'Je ne suis ni chercheur en IA ni consultant : je m’en sers comme d’un appui. Je reste responsable de ce que je produis — je relis, je teste et je cherche à comprendre ce que j’intègre.',
  ],
};
