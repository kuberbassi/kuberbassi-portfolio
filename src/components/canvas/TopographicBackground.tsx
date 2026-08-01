import { useEffect, useRef } from 'react';

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
    const onSectionChange = (event: Event) => {
      const index = (event as CustomEvent<number>).detail ?? 0;
      root.dataset.section = String(index);
      markInteraction();
    };

    window.addEventListener('kb:sectionchange', onSectionChange);
    return () => {
      clearTimeout(interactionTimer);
      window.removeEventListener('kb:sectionchange', onSectionChange);
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
