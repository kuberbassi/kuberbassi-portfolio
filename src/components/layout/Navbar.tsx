import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SpecularButton from '../SpecularButton';

const links = [
  { href: '#about', label: 'About', index: 1 },
  { href: '#toolkit', label: 'Toolkit', index: 2 },
  { href: '#work', label: 'Work', index: 3 },
  { href: '#music', label: 'Music', index: 4 },
];

function navigateToSection(index: number) {
  window.dispatchEvent(new CustomEvent('kb:navigate', { detail: index }));
}

export function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onSectionChange = (event: Event) => {
      setActiveIndex((event as CustomEvent<number>).detail ?? 0);
    };
    window.addEventListener('kb:sectionchange', onSectionChange);
    const onTransitionStart = () => wrapRef.current?.classList.add('is-scrolling');
    const onTransitionEnd = () => wrapRef.current?.classList.remove('is-scrolling');
    window.addEventListener('kb:transitionstart', onTransitionStart);
    window.addEventListener('kb:transitionend', onTransitionEnd);
    return () => {
      window.removeEventListener('kb:sectionchange', onSectionChange);
      window.removeEventListener('kb:transitionstart', onTransitionStart);
      window.removeEventListener('kb:transitionend', onTransitionEnd);
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
