/**
 * PARCOURS (chapitre 03)
 * ----------------------
 * Une entrée = une étape de la timeline.
 * `status` : 'obtenu' | 'en-cours' | 'evolution'
 * `relatedExperience` : identifiant d'une expérience (voir experience.ts) vécue en parallèle.
 */

export type JourneyStatus = 'obtenu' | 'en-cours' | 'evolution';

export interface JourneyStep {
  id: string;
  period: string;
  title: string;
  subtitle?: string;
  status: JourneyStatus;
  statusLabel: string;
  summary: string;
  details: string[];
  /** Thèmes abordés pendant cette étape (affichés en liste). */
  topics?: string[];
  relatedExperience?: string[];
}

export const journey: JourneyStep[] = [
  {
    id: 'bac-sti2d',
    period: '2022',
    title: 'Baccalauréat STI2D',
    subtitle: 'Sciences et technologies de l’industrie et du développement durable',
    status: 'obtenu',
    statusLabel: 'Obtenu en 2022',
    summary: 'Un baccalauréat technologique, première approche des systèmes techniques.',
    details: [
      'Un bac technologique tourné vers les systèmes techniques et la démarche de projet.',
      'C’est le point de départ de mon intérêt pour la manière dont les systèmes fonctionnent et s’organisent.',
    ],
  },
  {
    id: 'bts-banque',
    period: '2022 — 2023',
    title: 'Première année de BTS Banque',
    status: 'evolution',
    statusLabel: 'Évolution d’orientation',
    summary: 'Une première année qui m’a aidé à préciser ce que je voulais faire.',
    details: [
      'J’ai suivi une première année de BTS Banque.',
      'Cette année m’a permis de mieux identifier ce qui me motive réellement : j’ai choisi de m’orienter vers l’informatique.',
    ],
  },
  {
    id: 'bts-sio',
    period: '2023 — 2026',
    title: 'BTS SIO, option SISR',
    subtitle: 'Solutions d’infrastructure, systèmes et réseaux — en alternance',
    status: 'obtenu',
    statusLabel: 'Diplôme obtenu en 2026',
    summary: 'Ma formation aux systèmes et réseaux, menée en alternance à la SNCF.',
    details: [
      'Une formation centrée sur l’infrastructure : administration des systèmes, réseaux, services et sécurité de base.',
      'Menée en alternance à la SNCF, ce qui m’a permis de confronter les travaux pratiques à des situations professionnelles réelles.',
    ],
    topics: [
      'Windows Server & Active Directory',
      'DNS, DHCP, GPO',
      'Linux',
      'Virtualisation (Proxmox, Hyper-V)',
      'pfSense, VLAN, VPN',
      'Supervision',
    ],
    relatedExperience: ['sncf-voyageurs', 'sncf-ter-sud'],
  },
  {
    id: 'bachelor',
    period: '2026 — 2027',
    title: 'Bachelor informatique et cybersécurité',
    subtitle: 'Titre préparé : « Chef de projet système, réseaux et sécurité » — en alternance',
    status: 'en-cours',
    statusLabel: 'Formation en cours',
    summary: 'Je poursuis vers la cybersécurité et la conduite de projets d’infrastructure.',
    details: [
      'Je prépare le titre « Chef de projet système, réseaux et sécurité », toujours en alternance à la SNCF.',
      'L’objectif : consolider mes bases systèmes et réseaux, approfondir la sécurité et apprendre à piloter des projets techniques.',
    ],
    relatedExperience: ['sncf-bachelor'],
  },
];
