import { expect, test, type Page } from '@playwright/test';

const currentHeading = (page: Page) => page.locator('.page:not([data-state="leaving"]) [data-chapter-heading]');
const isMobile = (name: string) => name === 'mobile';

const nextLink = (page: Page) => page.locator('.page:not([data-state="leaving"]) .page-end__next');
const prevLink = (page: Page) => page.locator('.page:not([data-state="leaving"]) .page-end__prev');
const mainNav = (page: Page) => page.getByRole('navigation', { name: 'Navigation principale' });

test.describe('Accueil & accès rapides', () => {
  test('les informations clés sont visibles immédiatement', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: /Nassim\s+Rachdi/ })).toBeVisible();
    await expect(page.getByText('Systèmes, réseaux, cybersécurité & automatisation')).toBeVisible();
    for (const label of ['Découvrir mon parcours', 'Voir mes projets', 'Me contacter']) {
      await expect(page.getByRole('link', { name: new RegExp(label) })).toBeVisible();
    }
    // La présentation fait partie de l'accueil.
    await expect(page.getByRole('heading', { level: 2, name: 'Ma manière de travailler' })).toBeAttached();
    await expect(page).toHaveTitle(/Nassim Rachdi/);
  });

  test('aucune erreur JavaScript sur l’ensemble des sections', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    for (const r of ['', 'parcours', 'projets', 'projets/easygov', 'competences', 'contact']) {
      await page.goto(`/#/${r}`);
      await expect(currentHeading(page)).toBeVisible();
    }
    expect(errors).toEqual([]);
  });

  test('les anciennes adresses mènent à la bonne section', async ({ page }) => {
    await page.goto('/#/experience');
    await expect(currentHeading(page)).toHaveText('Parcours');
    await page.goto('/#/competences');
    await expect(currentHeading(page)).toHaveText('Compétences');
  });
});

