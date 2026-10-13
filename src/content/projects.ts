/**
 * PROJETS (chapitre 05)
 * ---------------------
 * Pour ajouter un projet : copie un objet du tableau `projects`, change son `id`
 * (utilisé dans l'URL : #/projets/<id>) et remplis les sections.
 *
 * Structure éditoriale imposée à chaque dossier :
 *   contexte → problème → objectif → ma contribution → approche → état actuel → enseignements
 *
 * `visual` choisit l'illustration conceptuelle du dossier (voir components/ProjectVisual.tsx).
 * Ces illustrations sont des schémas : elles ne représentent jamais une capture réelle.
 */

export type ProjectKind = 'entreprise' | 'personnel';

export type ProjectTheme = 'outil-metier' | 'automatisation' | 'donnees' | 'documentation' | 'application';

export const themeLabels: Record<ProjectTheme, string> = {
  'outil-metier': 'Outils métier',
  automatisation: 'Automatisation',
  donnees: 'Données',
  documentation: 'Documentation & collaboration',
  application: 'Application web',
};

export const kindLabels: Record<ProjectKind, string> = {
  entreprise: 'Projet d’entreprise',
  personnel: 'Projet personnel',
};

/** Nature d'un élément technique : réalisé, en cours, choix d'orientation ou simple piste. */
export type StackNature = 'realise' | 'en-cours' | 'orientation' | 'piste';

export const stackNatureLabels: Record<StackNature, string> = {
  realise: 'Réalisé',
  'en-cours': 'En développement',
  orientation: 'Orientation d’architecture',
  piste: 'Piste envisagée',
};

export type ProjectVisualKind = 'evolution' | 'diff' | 'pipeline' | 'structure' | 'interface';

export interface ProjectSection {
  /** Paragraphe(s) d'introduction de la section. */
  text?: string[];
  /** Liste à puces facultative. */
  list?: string[];
  /** Liste ordonnée (étapes) facultative. */
  steps?: string[];
}

export interface Project {
  id: string;
  letter: string;
  title: string;
  kind: ProjectKind;
  category: string;
  themes: ProjectTheme[];
  teaser: string;
  status: { label: string; tone: 'progress' | 'done' | 'mixed' };
  collective: boolean;
  /** Notion expliquée simplement pour un lecteur non spécialiste. */
  glossary?: { term: string; definition: string }[];
  sections: {
    contexte: ProjectSection;
    probleme: ProjectSection;
    objectif: ProjectSection;
    contribution: ProjectSection;
    approche: ProjectSection;
    etat: ProjectSection;
    enseignements: ProjectSection;
  };
  /** Périmètre fonctionnel visé (pas forcément livré). */
  scope?: { title: string; items: string[] };
  stack?: { name: string; nature: StackNature; note?: string }[];
  nextSteps?: { title: string; items: string[] };
  visual: ProjectVisualKind;
  visualCaption: string;
  /** Mention de confidentialité affichée en bas du dossier. */
  disclosure?: string;
}

export const sectionOrder: { key: keyof Project['sections']; label: string }[] = [
  { key: 'contexte', label: 'Contexte' },
  { key: 'probleme', label: 'Problème' },
  { key: 'objectif', label: 'Objectif' },
  { key: 'contribution', label: 'Ma contribution' },
  { key: 'approche', label: 'Approche' },
  { key: 'etat', label: 'État actuel' },
  { key: 'enseignements', label: 'Enseignements' },
];

const enterpriseDisclosure =
  'Projet mené dans un cadre professionnel. Aucune capture, donnée interne ou statistique n’est publiée ici : les illustrations sont des schémas conceptuels.';

