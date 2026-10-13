import { useState } from 'react';
import { chapters, pad } from '../content/chapters';
import { fullName, hasAnyContact, profile } from '../content/profile';
import { projects } from '../content/projects';
import { ChapterHeader, PageFrame } from '../components/PageFrame';
import { hrefFor } from '../navigation/router';

function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState('');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus('Adresse copiée dans le presse-papiers.');
    } catch {
      setStatus('Copie impossible : sélectionnez l’adresse manuellement.');
    }
    window.setTimeout(() => setStatus(''), 4000);
  };
  return (
    <>
      <button type="button" className="link-btn" onClick={copy}>
        Copier l’adresse
      </button>
      <span className="contact__status" role="status">
        {status}
      </span>
    </>
  );
}

export function Contact() {
  const { contact } = profile;
  const configured = hasAnyContact(contact);

  return (
    <PageFrame chapter="contact">
      <div className="spread contact">
        <div className="spread__left">
          <ChapterHeader chapter="contact" kicker="Dernière page" />
          <p className="contact__closing reveal" style={{ ['--d' as string]: 2 }}>
            Ce livre s’arrête ici.
            <br />
            <em>Le parcours, lui, continue.</em>
          </p>
          <p className="contact__text reveal" style={{ ['--d' as string]: 4 }}>
            Mon profil vous intéresse, vous souhaitez en savoir plus sur un projet ou simplement échanger ? Je serai heureux
            d’en discuter.
          </p>

          {configured ? (
            <ul className="contact__list reveal" style={{ ['--d' as string]: 5 }}>
              {contact.email && (
                <li>
                  <span className="meta">Adresse</span>
                  <a className="contact__main" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                  <CopyEmail email={contact.email} />
                </li>
              )}
              {contact.linkedin && (
                <li>
                  <span className="meta">LinkedIn</span>
                  <a className="contact__main" href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                    Voir mon profil LinkedIn<span className="sr-only"> (nouvel onglet)</span>
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </li>
              )}
              {contact.github && (
                <li>
                  <span className="meta">GitHub</span>
                  <a className="contact__main" href={contact.github} target="_blank" rel="noopener noreferrer">
                    Voir mon GitHub<span className="sr-only"> (nouvel onglet)</span>
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </li>
              )}
              {contact.cv && (
                <li>
                  <span className="meta">CV</span>
                  <a className="contact__main" href={contact.cv.href} download>
                    Télécharger mon CV — {contact.cv.label}
                  </a>
                </li>
              )}
            </ul>
          ) : (
            <div className="contact__pending reveal" style={{ ['--d' as string]: 5 }}>
              <p>Mes coordonnées publiques seront ajoutées prochainement sur cette page.</p>
              {import.meta.env.DEV && (
                <p className="dev-note">
                  <strong>Note de développement</strong> (invisible en production) : renseignez <code>email</code>,{' '}
                  <code>linkedin</code>, <code>github</code> et <code>cv</code> dans <code>src/content/profile.ts</code>. Chaque
                  lien n’apparaît qu’une fois renseigné.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="spread__right contact__recap">
          <h2 className="meta">En résumé</h2>
          <dl className="recap">
            <div>
              <dt>Qui</dt>
              <dd>
                {fullName} — {profile.positioning.toLowerCase()}.
              </dd>
            </div>
            <div>
              <dt>Aujourd’hui</dt>
              <dd>Bachelor informatique et cybersécurité en alternance (en cours), à la SNCF depuis 2023.</dd>
            </div>
            <div>
              <dt>Diplôme</dt>
              <dd>BTS SIO option SISR, obtenu en 2026.</dd>
            </div>
            <div>
              <dt>Réalisations</dt>
              <dd>
                {projects.filter((p) => p.kind === 'entreprise').length} projets d’entreprise et{' '}
                {projects.filter((p) => p.kind === 'personnel').length} projet personnel.{' '}
                <a className="inline-link" href={hrefFor('projets')}>
                  Relire les dossiers<span aria-hidden="true"> →</span>
                </a>
              </dd>
            </div>
          </dl>

          <nav className="contact__toc" aria-label="Relire un chapitre">
            <p className="meta">Relire un chapitre</p>
            <ol>
              {chapters.slice(0, -1).map((c, i) => (
                <li key={c.id}>
                  <a href={hrefFor(c.id)}>
                    <span className="meta">{pad(i + 1)}</span> {c.short}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <p className="colophon">
            <span className="meta">Colophon</span>
            Composé en Fraunces, Instrument Sans et IBM Plex Mono. Les illustrations sont des compositions abstraites et des
            schémas conceptuels : aucune capture interne n’est publiée.
          </p>
        </div>
      </div>
    </PageFrame>
  );
}
