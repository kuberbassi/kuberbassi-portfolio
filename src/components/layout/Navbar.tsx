import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SpecularButton from '../SpecularButton';
import { emitPortfolioEvent, listenForPortfolioEvent, portfolioEvents } from '../../utils/portfolioEvents';

const links = [
  { href: '#about', label: 'About', index: 1 },
  { href: '#toolkit', label: 'Toolkit', index: 2 },
  { href: '#work', label: 'Work', index: 3 },
  { href: '#music', label: 'Music', index: 4 },
];

function navigateToSection(index: number) {
  emitPortfolioEvent(portfolioEvents.navigate, index);
}

export function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const removeSectionListener = listenForPortfolioEvent(portfolioEvents.sectionChange, setActiveIndex);
    const onTransitionStart = () => wrapRef.current?.classList.add('is-scrolling');
    const onTransitionEnd = () => wrapRef.current?.classList.remove('is-scrolling');
    const removeTransitionStart = listenForPortfolioEvent(portfolioEvents.transitionStart, onTransitionStart);
    const removeTransitionEnd = listenForPortfolioEvent(portfolioEvents.transitionEnd, onTransitionEnd);
    return () => {
      removeSectionListener();
      removeTransitionStart();
      removeTransitionEnd();
    };
  }, []);

  return (
    <header className="portfolio-nav-wrap" ref={wrapRef}>
      <nav className="portfolio-nav" aria-label="Main navigation">
        <a
          className="portfolio-brand"
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            navigateToSection(0);
          }}
        >
          <img src="/assets/icons/KuberBassi.svg?v=2" alt="Kuber Bassi" />
          <div>
            <strong>Kuber Bassi</strong>
            <small>Independent engineer</small>
          </div>
        </a>
        <div className="portfolio-nav-links">
          {links.map((link) => (
            <a
              className={activeIndex === link.index ? 'is-active' : undefined}
              aria-current={activeIndex === link.index ? 'page' : undefined}
              href={link.href}
              key={link.href}
              onClick={(event) => {
                event.preventDefault();
                navigateToSection(link.index);
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <SpecularButton
          className={`nav-hello${activeIndex === 5 ? ' is-active' : ''}`}
          href="#contact"
          size="md"
          radius={12}
          tint="#d5b27e"
          tintOpacity={0.88}
          textColor="#080807"
          lineColor="#fff1d2"
          baseColor="#7b6039"
          intensity={1.15}
          shineSize={15}
          shineFade={34}
          onClick={(event) => {
            event.preventDefault();
            navigateToSection(5);
          }}
        >
          Let's talk <ArrowUpRight size={14} />
        </SpecularButton>
      </nav>
    </header>
  );
}
