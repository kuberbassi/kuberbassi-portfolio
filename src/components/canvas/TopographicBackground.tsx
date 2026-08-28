import { useEffect, useRef } from 'react';
import { listenForPortfolioEvent, portfolioEvents } from '../../utils/portfolioEvents';

const ASSET = '/assets/topographic-bg.webp';

export function TopographicBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let interactionTimer = 0;
    const markInteraction = () => {
      root.dataset.interacting = 'true';
      clearTimeout(interactionTimer);
      interactionTimer = window.setTimeout(() => { root.dataset.interacting = 'false'; }, 720);
    };
    const onSectionChange = (index: number) => {
      root.dataset.section = String(index);
      markInteraction();
    };

    const removeSectionListener = listenForPortfolioEvent(portfolioEvents.sectionChange, onSectionChange);
    return () => {
      clearTimeout(interactionTimer);
      removeSectionListener();
    };
  }, []);

  return (
    <div className="topographic-background" ref={rootRef} data-section="0" aria-hidden="true">
      <img className="topographic-background__layer topographic-background__layer--base" src={ASSET} alt="" width="1920" height="1080" decoding="async" fetchPriority="high" />
      <img className="topographic-background__layer topographic-background__layer--middle" src={ASSET} alt="" width="1920" height="1080" decoding="async" />
      <img className="topographic-background__layer topographic-background__layer--logo" src={ASSET} alt="" width="1920" height="1080" decoding="async" />
      <div className="topographic-background__shade" />
    </div>
  );
}
