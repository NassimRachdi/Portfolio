import { PageFrame } from '../components/PageFrame';
import { About } from './About';
import { Cover } from './Cover';

/** Accueil : la couverture, puis la présentation, sur une seule page. */
export function Home() {
  return (
    <>
      <Cover />
      <PageFrame chapter="accueil" className="frame--home">
        <About />
      </PageFrame>
    </>
  );
}
