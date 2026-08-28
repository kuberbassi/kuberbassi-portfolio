import { lazy, Suspense } from 'react';
import { SiGithub } from 'react-icons/si';
import type { Project } from '../../../types';
import BlurText from '../../BlurText';
import SpecularButton from '../../SpecularButton';
import { PortfolioSlide } from './PortfolioSlide';
import './WorkSection.css';

const RepositoryGallery = lazy(() =>
  import('../../cards/RepositoryGallery').then(({ RepositoryGallery: Component }) => ({ default: Component })),
);

const organizations = [
  { name: 'KuberBassi Labs', handle: 'kuberbassi-labs', href: 'https://github.com/kuberbassi-labs' },
  { name: 'VanguardLogic', handle: 'VanguardLogic', href: 'https://github.com/VanguardLogic' },
] as const;

export function WorkSection({ activeIndex, deckEnabled, mounted, projects, loading, error }: {
  activeIndex: number;
  deckEnabled: boolean;
  mounted: boolean;
  projects: Project[];
  loading: boolean;
  error: string | null;
}) {
  return (
    <PortfolioSlide id="work" index={3} activeIndex={activeIndex} deckEnabled={deckEnabled}>
      <div className="kb-section">
        <div className="kb-section-head">
          <p className="kb-label">Work</p>
          <h2>Things I've<br /><i>put into motion.</i></h2>
          <div className="kb-work-context">
            <BlurText
              text="A selection of products, experiments, and open-source work."
              animateBy="words" direction="bottom" delay={62} stepDuration={0.32} threshold={0.2}
              animationFrom={{ filter: 'blur(6px)', opacity: 0, y: 8 }}
              animationTo={[{ filter: 'blur(2px)', opacity: 0.55, y: 2 }, { filter: 'blur(0px)', opacity: 1, y: 0 }]}
              className="kb-reveal-copy kb-work-intro"
            />
            <div className="kb-work-orgs" aria-label="GitHub organizations">
              <span><SiGithub size={12} aria-hidden="true" /> Organizations</span>
              <div>{organizations.map((organization) => (
                <SpecularButton
                  className="kb-work-org-link" href={organization.href} key={organization.handle}
                  target="_blank" rel="noopener noreferrer" size="sm" radius={999} tint="#090908"
                  tintOpacity={0.58} lineColor="#d5b27e" baseColor="#403629" intensity={0.8}
                  shineSize={12} shineFade={30}
                >
                  <img src={`https://github.com/${organization.handle}.png?size=48`} alt="" loading="lazy" decoding="async" />
                  <span>{organization.name}</span>
                </SpecularButton>
              ))}</div>
            </div>
          </div>
        </div>
        <div className="project-orbit">
          {mounted && (
            <Suspense fallback={<div className="repo-gallery-shell repo-gallery-shell--loading" aria-hidden="true" />}>
              <RepositoryGallery projects={projects} loading={loading} error={error} />
            </Suspense>
          )}
        </div>
      </div>
    </PortfolioSlide>
  );
}
