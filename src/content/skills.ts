/**
 * COMPÉTENCES (chapitre 06)
 * -------------------------
 * Pas de jauges ni de pourcentages : chaque compétence porte un ou plusieurs
 * niveaux d'usage honnêtes, et renvoie vers les projets, expériences ou formations
 * qui l'illustrent (`evidence`).
 *
 * Types de preuve :
 *   { type: 'project', id: '<id de projects.ts>' }
 *   { type: 'experience', id: '<id de experience.ts>' }
 *   { type: 'journey', id: '<id de journey.ts>' }
 */

export type SkillUsage =
  | 'entreprise'
  | 'formation'
  | 'personnel'
  | 'apprentissage'
  | 'orientation'
  | 'piste';

export const usageLabels: Record<SkillUsage, string> = {
  entreprise: 'Utilisé en entreprise',
  formation: 'Pratiqué en formation',
  personnel: 'Mobilisé dans un projet personnel',
  apprentissage: 'En cours d’apprentissage',
  orientation: 'Choix d’architecture',
  piste: 'Intégration envisagée',
};

export type Evidence =
  | { type: 'project'; id: string; note?: string }
  | { type: 'experience'; id: string; note?: string }
  | { type: 'journey'; id: string; note?: string };

export interface Skill {
  id: string;
  name: string;
  usage: SkillUsage[];
  /** Ce que j'en ai fait, ou dans quel contexte je la travaille. */
  practice: string;
  evidence: Evidence[];
}

export interface SkillFamily {
  id: string;
  number: string;
  title: string;
  intro: string;
  skills: Skill[];
  /** Remarque d'honnêteté affichée en pied de famille. */
  note?: string;
}

