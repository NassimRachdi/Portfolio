import { ChapterStage } from './components/ChapterStage';
import { Pager } from './components/Pager';
import { MobileHeader, Sommaire } from './components/Sommaire';
import { type ChapterId } from './content/chapters';
import { About } from './chapters/About';
import { Contact } from './chapters/Contact';
import { Cover } from './chapters/Cover';
import { Experience } from './chapters/Experience';
import { Journey } from './chapters/Journey';
import { Method } from './chapters/Method';
import { Projects } from './chapters/Projects';
import { Skills } from './chapters/Skills';
import { useRoute, type Route } from './navigation/router';
import { useChapterKeyboard, useDocumentTitle } from './navigation/useBookNavigation';

/** Association chapitre → composant. Pour ajouter un chapitre : content/chapters.ts + une entrée ici. */
const views: Record<ChapterId, (props: { route: Route; active: boolean }) => React.JSX.Element> = {
  couverture: () => <Cover />,
  'a-propos': () => <About />,
  parcours: ({ route }) => <Journey route={route} />,
  experience: ({ route, active }) => <Experience route={route} active={active} />,
  projets: ({ route }) => <Projects route={route} />,
  competences: ({ route, active }) => <Skills route={route} active={active} />,
  methode: ({ route }) => <Method route={route} />,
  contact: () => <Contact />,
};

export function App() {
  const route = useRoute();
  useChapterKeyboard(route);
  useDocumentTitle(route);

  return (
    <div className="book" data-surface="night" data-chapter={route.chapter}>
      <a
        className="skip-link"
        href="#contenu"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector<HTMLElement>('.page:not([data-state="leaving"]) [data-chapter-heading]')?.focus();
        }}
      >
        Aller au contenu du chapitre
      </a>
      <Sommaire route={route} />
      <MobileHeader route={route} />
      <main className="book__main">
        <ChapterStage route={route} render={(r, active) => views[r.chapter]({ route: r, active })} />
        <Pager route={route} />
      </main>
    </div>
  );
}
