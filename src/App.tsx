import { ChapterStage } from './components/ChapterStage';
import { SiteNav } from './components/SiteNav';
import { type ChapterId } from './content/chapters';
import { Contact } from './chapters/Contact';
import { Home } from './chapters/Home';
import { Journey } from './chapters/Journey';
import { Projects } from './chapters/Projects';
import { Skills } from './chapters/Skills';
import { useRoute, type Route } from './navigation/router';
import { useChapterKeyboard, useDocumentTitle } from './navigation/useBookNavigation';

/** Association section → composant. Pour ajouter une section : content/chapters.ts + une entrée ici. */
const views: Record<ChapterId, (props: { route: Route; active: boolean }) => React.JSX.Element> = {
  accueil: () => <Home />,
  parcours: ({ route, active }) => <Journey route={route} active={active} />,
  projets: ({ route }) => <Projects route={route} />,
  competences: ({ route, active }) => <Skills route={route} active={active} />,
  contact: () => <Contact />,
};

export function App() {
  const route = useRoute();
  useChapterKeyboard(route);
  useDocumentTitle(route);

  return (
    <div className="book" data-surface="paper" data-chapter={route.chapter}>
      <a
        className="skip-link"
        href="#contenu"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector<HTMLElement>('.page:not([data-state="leaving"]) [data-chapter-heading]')?.focus();
        }}
      >
        Aller au contenu
      </a>
      <SiteNav route={route} />
      <main className="book__main">
        <ChapterStage route={route} render={(r, active) => views[r.chapter]({ route: r, active })} />
      </main>
    </div>
  );
}
