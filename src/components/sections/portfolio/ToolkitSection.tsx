import { lazy, Suspense, useEffect, useState } from 'react';
import { PortfolioSlide } from './PortfolioSlide';

const SkillObservatory = lazy(() =>
  import('../SkillObservatory').then(({ SkillObservatory: Component }) => ({ default: Component })),
);

export function ToolkitSection({ activeIndex, leavingIndex, deckEnabled }: {
  activeIndex: number;
  leavingIndex: number | null;
  deckEnabled: boolean;
}) {
  const active = activeIndex === 2;
  const [hasVisited, setHasVisited] = useState(false);
  useEffect(() => {
    if (active) setHasVisited(true);
  }, [active]);
  const present = !deckEnabled || active || leavingIndex === 2 || hasVisited;
  return (
    <PortfolioSlide id="toolkit" index={2} activeIndex={activeIndex} deckEnabled={deckEnabled}>
      <div className="kb-section kb-arsenal kb-toolkit-layout">
        <div className="kb-toolkit-intro"><p className="kb-label">Toolkit</p><h2>A considered<br /><i>toolkit.</i></h2></div>
        {present && (
          <Suspense fallback={<div className="tech-wall tech-wall--loading" aria-hidden="true" />}>
            <SkillObservatory active={active} />
          </Suspense>
        )}
      </div>
    </PortfolioSlide>
  );
}
