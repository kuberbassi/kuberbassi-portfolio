import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { featuredProjects } from '../../data/projects';
import { useSoundEngine } from '../../hooks/useSoundEngine';

function IconGithub({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.73.083-.73 1.205.084 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.305 3.492.997.108-.776.418-1.305.762-1.605-2.665-.3-5.467-1.335-5.467-5.93 0-1.31.465-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.232 1.91 1.232 3.22 0 4.61-2.807 5.625-5.48 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.697.825.578C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

gsap.registerPlugin(ScrollTrigger);

export function HorizontalScroll() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const { playHover, playClick } = useSoundEngine();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const totalWidth = track.scrollWidth - window.innerWidth + 120;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#050505] py-24 select-none">
      {/* Section Title Header */}
      <div className="container mb-12 flex items-end justify-between">
        <div>
          <span className="type-label">PINNED FEATURED SHOWCASE</span>
          <h2 className="type-h2 text-[var(--color-text-primary)]">Selected Architectures</h2>
        </div>
        <span className="type-xs font-mono text-[var(--color-accent)] hidden sm:inline-block">
          SCROLL DOWN TO EXPLORE HORIZONTALLY →
        </span>
      </div>

      {/* Pinned Horizontal Track */}
      <div ref={trackRef} className="flex gap-8 px-6 sm:px-16 w-max items-center">
        {featuredProjects.map((project, index) => (
          <div
            key={project.slug}
            onMouseEnter={() => playHover(700 + index * 50)}
            className="w-[85vw] sm:w-[580px] lg:w-[680px] surface p-8 sm:p-12 rounded-2xl border border-[var(--color-border-strong)] flex flex-col justify-between gap-8 flex-shrink-0 shadow-glow transition-all duration-300 hover:border-[var(--color-accent)]"
            data-cursor="VIEW"
          >
            {/* Top row */}
            <div className="flex items-center justify-between gap-4">
              <span className="font-display font-extrabold text-5xl text-[var(--color-border-strong)]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant={project.stat === 'LIVE' ? 'success' : 'default'}>
                  {project.stat}
                </Badge>
                <span className="type-mono">{project.year}</span>
              </div>
            </div>

            {/* Title & description */}
            <div className="flex flex-col gap-3">
              <h3 className="type-h2 text-[var(--color-text-primary)]">{project.title}</h3>
              <p className="type-lead clamp-3 text-[var(--color-text-secondary)]">
                {project.desc}
              </p>
            </div>

            {/* Tech chips */}
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <Badge key={t} variant="ghost" className="type-mono">
                  {t}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 pt-4 border-t border-[var(--color-border)]">
              <Link
                to={`/projects/${project.slug}`}
                onClick={playClick}
                className="inline-flex items-center gap-2 type-sm font-bold text-[var(--color-accent)] hover:gap-3 transition-all"
              >
                Case Study <ArrowUpRight size={14} />
              </Link>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 type-xs text-[var(--color-text-muted)] hover:text-white transition-colors"
                >
                  <IconGithub size={14} /> Source Code
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
