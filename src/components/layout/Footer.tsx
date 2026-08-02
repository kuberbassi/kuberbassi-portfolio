import type { CSSProperties } from 'react';
import type { IconType } from 'react-icons';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { ArrowUpRight } from 'lucide-react';
import SpecularButton from '../SpecularButton';

const links: { label: string; href: string; icon: IconType; color: string }[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/kuberbassi',
    icon: FaGithub,
    color: '#eeeae2',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/kuberbassi/',
    icon: FaLinkedin,
    color: '#0A66C2',
  },
  {
    label: 'Email',
    href: 'mailto:me@kuberbassi.com',
    icon: SiGmail,
    color: '#EA4335',
  },
];

export function Footer() {
  return (
    <footer className="portfolio-footer">
      <div className="portfolio-footer-inner">
        <nav className="footer-social-links" aria-label="Social links">
          {links.map(({ label, href, icon: Icon, color }) => (
            <SpecularButton
              href={href}
              key={label}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="footer-social-link"
              size="sm"
              radius={10}
              tint="#090908"
              tintOpacity={0.5}
              lineColor="#d5b27e"
              baseColor="#403629"
              intensity={0.82}
              shineSize={16}
              shineFade={44}
            >
              <span
                className="footer-brand-icon"
                style={{ '--brand': color } as CSSProperties}
              >
                <Icon role="img" aria-label={`${label} logo`} />
              </span>
              <span>{label}</span>
              <ArrowUpRight size={12} strokeWidth={1.7} />
            </SpecularButton>
          ))}
        </nav>

        <p className="footer-copyright">
          © {new Date().getFullYear()} Kuber Bassi
          <span>Designed &amp; engineered in India.</span>
        </p>
      </div>
    </footer>
  );
}