export const skillFamilies: SkillFamily[] = [
  {
    id: 'systemes-reseaux',
    number: 'I',
    title: 'Systèmes et réseaux',
    intro:
      'Le socle de ma formation SISR : des travaux pratiques pour comprendre comment une infrastructure se construit, se configure et se surveille. Il s’agit de compétences pratiquées et étudiées, pas d’une expertise de production.',
    skills: [
      {
        id: 'windows-server-ad',
        name: 'Windows Server & Active Directory',
        usage: ['formation'],
        practice: 'Mise en place d’un domaine, gestion des utilisateurs et des groupes en travaux pratiques.',
        evidence: [{ type: 'journey', id: 'bts-sio' }],
      },
      {
        id: 'dns-dhcp-gpo',
        name: 'DNS, DHCP, GPO',
        usage: ['formation'],
        practice: 'Configuration des services réseau de base et de stratégies de groupe en environnement de TP.',
        evidence: [{ type: 'journey', id: 'bts-sio' }],
      },
      {
        id: 'linux',
        name: 'Linux',
        usage: ['formation'],
        practice: 'Administration de base et services en environnement de travaux pratiques.',
        evidence: [{ type: 'journey', id: 'bts-sio' }],
      },
      {
        id: 'virtualisation',
        name: 'Virtualisation — Proxmox, Hyper-V',
        usage: ['formation'],
        practice: 'Création de machines virtuelles pour monter des maquettes d’infrastructure.',
        evidence: [{ type: 'journey', id: 'bts-sio' }],
      },
      {
        id: 'pfsense-vlan-vpn',
        name: 'pfSense, VLAN, VPN',
        usage: ['formation', 'apprentissage'],
        practice: 'Segmentation réseau, filtrage et accès distant étudiés en formation, approfondis dans le Bachelor.',
        evidence: [
          { type: 'journey', id: 'bts-sio' },
          { type: 'journey', id: 'bachelor' },
        ],
      },
      {
        id: 'supervision',
        name: 'Supervision',
        usage: ['formation'],
        practice: 'Principes de surveillance d’une infrastructure étudiés en formation.',
        evidence: [{ type: 'journey', id: 'bts-sio' }],
      },
      {
        id: 'wifi-impression',
        name: 'Wi-Fi & impression',
        usage: ['entreprise'],
        practice: 'Interventions sur des sujets Wi-Fi et d’impression (Xerox / Celiveo) en entreprise.',
        evidence: [{ type: 'experience', id: 'sncf-voyageurs' }],
      },
    ],
  },
  {
    id: 'cybersecurite',
    number: 'II',
    title: 'Cybersécurité',
    intro:
      'Une formation en cours, et des réflexes que j’applique déjà : maîtriser les accès, sensibiliser, protéger les données dès la conception d’un projet.',
    skills: [
      {
        id: 'droits-acces',
        name: 'Gestion des droits et des accès',
        usage: ['entreprise', 'personnel'],
        practice:
          'Droits sur un espace documentaire en entreprise ; comptes, accès et séparation des données dans mon application.',
        evidence: [
          { type: 'project', id: 'espace-sharepoint' },
          { type: 'experience', id: 'sncf-voyageurs' },
          { type: 'project', id: 'gestion-artisans' },
        ],
      },
      {
        id: 'sensibilisation',
        name: 'Sensibilisation à la sécurité',
        usage: ['entreprise'],
        practice: 'Participation à un challenge de sensibilisation à la cybersécurité.',
        evidence: [{ type: 'experience', id: 'sncf-voyageurs' }],
      },
      {
        id: 'securisation',
        name: 'Sécurisation des environnements',
        usage: ['formation', 'apprentissage'],
        practice: 'Au cœur de mon Bachelor informatique et cybersécurité, actuellement en cours.',
        evidence: [{ type: 'journey', id: 'bachelor' }],
      },
      {
        id: 'protection-donnees',
        name: 'Protection des données dans les projets',
        usage: ['personnel', 'entreprise'],
        practice:
          'Séparation des données entre entreprises dans mon application ; présentation de projets sans données internes.',
        evidence: [
          { type: 'project', id: 'gestion-artisans' },
          { type: 'project', id: 'uni-gov-uni-data' },
        ],
      },
    ],
    note: 'CCNA et Stormshield : certifications en préparation. Aucune n’est obtenue à ce jour.',
  },
  {
    id: 'automatisation',
    number: 'III',
    title: 'Automatisation et outils métier',
    intro:
      'Ce que je pratique le plus en entreprise : comprendre un besoin, simplifier un processus et outiller les équipes.',
    skills: [
      {
        id: 'excel-vba',
        name: 'Excel & VBA',
        usage: ['entreprise'],
        practice: 'Automatisation de tâches répétitives ; participation à la modernisation d’un outil Excel/VBA.',
        evidence: [
          { type: 'experience', id: 'sncf-voyageurs' },
          { type: 'project', id: 'easygov' },
        ],
      },
      {
        id: 'analyse-besoins',
        name: 'Analyse de besoins',
        usage: ['entreprise', 'personnel'],
        practice: 'Échanges avec les utilisateurs, cadrage d’un besoin, définition d’un périmètre.',
        evidence: [
          { type: 'project', id: 'easygov' },
          { type: 'project', id: 'uni-gov-uni-data' },
          { type: 'project', id: 'gestion-artisans' },
        ],
      },
      {
        id: 'simplification',
        name: 'Simplification de processus',
        usage: ['entreprise'],
        practice: 'Contribution à la simplification de processus au sein de la Direction des Opérations.',
        evidence: [
          { type: 'experience', id: 'sncf-ter-sud' },
          { type: 'project', id: 'easygov' },
        ],
      },
      {
        id: 'traitement-donnees',
        name: 'Traitement et comparaison de données',
        usage: ['entreprise'],
        practice: 'Comparaison de situations, rapprochement de sources, contrôle de la qualité.',
        evidence: [
          { type: 'project', id: 'comparateur-compositions' },
          { type: 'project', id: 'uni-gov-uni-data' },
          { type: 'experience', id: 'sncf-ter-sud' },
        ],
      },
      {
        id: 'supports',
        name: 'Conception de supports d’utilisation',
        usage: ['entreprise'],
        practice: 'Modes opératoires et supports explicatifs pour accompagner les utilisateurs.',
        evidence: [
          { type: 'project', id: 'easygov' },
          { type: 'project', id: 'uni-gov-uni-data' },
        ],
      },
    ],
  },
  {
    id: 'collaboration',
    number: 'IV',
    title: 'Collaboration et documentation',
    intro: 'Un outil n’est utile que s’il est compris et partagé. Documenter et expliquer font partie de mon travail.',
    skills: [
      {
        id: 'sharepoint',
        name: 'SharePoint',
        usage: ['entreprise'],
        practice: 'Création puis évolution d’un espace d’équipe.',
        evidence: [
          { type: 'project', id: 'espace-sharepoint' },
          { type: 'experience', id: 'sncf-voyageurs' },
        ],
      },
      {
        id: 'organisation-documentaire',
        name: 'Organisation documentaire',
        usage: ['entreprise'],
        practice: 'Structuration des contenus pour faciliter l’accès à l’information.',
        evidence: [{ type: 'project', id: 'espace-sharepoint' }],
      },
      {
        id: 'versions',
        name: 'Gestion des versions',
        usage: ['entreprise', 'personnel'],
        practice: 'Versions documentaires sur SharePoint ; versionnement du code avec Git.',
        evidence: [
          { type: 'project', id: 'espace-sharepoint' },
          { type: 'project', id: 'gestion-artisans' },
        ],
      },
      {
        id: 'modes-operatoires',
        name: 'Modes opératoires',
        usage: ['entreprise'],
        practice: 'Rédaction de modes opératoires pour documenter les usages d’un outil métier.',
        evidence: [{ type: 'project', id: 'easygov' }],
      },
      {
        id: 'presentations',
        name: 'Présentations',
        usage: ['entreprise'],
        practice: 'Présentation d’un projet et préparation de supports explicatifs.',
        evidence: [{ type: 'project', id: 'uni-gov-uni-data' }],
      },
      {
        id: 'communication',
        name: 'Communication avec les utilisateurs',
        usage: ['entreprise'],
        practice: 'Recueil des besoins et des retours, accompagnement au changement.',
        evidence: [
          { type: 'project', id: 'easygov' },
          { type: 'project', id: 'espace-sharepoint' },
        ],
      },
    ],
  },
  {
    id: 'applications-donnees',
    number: 'V',
    title: 'Construction d’applications et données',
    intro:
      'Ce que je construis dans mon projet personnel. Je distingue ce que j’utilise réellement, les choix d’architecture et les intégrations seulement envisagées.',
    skills: [
      {
        id: 'airtable',
        name: 'Airtable',
        usage: ['personnel'],
        practice: 'Premier prototype de mon application de gestion.',
        evidence: [{ type: 'project', id: 'gestion-artisans' }],
      },
      {
        id: 'supabase-postgresql',
        name: 'Supabase & PostgreSQL',
        usage: ['personnel', 'apprentissage'],
        practice: 'Modélisation des données, comptes, accès et séparation des données entre entreprises.',
        evidence: [{ type: 'project', id: 'gestion-artisans' }],
      },
      {
        id: 'api',
        name: 'API',
        usage: ['personnel', 'apprentissage'],
        practice: 'Conception d’échanges entre l’interface et les données de l’application.',
        evidence: [{ type: 'project', id: 'gestion-artisans' }],
      },
      {
        id: 'git-vscode',
        name: 'Git & VS Code',
        usage: ['personnel'],
        practice: 'Environnement de développement et historique du code de mon projet.',
        evidence: [{ type: 'project', id: 'gestion-artisans' }],
      },
      {
        id: 'ia-dev',
        name: 'Développement assisté par IA',
        usage: ['personnel'],
        practice: 'Claude Code pour concevoir, développer, vérifier et documenter — avec relecture et tests.',
        evidence: [{ type: 'project', id: 'gestion-artisans' }],
      },
      {
        id: 'nextjs-pwa',
        name: 'Next.js / PWA',
        usage: ['orientation', 'apprentissage'],
        practice: 'Direction d’architecture retenue pour l’interface web de mon application.',
        evidence: [{ type: 'project', id: 'gestion-artisans' }],
      },
      {
        id: 'power-automate-dataverse',
        name: 'Power Automate & Dataverse',
        usage: ['piste'],
        practice: 'Connexions envisagées pour de futures automatisations. Rien n’est livré à ce stade.',
        evidence: [{ type: 'project', id: 'gestion-artisans' }],
      },
    ],
  },
];

export const allSkills = skillFamilies.flatMap((f) => f.skills.map((s) => ({ ...s, familyId: f.id })));

/** Compétences reliées à un élément (projet, expérience…) : utilisé dans les dossiers projet. */
export const skillsFor = (type: Evidence['type'], id: string) =>
  allSkills.filter((s) => s.evidence.some((e) => e.type === type && e.id === id));
