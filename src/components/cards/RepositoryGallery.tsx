import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Code2, ExternalLink, MoveHorizontal, Star } from 'lucide-react';
import type { Project } from '../../types';
import SpecularButton from '../SpecularButton';
import './RepositoryGallery.css';

interface RepositoryGalleryProps {
  projects: Project[];
  loading?: boolean;
}

const resolvedPreviewSources = new Map<string, string>();

const githubPreview = (project: Project) => {
  const repository = project.github?.match(/github\.com\/([^/]+\/[^/#?]+)/i)?.[1]
    ?? `kuberbassi/${project.slug}`;
  return `https://opengraph.githubassets.com/1/${repository}`;
};

const livePreview = (project: Project) => {
  if (!project.link) return githubPreview(project);
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(project.link)}?w=1200&h=750`;
};

function ProjectPreview({ project, eager }: { project: Project; eager: boolean }) {
  const fallback = githubPreview(project);
  const primary = livePreview(project);
  const remembered = resolvedPreviewSources.get(project.slug) ?? '';
  const rootRef = useRef<HTMLDivElement>(null);
  const [activated, setActivated] = useState(eager || Boolean(remembered));
  const [src, setSrc] = useState(remembered || (eager ? primary : ''));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!activated) return;
    setSrc((current) => current || primary);
  }, [activated, primary]);

  useEffect(() => {
    if (activated) return;
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window)) {
      setActivated(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setActivated(true);
      observer.disconnect();
    }, { rootMargin: '320px' });
    observer.observe(root);
    return () => observer.disconnect();
  }, [activated]);

  return (
    <div className={`repo-gallery-card__preview${loaded ? ' is-loaded' : ''}`} ref={rootRef}>
      <span className="repo-gallery-card__preview-placeholder" aria-hidden="true" />
      {src ? (
        <img
          src={src}
          alt={`${project.title} project preview`}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => {
            resolvedPreviewSources.set(project.slug, src);
            setLoaded(true);
          }}
          onError={() => {
            setLoaded(false);
            if (src === fallback) return;
            setSrc(fallback);
          }}
        />
      ) : null}
    </div>
  );
}

export function RepositoryGallery({ projects, loading = false }: RepositoryGalleryProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, latestX: 0, scrollLeft: 0, frame: 0 });
  const glideRef = useRef({ frame: 0, target: 0, previousTime: 0 });
  const progressFrameRef = useRef(0);
  const exploredRef = useRef(false);
  const [hasExplored, setHasExplored] = useState(false);

  useEffect(() => () => {
    if (glideRef.current.frame) cancelAnimationFrame(glideRef.current.frame);
    if (progressFrameRef.current) cancelAnimationFrame(progressFrameRef.current);
    if (dragRef.current.frame) cancelAnimationFrame(dragRef.current.frame);
  }, []);

  const stopGlide = () => {
    if (glideRef.current.frame) cancelAnimationFrame(glideRef.current.frame);
    glideRef.current.frame = 0;
    glideRef.current.previousTime = 0;
  };

  const glideTo = useCallback((requestedTarget: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      viewport.scrollLeft = requestedTarget;
      return;
    }
    const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    glideRef.current.target = Math.max(0, Math.min(max, requestedTarget));
    viewport.dataset.gliding = 'true';
    if (glideRef.current.frame) return;

    glideRef.current.previousTime = performance.now();

    const tick = (time: number) => {
      const currentViewport = viewportRef.current;
      if (!currentViewport) {
        glideRef.current.frame = 0;
        return;
      }
      const deltaTime = Math.min((time - glideRef.current.previousTime) / 1000, 0.04);
      glideRef.current.previousTime = time;
      const distance = glideRef.current.target - currentViewport.scrollLeft;
      if (Math.abs(distance) < 0.6) {
        currentViewport.scrollLeft = glideRef.current.target;
        delete currentViewport.dataset.gliding;
        glideRef.current.frame = 0;
        glideRef.current.previousTime = 0;
        return;
      }
      const smoothing = 1 - Math.exp(-12 * deltaTime);
      currentViewport.scrollLeft += distance * smoothing;
      glideRef.current.frame = requestAnimationFrame(tick);
    };
    glideRef.current.frame = requestAnimationFrame(tick);
  }, []);

  const scrollByCard = useCallback((direction: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    glideTo(viewport.scrollLeft + direction * 370);
  }, [glideTo]);

  useEffect(() => {
    const onWindowKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (!document.querySelector('#work.is-active')) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;
      event.preventDefault();
      scrollByCard(event.key === 'ArrowRight' ? 1 : -1);
    };
    window.addEventListener('keydown', onWindowKeyDown);
    return () => window.removeEventListener('keydown', onWindowKeyDown);
  }, [scrollByCard]);

  return (
    <div className="repo-gallery-shell" ref={shellRef}>
      <span className="repo-gallery-hint">
        <MoveHorizontal size={14} aria-hidden="true" />
        <strong>Drag or scroll to explore</strong>
        <span>Arrow keys also work</span>
      </span>
      <div
        className="repo-gallery-viewport"
        ref={viewportRef}
        role="region"
        aria-label="GitHub project gallery"
        tabIndex={0}
        onScroll={() => {
          if (progressFrameRef.current) return;
          progressFrameRef.current = requestAnimationFrame(() => {
            progressFrameRef.current = 0;
            const viewport = viewportRef.current;
            if (!viewport) return;
            const max = Math.max(1, viewport.scrollWidth - viewport.clientWidth);
            shellRef.current?.style.setProperty('--gallery-progress', String(viewport.scrollLeft / max));
            if (!exploredRef.current && viewport.scrollLeft > 8) {
              exploredRef.current = true;
              setHasExplored(true);
            }
          });
        }}
        onWheel={(event) => {
          const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
            ? event.deltaX
            : event.deltaY;
          if (!delta) return;
          event.preventDefault();
          const viewport = viewportRef.current;
          if (!viewport) return;
          const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE
            ? 16
            : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
              ? viewport.clientWidth
              : 1;
          const base = glideRef.current.frame ? glideRef.current.target : viewport.scrollLeft;
          glideTo(base + delta * unit * 0.72);
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
          stopGlide();
          delete viewport.dataset.gliding;
          dragRef.current = {
            active: true,
            startX: event.clientX,
            latestX: event.clientX,
            scrollLeft: viewport.scrollLeft,
            frame: 0,
          };
          viewport.dataset.dragging = 'true';
          viewport.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragRef.current.active || !viewportRef.current) return;
          dragRef.current.latestX = event.clientX;
          if (dragRef.current.frame) return;
          dragRef.current.frame = requestAnimationFrame(() => {
            dragRef.current.frame = 0;
            const viewport = viewportRef.current;
            if (!viewport || !dragRef.current.active) return;
            viewport.scrollLeft = dragRef.current.scrollLeft
              - (dragRef.current.latestX - dragRef.current.startX);
          });
        }}
        onPointerUp={(event) => {
          if (dragRef.current.frame) {
            cancelAnimationFrame(dragRef.current.frame);
            dragRef.current.frame = 0;
          }
          if (viewportRef.current) {
            viewportRef.current.scrollLeft = dragRef.current.scrollLeft
              - (event.clientX - dragRef.current.startX);
          }
          dragRef.current.active = false;
          if (viewportRef.current) glideRef.current.target = viewportRef.current.scrollLeft;
          delete viewportRef.current?.dataset.dragging;
          if (viewportRef.current?.hasPointerCapture(event.pointerId)) {
            viewportRef.current.releasePointerCapture(event.pointerId);
          }
        }}
        onPointerCancel={() => {
          if (dragRef.current.frame) cancelAnimationFrame(dragRef.current.frame);
          dragRef.current.frame = 0;
          dragRef.current.active = false;
          if (viewportRef.current) glideRef.current.target = viewportRef.current.scrollLeft;
          delete viewportRef.current?.dataset.dragging;
        }}
      >
        <div className="repo-gallery-track">
          {(loading ? Array.from({ length: 4 }) : projects).map((project, index) =>
            loading ? (
              <div className="repo-gallery-card repo-gallery-card--loading" key={index} />
            ) : (
              <article className="repo-gallery-card" key={project.slug}>
                <div className="repo-gallery-card__media">
                  <ProjectPreview project={project} eager={index < 2} />
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
                      <SpecularButton
                        className="repo-gallery-action"
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        size="sm"
                        radius={8}
                        tint="#090908"
                        tintOpacity={0.62}
                        lineColor="#d5b27e"
                        baseColor="#403629"
                        intensity={0.86}
                        shineSize={14}
                        shineFade={34}
                      >
                        <Code2 size={14} /> Source
                      </SpecularButton>
                    )}
                    {project.link && (
                      <SpecularButton
                        className="repo-gallery-action is-primary"
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        size="sm"
                        radius={8}
                        tint="#d5b27e"
                        tintOpacity={0.94}
                        textColor="#080807"
                        lineColor="#fff0d0"
                        baseColor="#755a35"
                        intensity={1.05}
                        shineSize={14}
                        shineFade={34}
                      >
                        <ExternalLink size={14} /> Live
                      </SpecularButton>
                    )}
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      </div>
      <span
        className={`repo-gallery-cue${hasExplored ? ' is-hidden' : ''}`}
        aria-hidden="true"
      >
        <ArrowRight className="repo-gallery-cue__arrow" strokeWidth={1.3} />
      </span>
      <div className="repo-gallery-progress" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