export const projects: Project[] = [
  {
    id: 'easygov',
    letter: 'A',
    title: 'EasyGOV',
    kind: 'entreprise',
    category: 'Outil métier · Automatisation',
    themes: ['outil-metier', 'automatisation', 'documentation'],
    teaser:
      'Faire évoluer un outil métier construit sous Excel/VBA vers une application Windows plus simple, plus structurée et plus pratique.',
    status: { label: 'Participation à la modernisation', tone: 'mixed' },
    collective: true,
    sections: {
      contexte: {
        text: [
          'Dans un environnement ferroviaire, des équipes doivent manipuler, vérifier et exploiter des informations opérationnelles. Elles s’appuyaient pour cela sur un outil construit sous Excel et VBA.',
        ],
      },
      probleme: {
        text: [
          'Un outil construit au fil des besoins rend service, mais il peut devenir moins pratique à utiliser, plus difficile à faire évoluer et à transmettre à de nouveaux utilisateurs.',
        ],
      },
      objectif: {
        text: [
          'Faire évoluer cet outil vers une application Windows, pour un usage plus simple, plus structuré et plus pratique — en accompagnant les utilisateurs dans ce changement.',
        ],
      },
      contribution: {
        text: [
          'Il s’agit d’un travail collectif. J’ai participé, au sein de l’équipe, à cette modernisation :',
        ],
        list: [
          'compréhension des besoins et échanges avec les utilisateurs ;',
          'organisation des étapes de la modernisation ;',
          'automatisation de certains usages ;',
          'rédaction de modes opératoires pour documenter l’utilisation.',
        ],
      },
      approche: {
        steps: [
          'Partir des usages réels : ce que les utilisateurs font, dans quel ordre, avec quelles difficultés.',
          'Organiser la modernisation en étapes successives.',
          'Automatiser ce qui était répétitif.',
          'Documenter les usages dans des modes opératoires clairs.',
        ],
      },
      etat: {
        text: [
          'Je présente ici ma participation à cette évolution. Le détail technique, le périmètre et les résultats internes de l’outil ne sont pas publiés dans ce portfolio.',
        ],
      },
      enseignements: {
        list: [
          'Moderniser un outil, c’est d’abord comprendre comment il est réellement utilisé.',
          'Une bonne documentation fait partie de la solution, pas de l’après.',
          'Avancer par étapes permet de garder les utilisateurs avec soi.',
        ],
      },
    },
    visual: 'evolution',
    visualCaption: 'Schéma conceptuel — de l’outil Excel/VBA à l’application Windows documentée.',
    disclosure: enterpriseDisclosure,
  },
  {
    id: 'comparateur-compositions',
    letter: 'B',
    title: 'Comparateur de compositions',
    kind: 'entreprise',
    category: 'Analyse · Outil métier',
    themes: ['outil-metier', 'donnees'],
    teaser:
      'Comparer deux situations et repérer immédiatement ce qui a changé dans la composition des trains : ce qui a été ajouté, ce qui a été retiré.',
    status: { label: 'Participation au développement', tone: 'mixed' },
    collective: true,
    glossary: [
      {
        term: 'Composition',
        definition:
          'L’ensemble des éléments matériels qui constituent un train — par exemple les rames assemblées pour une circulation.',
      },
    ],
    sections: {
      contexte: {
        text: [
          'Dans l’exploitation ferroviaire, la composition d’un train peut changer d’une situation à l’autre. Suivre ces évolutions sur de nombreuses circulations demande beaucoup d’attention.',
          'Le principe est le même qu’une comparaison entre deux versions d’un document : on veut voir tout de suite ce qui a été ajouté et ce qui a été supprimé.',
        ],
      },
      probleme: {
        text: [
          'Repérer les différences entre deux situations en comparant les informations ligne à ligne est long, et propice aux oublis.',
        ],
      },
      objectif: {
        text: [
          'Faciliter la comparaison de compositions ferroviaires et rendre les différences entre deux situations immédiatement identifiables.',
        ],
      },
      contribution: {
        text: ['J’ai participé au développement et à l’amélioration de l’outil.'],
      },
      approche: {
        steps: [
          'Travailler sur une vue hebdomadaire.',
          'Comparer des séries ou des rames entre deux situations.',
          'Identifier et mettre en évidence les ajouts et les suppressions.',
        ],
      },
      etat: {
        text: [
          'D’autres évolutions, comme un contrôle de capacité, peuvent être envisagées : elles ne font pas partie des fonctionnalités actuelles de l’outil.',
        ],
      },
      enseignements: {
        list: [
          'Une bonne comparaison commence par des données réellement comparables.',
          'Rendre une différence visible vaut souvent mieux qu’un long tableau.',
          'Un outil métier doit être compris par quelqu’un qui ne l’a pas conçu.',
        ],
      },
    },
    visual: 'diff',
    visualCaption: 'Illustration conceptuelle — données fictives. Deux situations comparées, ajouts et retraits mis en évidence.',
    disclosure: enterpriseDisclosure,
  },
  {
    id: 'uni-gov-uni-data',
    letter: 'C',
    title: 'UNI GOV / UNI DATA',
    kind: 'entreprise',
    category: 'Structuration de données · Analyse métier',
    themes: ['donnees', 'documentation'],
    teaser:
      'Rassembler des informations dispersées dans des sources métier hétérogènes pour travailler plus vite, de façon plus fiable, sur une base commune.',
    status: { label: 'UNI GOV : première concrétisation · UNI DATA : perspective', tone: 'progress' },
    collective: true,
    sections: {
      contexte: {
        text: [
          'Les informations utiles aux équipes proviennent de sources métier hétérogènes et de nombreux fichiers de travail.',
        ],
      },
      probleme: {
        text: [
          'Dispersées, ces informations ne sont pas toujours directement comparables, ni exploitables collectivement. Les rapprocher prend du temps et fragilise la fiabilité des analyses.',
        ],
      },
      objectif: {
        text: [
          'Rassembler, harmoniser et rendre exploitables ces informations, pour travailler de manière plus rapide, plus fiable et plus efficace.',
        ],
      },
      contribution: {
        text: ['J’ai participé à plusieurs dimensions du projet :'],
        list: [
          'le cadrage du besoin ;',
          'la structuration de la démarche ;',
          'la présentation du projet ;',
          'la préparation de supports explicatifs.',
        ],
      },
      approche: {
        steps: [
          'Identifier le problème.',
          'Recueillir les besoins.',
          'Rapprocher les sources.',
          'Construire une logique commune.',
          'Contrôler la qualité.',
          'Analyser et comparer.',
          'Préparer la restitution.',
        ],
      },
      etat: {
        text: [
          'UNI GOV correspond à une première concrétisation, sur un périmètre défini.',
          'UNI DATA porte la perspective d’un élargissement : c’est une direction de travail, pas une plateforme terminée et déployée.',
        ],
      },
      enseignements: {
        list: [
          'Avant d’analyser, il faut s’accorder sur une logique commune.',
          'La qualité des données se contrôle à chaque étape, pas seulement à la fin.',
          'Expliquer clairement un projet fait partie du projet.',
        ],
      },
    },
    visual: 'pipeline',
    visualCaption: 'Schéma conceptuel — des sources hétérogènes à une restitution commune.',
    disclosure: enterpriseDisclosure,
  },
  {
    id: 'espace-sharepoint',
    letter: 'D',
    title: 'Espace SharePoint',
    kind: 'entreprise',
    category: 'Collaboration · Documentation',
    themes: ['documentation'],
    teaser:
      'Créer puis faire évoluer un espace documentaire pour que chacun trouve la bonne information, dans la bonne version, avec les bons accès.',
    status: { label: 'Créé puis amélioré par étapes', tone: 'done' },
    collective: false,
    sections: {
      contexte: {
        text: [
          'Une équipe qui partage de nombreux documents et informations, et qui a besoin d’un point d’accès commun.',
        ],
      },
      probleme: {
        text: [
          'Quand les documents sont dispersés, on perd du temps à chercher, on doute de la bonne version et les accès deviennent difficiles à maîtriser.',
        ],
      },
      objectif: {
        text: ['Faciliter l’accès à l’information et l’organisation documentaire de l’équipe.'],
      },
      contribution: {
        text: ['J’ai travaillé sur la création de l’espace SharePoint, puis sur son évolution :'],
        list: [
          'structuration des contenus ;',
          'gestion des accès ;',
          'gestion des versions documentaires ;',
          'prise en compte des besoins et des retours des utilisateurs.',
        ],
      },
      approche: {
        steps: [
          'Structurer les contenus pour qu’ils soient faciles à retrouver.',
          'Définir qui accède à quoi.',
          'Mettre en place une gestion des versions.',
          'Améliorer progressivement à partir des retours.',
        ],
      },
      etat: {
        text: [
          'L’espace a été créé puis amélioré par étapes. Aucune capture, aucun document réel et aucune statistique d’usage ne sont publiés : il s’agit d’un espace interne.',
        ],
      },
      enseignements: {
        list: [
          'Une organisation documentaire se conçoit avec ceux qui l’utilisent.',
          'Les droits d’accès relèvent autant de la sécurité que de l’organisation.',
          'Un espace utile n’est jamais terminé : il s’améliore avec l’usage.',
        ],
      },
    },
    visual: 'structure',
    visualCaption: 'Schéma conceptuel — contenus structurés, accès et versions.',
    disclosure: enterpriseDisclosure,
  },
  {
    id: 'gestion-artisans',
    letter: 'E',
    title: 'Application de gestion pour artisans',
    kind: 'personnel',
    category: 'Application web · Automatisation',
    themes: ['application', 'automatisation', 'donnees'],
    teaser:
      'Une application web pour rendre la gestion administrative plus simple aux artisans, micro-entrepreneurs et petites structures : devis, factures, paiements, relances.',
    status: { label: 'En développement — bêta en préparation', tone: 'progress' },
    collective: false,
    sections: {
      contexte: {
        text: [
          'Artisans, micro-entrepreneurs et petites structures doivent gérer, en plus de leur métier, de nombreuses tâches administratives : devis, factures, paiements, relances.',
        ],
      },
      probleme: {
        text: [
          'Ces tâches sont répétitives et souvent réparties entre plusieurs fichiers ou outils. Pour quelqu’un qui veut une gestion simple, c’est du temps et de l’énergie en moins pour son activité.',
        ],
      },
      objectif: {
        text: [
          'Réduire les manipulations répétitives et rendre les tâches administratives plus accessibles, dans une application pensée pour une gestion simple.',
        ],
      },
      contribution: {
        text: [
          'C’est mon projet personnel : je le conçois et je le développe. Je travaille avec des outils d’IA, notamment Claude Code, aux côtés de VS Code et Git — en portant une attention particulière à la vérification du fonctionnement.',
        ],
      },
      approche: {
        steps: [
          'Prototypage avec Airtable pour poser un premier modèle.',
          'Développement autour de Supabase / PostgreSQL, avec une logique applicative plus structurée.',
          'Orientation vers une interface web de type Next.js / PWA.',
        ],
        list: [
          'Modélisation des données',
          'Comptes et accès',
          'Séparation des données entre entreprises',
          'Chaîne de facturation',
          'API',
          'Tests et validation',
          'Documentation',
        ],
      },
      etat: {
        text: [
          'L’application est en cours de développement, avec une bêta en préparation et des chantiers encore ouverts.',
          'Il n’y a pas de lancement commercial à ce jour, et je ne présente pas l’application comme validée sur le plan réglementaire.',
        ],
      },
      enseignements: {
        list: [
          'Un modèle de données solide simplifie tout le reste.',
          'Séparer les données de chaque entreprise est une exigence de départ, pas une option.',
          'L’IA accélère le développement ; la vérification reste mon travail.',
        ],
      },
    },
    scope: {
      title: 'Périmètre visé',
      items: [
        'Clients',
        'Prestations et produits',
        'Devis',
        'Factures',
        'Avoirs',
        'Paiements',
        'Dépenses',
        'Chiffre d’affaires encaissé',
        'Documents',
        'Relances',
      ],
    },
    stack: [
      { name: 'Airtable', nature: 'realise', note: 'Premier prototype' },
      { name: 'Supabase / PostgreSQL', nature: 'en-cours', note: 'Base et logique applicative' },
      { name: 'Git · VS Code · Claude Code', nature: 'en-cours', note: 'Outils de développement' },
      { name: 'Next.js / PWA', nature: 'orientation', note: 'Direction retenue pour l’interface web' },
      { name: 'Power Automate · Dataverse', nature: 'piste', note: 'Connexions éventuelles' },
    ],
    nextSteps: {
      title: 'Évolutions envisagées',
      items: [
        'Préremplissage à partir des informations de l’entreprise et de son catalogue.',
        'Automatisations supplémentaires et workflows.',
        'Connexions éventuelles à Power Automate ou Dataverse.',
      ],
    },
    visual: 'interface',
    visualCaption: 'Aperçu d’interface conceptuel — données fictives. Ce n’est pas une capture de l’application.',
  },
];

export const projectById = (id: string) => projects.find((p) => p.id === id);
