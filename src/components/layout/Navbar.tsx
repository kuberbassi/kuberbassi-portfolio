import { ArrowUpRight } from 'lucide-react';
import SpecularButton from '../SpecularButton';

const links = [
  { href: '#about', label: 'About', index: 1 },
  { href: '#toolkit', label: 'Toolkit', index: 2 },
  { href: '#work', label: 'Work', index: 3 },
  { href: '#exploring', label: 'Exploring', index: 4 },
  { href: '#music', label: 'Music', index: 5 },
];

function navigateToSection(index: number) {
  window.dispatchEvent(new CustomEvent('kb:navigate', { detail: index }));
}

export function Navbar() {
  return (
    <header className="portfolio-nav-wrap">
      <nav className="portfolio-nav" aria-label="Main navigation">
        <a
          className="portfolio-brand"
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            navigateToSection(0);
          }}
        >
          <img src="/assets/icons/KuberBassi.svg" alt="" />
          <div>
            <strong>Kuber Bassi</strong>
            <small>Independent engineer</small>
          </div>
        </a>
        <div className="portfolio-nav-links">
          {links.map((link) => (
            <a
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
          className="nav-hello"
          href="#contact"
          size="md"
          radius={22}
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
            navigateToSection(6);
          }}
        >
          Let's talk <ArrowUpRight size={14} />
        </SpecularButton>
      </nav>
    </header>
  );
}
