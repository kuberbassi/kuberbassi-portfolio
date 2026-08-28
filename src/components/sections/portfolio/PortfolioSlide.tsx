import type { ReactNode } from 'react';

export function PortfolioSlide({
  id,
  index,
  activeIndex,
  deckEnabled,
  children,
}: {
  id: string;
  index: number;
  activeIndex: number;
  deckEnabled: boolean;
  children: ReactNode;
}) {
  const active = activeIndex === index;
  return (
    <section
      className={`blago-slide ${active ? 'is-active' : ''}`}
      id={id}
      aria-hidden={deckEnabled && !active}
      inert={deckEnabled && !active}
    >
      {children}
    </section>
  );
}
