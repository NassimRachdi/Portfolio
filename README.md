# Portfolio — Nassim Rachdi

Un portfolio pensé comme un **livre numérique interactif** en huit chapitres : couverture, à propos, parcours, expérience, projets, compétences, méthode et contact.

Stack : **Vite + React + TypeScript**, polices auto-hébergées (Fraunces, Instrument Sans, IBM Plex Mono). Aucune autre bibliothèque d'interface ni d'animation.

## Lancer le site en local

Prérequis : [Node.js](https://nodejs.org/) 20 ou plus récent.

```bash
npm install        # une seule fois
npm run dev        # serveur de développement → http://localhost:5173
```

Ouvrez ensuite **http://localhost:5173** dans votre navigateur. Les modifications du code s'affichent instantanément.

Pour tester la version finale, telle qu'elle serait publiée :

```bash
npm run build      # génère le dossier dist/
npm run preview    # sert dist/ → http://localhost:4173
```

### Sans droits administrateur : la version autonome

`npm run build:autonome` produit `dist-autonome/index.html` : un seul fichier qui contient le code, les styles et les polices. Il s'ouvre par double-clic dans n'importe quel navigateur, sans installation ni serveur. C'est la version à utiliser sur un poste où l'on ne peut rien installer.

## Vérifications

```bash
npm run typecheck  # vérification TypeScript
npm run build      # compilation de production
npm run test:e2e   # tests de navigation et d'interactions (ordinateur + mobile)
```

Avant le premier lancement des tests sur votre machine, installez le navigateur de test : `npx playwright install chromium`.

## Où modifier les contenus

Tout le texte est centralisé dans `src/content/` : il n'est pas nécessaire de toucher aux composants.

| Fichier | Contenu |
| --- | --- |
| `src/content/profile.ts` | Nom, positionnement, accroche, repères « en bref », **photo, e-mail, LinkedIn, GitHub, CV** |
| `src/content/chapters.ts` | Ordre, titres et surface (sombre / papier) des chapitres |
| `src/content/about.ts` | Chapitre « À propos » |
| `src/content/journey.ts` | Timeline du parcours (formations) |
| `src/content/experience.ts` | Expériences professionnelles et expérience secondaire |
| `src/content/projects.ts` | Dossiers projets (ajouter un projet = copier un objet) |
| `src/content/skills.ts` | Familles de compétences, niveaux d'usage et liens vers les preuves |
| `src/content/method.ts` | Méthode, axes de progression, usage de l'IA |

Les paramètres visuels (couleurs, polices, tailles, durées d'animation) se trouvent dans `src/styles/tokens.css`.

### Renseigner les coordonnées et le CV

Dans `src/content/profile.ts`, remplacez les valeurs `null` :

```ts
contact: {
  email: 'adresse@exemple.fr',
  linkedin: 'https://www.linkedin.com/in/…',
  github: 'https://github.com/…',
  cv: { href: 'cv/CV-Nassim-Rachdi.pdf', label: 'PDF' }, // fichier à placer dans public/cv/
},
```

Un lien laissé à `null` n'est jamais affiché, ce qui évite les boutons vides ou trompeurs.

### Ajouter une photo

Placez l'image dans `public/images/`, puis renseignez `photo: { src: 'images/portrait.jpg', alt: '…' }` dans `profile.ts`. Sans photo, la couverture affiche une composition abstraite et le monogramme « NR ».

## Organisation du code

```
src/
  content/       contenus (textes, projets, compétences…)
  navigation/    routeur (URL par hash), clavier, balayage, titre de page
  components/    sommaire, pagination, scène des pages, illustrations
  chapters/      un composant par chapitre
  styles/        tokens, base, mise en page, mouvement, chapitres
  lib/           préférences d'animation, chapitres consultés, défilement
tests/           tests Playwright
```

## Publication

Le dossier `dist/` produit par `npm run build` est un site statique : il fonctionne sur n'importe quel hébergeur (GitHub Pages, Netlify, Vercel, hébergement mutualisé…) sans configuration serveur, car la navigation repose sur le hash de l'URL (`#/projets`).

Une fois l'adresse définitive connue, ajoutez `og:url` et passez `og:image` en URL absolue dans `index.html` pour un aperçu de partage optimal.
