/**
 * EXPÉRIENCE PROFESSIONNELLE (chapitre 04)
 * ----------------------------------------
 * Chaque expérience est présentée par : besoins rencontrés → contributions → apprentissages.
 * `relatedProjects` : identifiants de projets (voir projects.ts) à relier explicitement.
 */

export interface Experience {
  id: string;
  period: string;
  organisation: string;
  entity: string;
  role: string;
  status: 'termine' | 'en-cours';
  /** Une phrase qui situe le contexte pour un lecteur extérieur. */
  context: string;
  needs: string[];
  contributions: { text: string; relatedProject?: string }[];
  learnings: string[];
}

export const experiences: Experience[] = [
  {
    id: 'sncf-voyageurs',
    period: '2023 — 2025',
    organisation: 'SNCF',
    entity: 'SNCF Voyageurs',
    role: 'Alternance — BTS SIO',
    status: 'termine',
    context:
      'Au sein d’une équipe de SNCF Voyageurs (périmètre interne DDO / PCAS), j’ai travaillé sur l’outillage du quotidien des équipes : documents partagés, automatisation, poste de travail et sensibilisation à la sécurité.',
    needs: [
      'Gagner du temps sur des tâches répétitives réalisées à la main.',
      'Retrouver facilement la bonne information et la bonne version d’un document.',
      'Disposer d’un environnement de travail qui fonctionne : réseau sans fil, impression.',
      'Faire progresser les réflexes de sécurité de chacun.',
    ],
    contributions: [
      { text: 'Automatisation de tâches avec Excel et VBA.' },
      {
        text: 'Création puis évolution d’un site SharePoint d’équipe.',
        relatedProject: 'espace-sharepoint',
      },
      { text: 'Gestion des droits d’accès et des versions documentaires.' },
      { text: 'Interventions sur des sujets Wi-Fi et d’impression (Xerox / Celiveo).' },
      { text: 'Participation à un challenge de sensibilisation à la cybersécurité.' },
    ],
    learnings: [
      'Écouter les utilisateurs avant de proposer une solution.',
      'Penser accès et versions dès la conception, pas après.',
      'Documenter pour que l’outil reste utilisable sans moi.',
    ],
  },
  {
    id: 'sncf-ter-sud',
    period: '2025 — 2026',
    organisation: 'SNCF',
    entity: 'SNCF TER Sud — Direction des Opérations',
    role: 'Alternance — BTS SIO',
    status: 'termine',
    context:
      'Au sein de la Direction des Opérations, j’ai participé à des outils métier utilisés par des équipes qui manipulent au quotidien beaucoup d’informations ferroviaires.',
    needs: [
      'Des données nombreuses, issues de sources différentes, à vérifier et à comparer.',
      'Des processus qui gagneraient à être plus simples et plus rapides.',
      'Des outils qui doivent rester compréhensibles par les personnes qui les utilisent.',
    ],
    contributions: [
      { text: 'Participation au développement et à l’évolution d’outils métier.' },
      { text: 'Exploitation et comparaison de données ferroviaires.' },
      { text: 'Contribution à la simplification de processus.' },
    ],
    learnings: [
      'Structurer un problème avant de le traiter.',
      'Rendre une donnée fiable avant de la rendre visible.',
      'Travailler en équipe sur des outils partagés.',
    ],
  },
  {
    id: 'sncf-bachelor',
    period: '2026 — 2027',
    organisation: 'SNCF',
    entity: 'SNCF',
    role: 'Alternance — Bachelor informatique et cybersécurité',
    status: 'en-cours',
    context:
      'Je poursuis mon alternance à la SNCF dans le cadre de mon Bachelor informatique et cybersécurité.',
    needs: [],
    contributions: [],
    learnings: [],
  },
];

/** Expérience secondaire, hors informatique. */
export const sideExperience = {
  organisation: 'Aldi',
  text: 'En parallèle de mes études, j’ai également travaillé chez Aldi. Une expérience hors informatique qui fait aussi partie de mon parcours.',
};

/** Remarque affichée sous les expériences SNCF. */
export const enterpriseProjectsNote =
  'Les projets d’entreprise présentés au chapitre 05 sont issus de mon alternance à la SNCF. Ils y sont décrits sans données internes.';
