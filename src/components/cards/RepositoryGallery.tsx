import { useCallback, useEffect, useRef, useState } from 'react';
import { Code2, ExternalLink, Star } from 'lucide-react';
import type { Project } from '../../types';
import './RepositoryGallery.css';

interface RepositoryGalleryProps {
  projects: Project[];
  loading?: boolean;
}

const githubPreview = (project: Project) =>
  `https://opengraph.githubassets.com/1/kuberbassi/${project.slug}`;

const livePreview = (project: Project) =>
  project.link
    ? `https://image.thum.io/get/width/1200/crop/720/noanimate/${project.link}`
    : project.img || githubPreview(project);

function ProjectPreview({ project, eager }: { project: Project; eager: boolean }) {
  const fallback = project.img || githubPreview(project);
  const primary = livePreview(project);
  const [src, setSrc] = useState(primary);
  const loadedRef = useRef(false);

  useEffect(() => {
    loadedRef.current = false;
    setSrc(primary);
    if (!project.link) return;
    const timeout = window.setTimeout(() => {
      if (!loadedRef.current) setSrc(fallback);
    }, 5000);
    return () => window.clearTimeout(timeout);
  }, [fallback, primary, project.link]);

  return (
    <img
      src={src}
      alt={`${project.title} project preview`}
      loading={eager ? 'eager' : 'lazy'}
      onLoad={() => {
        loadedRef.current = true;
      }}
      onError={() => {
        if (src !== fallback) setSrc(fallback);
      }}
    />
  );
}

export function RepositoryGallery({ projects, loading = false }: RepositoryGalleryProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const updateCardPositions = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    viewport.querySelectorAll<HTMLElement>('.repo-gallery-card').forEach((card) => {
      const rect = card.getBoundingClientRect();
      const distance = (rect.left + rect.width / 2 - viewportCenter) / viewport.clientWidth;
      const normalized = Math.max(-1, Math.min(1, distance));
      card.style.setProperty('--orbit-y', `${Math.abs(normalized) * 30}px`);
      card.style.setProperty('--orbit-rotate', `${normalized * 3.5}deg`);
      card.style.setProperty('--orbit-scale', `${1 - Math.abs(normalized) * 0.045}`);
    });
  }, []);

  useEffect(() => {
    updateCardPositions();
    const viewport = viewportRef.current;
    if (!viewport) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        updateCardPositions();
        raf = 0;
      });
    };

    viewport.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      viewport.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [projects, updateCardPositions]);

  const scrollByCard = (direction: number) => {
    viewportRef.current?.scrollBy({ left: direction * 370, behavior: 'smooth' });
  };

  return (
    <div className="repo-gallery-shell">
      <span className="repo-gallery-hint">Drag · Scroll · Arrow keys</span>
      <div
        className="repo-gallery-viewport"
        ref={viewportRef}
        role="region"
        aria-label="GitHub project gallery"
        tabIndex={0}
        onWheel={(event) => {
          if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.preventDefault();
            viewportRef.current?.scrollBy({ left: event.deltaY * 0.9 });
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            scrollByCard(1);
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            scrollByCard(-1);
          }
        }}
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest('a')) return;
          const viewport = viewportRef.current;
          if (!viewport) return;
          dragRef.current = {
            active: true,
            startX: event.clientX,
            scrollLeft: viewport.scrollLeft,
          };
          viewport.dataset.dragging = 'true';
          viewport.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragRef.current.active || !viewportRef.current) return;
          viewportRef.current.scrollLeft =
            dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX);
        }}
        onPointerUp={(event) => {
          dragRef.current.active = false;
          delete viewportRef.current?.dataset.dragging;
          viewportRef.current?.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          dragRef.current.active = false;
          delete viewportRef.current?.dataset.dragging;
        }}
      >
        <div className="repo-gallery-track">
          {(loading ? Array.from({ length: 4 }) : projects).map((project, index) =>
            loading ? (
              <div className="repo-gallery-card repo-gallery-card--loading" key={index} />
            ) : (
              <article
                className="repo-gallery-card"
                key={project.slug}
                onPointerMove={(event) => {
                  const card = event.currentTarget;
                  const rect = card.getBoundingClientRect();
                  card.style.setProperty('--shine-x', `${event.clientX - rect.left}px`);
                  card.style.setProperty('--shine-y', `${event.clientY - rect.top}px`);
                }}
              >
                <div className="repo-gallery-card__media">
                  <ProjectPreview project={project} eager={index < 3} />
                  <div className="repo-gallery-card__status">
                    <span>{project.stat}</span>
                    <span>{project.year}</span>
                  </div>
                </div>

                <div className="repo-gallery-card__body">
                  <div className="repo-gallery-card__heading">
                    <h3>{project.title}</h3>
                    {typeof project.stars === 'number' && project.stars > 0 && (
                      <span><Star size={11} /> {project.stars}</span>
                    )}
                  </div>
                  <p>{project.desc}</p>

                  <div className="repo-gallery-card__tech">
                    {project.tech.slice(0, 3).map((tech) => <span key={tech}>{tech}</span>)}
                  </div>

                  <div className="repo-gallery-card__actions">
                    {project.github && (
                      <a className="specular-surface" href={project.github} target="_blank" rel="noreferrer">
                        <Code2 size={14} /> Source
                      </a>
                    )}
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="is-primary specular-surface">
                        <ExternalLink size={14} /> Live
                      </a>
                    )}
                  </div>
                </div>
                <span className="repo-gallery-card__shine" aria-hidden="true" />
              </article>
            )
          )}
        </div>
      </div>
    </div>
  );
}