test.describe('Navigation', () => {
  test('cinq sections, toujours accessibles depuis la barre de navigation', async ({ page }) => {
    await page.goto('/');
    const links = mainNav(page).getByRole('link');
    await expect(links).toHaveText(['Accueil', 'Parcours', 'Projets', 'Compétences', 'Contact']);
    await expect(mainNav(page)).toBeVisible();
    await mainNav(page).getByRole('link', { name: 'Projets' }).click();
    await expect(page).toHaveURL(/#\/projets/);
    await expect(mainNav(page).getByRole('link', { name: 'Projets' })).toHaveAttribute('aria-current', 'page');
    await expect(mainNav(page)).toBeVisible();
    await mainNav(page).getByRole('link', { name: 'Contact' }).click();
    await expect(currentHeading(page)).toHaveText('Contact');
  });

  test('Suivant / Précédent en fin de page et historique du navigateur', async ({ page }) => {
    await page.goto('/');
    await nextLink(page).click();
    await expect(page).toHaveURL(/#\/parcours$/);
    await expect(currentHeading(page)).toHaveText('Parcours');
    await expect(page.locator('.ch-head__kicker')).toContainText('02 / 05');

    await nextLink(page).click();
    await expect(page).toHaveURL(/#\/projets$/);
    await prevLink(page).click();
    await expect(page).toHaveURL(/#\/parcours$/);

    await page.goBack();
    await expect(page).toHaveURL(/#\/projets$/);
    await expect(currentHeading(page)).toHaveText('Projets');
    await page.goBack();
    await page.goBack();
    await expect(currentHeading(page)).toHaveText(/Nassim/);
  });

  test('les flèches du clavier changent de section', async ({ page }, info) => {
    test.skip(isMobile(info.project.name), 'clavier : test sur ordinateur');
    await page.goto('/#/parcours');
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/#\/projets/);
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(page).toHaveURL(/#\/$/);
    // Le titre de la nouvelle section reçoit le focus.
    await expect(currentHeading(page)).toBeFocused();
  });

  test('les flèches ne changent pas de section dans un composant qui en a besoin', async ({ page }, info) => {
    test.skip(isMobile(info.project.name), 'clavier : test sur ordinateur');
    await page.goto('/#/competences');
    await page.getByRole('tab', { name: /Systèmes et réseaux/ }).focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('tab', { name: /Cybersécurité/ })).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/#\/competences/);
    await expect(page.getByRole('tab', { name: /Automatisation/ })).toBeFocused();
  });

  test('balayage horizontal sur mobile, sans gêner le défilement vertical', async ({ page }, info) => {
    test.skip(!isMobile(info.project.name), 'geste tactile : mobile');
    await page.goto('/#/parcours');
    const swipe = (dx: number, dy: number) =>
      page.evaluate(
        ([dx, dy]) => {
          const el = document.querySelector('.page:not([data-state="leaving"]) .ch-head') as HTMLElement;
          const t = (x: number, y: number) => new Touch({ identifier: 1, target: el, clientX: x, clientY: y });
          el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [t(300, 400)], changedTouches: [t(300, 400)] }));
          el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [], changedTouches: [t(300 + dx, 400 + dy)] }));
        },
        [dx, dy],
      );
    await swipe(-10, -250); // défilement vertical : rien ne change
    await expect(page).toHaveURL(/#\/parcours/);
    await swipe(-200, 10);
    await expect(page).toHaveURL(/#\/projets/);
    await page.waitForTimeout(900);
    await swipe(200, 0);
    await expect(page).toHaveURL(/#\/parcours/);
  });
});

test.describe('Projets', () => {
  test('les filtres modifient réellement la liste et l’URL', async ({ page }) => {
    await page.goto('/#/projets');
    const rows = page.locator('.page:not([data-state="leaving"]) .dossier-row');
    await expect(rows).toHaveCount(5);

    await page.getByRole('button', { name: /^Personnel/ }).click();
    await expect(rows).toHaveCount(1);
    await expect(page).toHaveURL(/type=personnel/);
    await expect(page.getByRole('button', { name: /^Personnel/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.filters__result')).toContainText('1 dossier affiché');

    await page.getByRole('button', { name: /^Documentation & collaboration/ }).click();
    await expect(rows).toHaveCount(0);
    await expect(page.getByText('Aucun dossier ne correspond')).toBeVisible();
    await page.getByRole('button', { name: 'Afficher tous les projets' }).click();
    await expect(rows).toHaveCount(5);

    await page.getByRole('button', { name: /^Données/ }).click();
    await expect(rows).toHaveCount(3);
  });

  test('ouvrir un dossier puis revenir en conservant le contexte', async ({ page }) => {
    await page.goto('/#/projets?type=entreprise');
    await page.getByRole('link', { name: /Comparateur de compositions/ }).click();
    await expect(page).toHaveURL(/#\/projets\/comparateur-compositions\?type=entreprise/);
    await expect(currentHeading(page)).toHaveText('Comparateur de compositions');

    const headings = page.locator('.dossier__section h2');
    await expect(headings).toHaveText([/Contexte/, /Problème/, /Objectif/, /Ma contribution/, /Approche/, /État actuel/, /Enseignements/]);
    await expect(page.getByText('Illustration conceptuelle', { exact: true })).toBeVisible();
    await expect(page.getByText(/Composition\s*—\s*L’ensemble des éléments matériels/)).toBeVisible();

    await page.getByRole('link', { name: /Tous les projets/ }).click();
    await expect(page).toHaveURL(/#\/projets\?type=entreprise$/);
    await expect(page.locator('.page:not([data-state="leaving"]) .dossier-row')).toHaveCount(4);
    await expect(page.locator('[data-project="comparateur-compositions"] .dossier-row__link')).toBeFocused();
  });

  test('Échap ferme un dossier ; le projet personnel est distingué', async ({ page }) => {
    await page.goto('/#/projets');
    await page.getByRole('link', { name: /Application de gestion pour artisans/ }).click();
    await expect(page.getByText('Projet personnel').first()).toBeVisible();
    await expect(page.getByText('Orientation d’architecture')).toBeVisible();
    await expect(page.getByText('Piste envisagée')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL(/#\/projets$/);
  });

  test('un dossier inconnu affiche un message propre', async ({ page }) => {
    await page.goto('/#/projets/inexistant');
    await expect(page.getByText('Ce dossier n’existe pas.')).toBeVisible();
  });
});

test.describe('Timeline, compétences, méthode', () => {
  test('la timeline révèle le détail d’une étape et relie l’expérience', async ({ page }) => {
    await page.goto('/#/parcours');
    const step = page.getByRole('button', { name: /BTS SIO, option SISR/ });
    await step.click();
    await expect(step).toHaveAttribute('aria-expanded', 'true');
    await expect(page).toHaveURL(/etape=bts-sio/);
    const panel = page.locator('#etape-bts-sio');
    await expect(panel).toContainText('Solutions d’infrastructure, systèmes et réseaux');
    await expect(panel.getByText('Diplôme obtenu en 2026')).toBeVisible();
    await panel.getByRole('link', { name: /SNCF TER Sud/ }).click();
    await expect(page).toHaveURL(/#\/parcours\?etape=bts-sio&focus=sncf-ter-sud/);
    await expect(page.locator('#xp-sncf-ter-sud')).toHaveAttribute('data-focused');
    // Le Bachelor est bien présenté comme en cours.
    await page.goto('/#/parcours?etape=bachelor');
    await expect(page.locator('#etape-bachelor')).toContainText('Formation en cours');
  });

  test('une compétence montre ce qui l’illustre et y mène', async ({ page }) => {
    await page.goto('/#/competences');
    await page.getByRole('tab', { name: /Automatisation et outils métier/ }).click();
    await page.getByRole('button', { name: /Excel & VBA/ }).click();
    await expect(page).toHaveURL(/competence=excel-vba/);
    const detail = page.locator('#skill-detail-excel-vba');
    await expect(detail).toBeVisible();
    await detail.getByRole('link', { name: /EasyGOV/ }).click();
    await expect(page).toHaveURL(/#\/projets\/easygov/);
    await expect(page.locator('.dossier__skills')).toContainText('Excel & VBA');
    // Pas de jauges ni de pourcentages.
    await page.goto('/#/competences');
    await expect(page.locator('.skills')).not.toContainText('%');
    await expect(page.locator('.skills__note')).toHaveCount(0);
    await page.getByRole('tab', { name: /Cybersécurité/ }).click();
    await expect(page.locator('.skills__note')).toContainText('Aucune n’est obtenue');
  });

  test('la méthode se parcourt étape par étape', async ({ page }) => {
    await page.goto('/#/competences');
    await page.getByRole('button', { name: /Documenter/ }).click();
    await expect(page).toHaveURL(/etape=documenter/);
    await expect(page.locator('.step[data-open]')).toContainText('modes opératoires');
  });
});

test.describe('Contact & honnêteté', () => {
  test('aucun lien trompeur tant que les coordonnées ne sont pas renseignées', async ({ page }) => {
    await page.goto('/#/contact');
    await expect(page.getByText('Mes coordonnées publiques seront ajoutées prochainement')).toBeVisible();
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.locator('a[href=""], a:not([href])')).toHaveCount(0);
    await expect(page.locator('form')).toHaveCount(0);
    // La note de développement n'apparaît pas dans la version construite.
    await expect(page.locator('.dev-note')).toHaveCount(0);
  });
});

test.describe('Réduction des animations', () => {
  test('préférence système respectée : pas de transition superposée', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('http://localhost:4174/#/parcours');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
    await nextLink(page).click();
    await expect(page.locator('.page')).toHaveCount(1);
    await expect(currentHeading(page)).toHaveText('Projets');
    await context.close();
  });

  test('avec animations : la page se tourne puis l’ancienne disparaît', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'no-preference' });
    const page = await context.newPage();
    await page.goto('http://localhost:4174/#/parcours');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
    await nextLink(page).click();
    await expect(page.locator('.page[data-state="leaving"]')).toHaveCount(1);
    await expect(page.locator('.page[data-state="leaving"]')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('.page')).toHaveCount(1, { timeout: 2000 });
    await context.close();
  });

  test('l’interrupteur de fin de page réduit les animations', async ({ browser }, info) => {
    test.skip(isMobile(info.project.name), 'interrupteur : test sur ordinateur');
    const context = await browser.newContext({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://localhost:4174/');
    const sw = page.getByRole('switch', { name: 'Réduire les animations' });
    await sw.click();
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
    await context.close();
  });
});
