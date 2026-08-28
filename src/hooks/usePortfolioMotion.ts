import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { emitPortfolioEvent, portfolioEvents } from '../utils/portfolioEvents';

gsap.registerPlugin(ScrollTrigger);

type MotionStep = {
  selector: string;
  at: number;
  duration?: number;
  stagger?: number;
  x?: number;
  y?: number;
  scale?: number;
};

const sectionMotion: Record<string, MotionStep[]> = {
  home: [
    { selector: '.kb-art', at: 0.48, duration: 0.52, y: 12 },
    { selector: '.kb-hero-copy h1', at: 0.56, duration: 0.82, y: 22 },
    { selector: '.kb-hero-copy h1 i', at: 0.74, duration: 0.58, y: 10 },
    { selector: '.kb-hero-intro', at: 0.86, duration: 0.62, y: 12 },
    { selector: '.kb-circle, .kb-meta', at: 0.96, duration: 0.56, stagger: 0.07, y: 10 },
  ],
  about: [
    { selector: '.kb-label', at: 0.5, duration: 0.58, y: 10 },
    { selector: 'h2', at: 0.58, duration: 0.82, y: 22 },
    { selector: '.kb-about-statement', at: 0.72, duration: 0.68, y: 14 },
    { selector: '.kb-marquee-viewport', at: 0.84, duration: 0.66, x: -18 },
    { selector: '.principle-velocity', at: 0.94, duration: 0.66, x: 18 },
  ],
  toolkit: [
    { selector: '.kb-label', at: 0.5, duration: 0.58, y: 10 },
    { selector: 'h2', at: 0.58, duration: 0.82, y: 22 },
    { selector: '.tech-wall', at: 0.73, duration: 0.7, y: 14 },
    { selector: '.tech-wall__rail', at: 0.82, duration: 0.72, stagger: 0.08, x: 22 },
  ],
  work: [
    { selector: '.kb-label', at: 0.48, duration: 0.56, y: 10 },
    { selector: 'h2', at: 0.56, duration: 0.82, y: 22 },
    { selector: '.kb-work-intro', at: 0.7, duration: 0.64, y: 12 },
    { selector: '.kb-work-orgs > span, .kb-work-org-link', at: 0.78, duration: 0.58, stagger: 0.07, y: 10 },
    { selector: '.project-orbit', at: 0.86, duration: 0.7, y: 18 },
    // Only the cards visible on entry need choreography. Animating every
    // off-screen repository forces unnecessary layout/compositing work.
    { selector: '.repo-gallery-card:nth-child(-n+3)', at: 0.94, duration: 0.66, stagger: 0.075, x: 18 },
    { selector: '.repo-gallery-hint, .repo-gallery-progress', at: 1.04, duration: 0.48, stagger: 0.06, y: 8 },
  ],
  music: [
    { selector: '.kb-label', at: 0.48, duration: 0.56, y: 10 },
    { selector: 'h2', at: 0.56, duration: 0.82, y: 22 },
    { selector: '.kb-music-intro', at: 0.7, duration: 0.62, y: 12 },
    { selector: '.kb-spotify-shell', at: 0.78, duration: 0.68, y: 14 },
    { selector: '.kb-music-platform', at: 0.86, duration: 0.56, stagger: 0.05, y: 12 },
  ],
  contact: [
    { selector: '.kb-label', at: 0.48, duration: 0.56, y: 10 },
    { selector: 'h2', at: 0.56, duration: 0.82, y: 22 },
    { selector: 'h2 i', at: 0.68, duration: 0.54, y: 10 },
    { selector: '.kb-contact-intro', at: 0.76, duration: 0.58, y: 12 },
    { selector: '.kb-contact-actions > *', at: 0.84, duration: 0.54, stagger: 0.06, y: 12 },
    { selector: '.portfolio-footer', at: 0.94, duration: 0.58, y: 12 },
  ],
};

const getPlanTargets = (section: HTMLElement, plan: MotionStep[]) => {
  const seen = new Set<Element>();
  return plan.flatMap(({ selector }) =>
    gsap.utils.toArray<HTMLElement>(selector, section).filter((element) => {
      if (seen.has(element)) return false;
      seen.add(element);
      return true;
    }),
  );
};

type MotionOptions = {
  rootRef: RefObject<HTMLDivElement | null>;
  sliderRef: RefObject<HTMLDivElement | null>;
  activeIndex: number;
  deckEnabled: boolean;
};

export function usePortfolioMotion({ rootRef, sliderRef, activeIndex, deckEnabled }: MotionOptions) {
  const previousIndex = useRef(activeIndex);
  const initialPlayed = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const slider = sliderRef.current;
    if (!root || !slider) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const terrain = document.querySelector<HTMLElement>('.topographic-background');
    const terrainMiddle = document.querySelector<HTMLElement>('.topographic-background__layer--middle');
    const nav = document.querySelector<HTMLElement>('.portfolio-nav-wrap');
    let cleanupSection: HTMLElement | null = null;
    let cleanupPlan: MotionStep[] = [];
    root.classList.add('motion-ready');

    const context = gsap.context(() => {
      if (!deckEnabled) {
        gsap.set(slider, { clearProps: 'transform' });
        const sections = gsap.utils.toArray<HTMLElement>('.blago-slide');
        sections.forEach((section) => {
          const plan = sectionMotion[section.id] ?? [];
          const targets = getPlanTargets(section, plan);
          gsap.set(section, { autoAlpha: 1, clearProps: 'transform,opacity,visibility' });
          gsap.set(Array.from(section.children), { autoAlpha: 1, clearProps: 'transform,opacity,visibility,willChange' });
          if (targets.length) gsap.set(targets, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            clearProps: 'transform,opacity,visibility,willChange',
          });
        });
        return;
      }

      const nextSection = root.querySelector<HTMLElement>(`.blago-slide:nth-child(${activeIndex + 1})`);
      const oldSection = root.querySelector<HTMLElement>(`.blago-slide:nth-child(${previousIndex.current + 1})`);
      if (!nextSection) return;

      const nextPlan = sectionMotion[nextSection.id] ?? [];
      const oldPlan = oldSection ? sectionMotion[oldSection.id] ?? [] : [];
      cleanupSection = nextSection;
      cleanupPlan = nextPlan;

      if (!initialPlayed.current) {
        initialPlayed.current = true;

        if (activeIndex === 0) {
          const curtain = root.querySelector('.portfolio-load-curtain');
          const logo = nextSection.querySelector('.kb-art');
          const heading = nextSection.querySelector('h1');
          const italic = nextSection.querySelector('h1 i');
          const support = nextSection.querySelectorAll('.kb-hero-intro, .kb-circle, .kb-meta');
          const timeline = gsap.timeline({
            defaults: { overwrite: 'auto' },
          });
          timeline.set(slider, { y: '0dvh' });
          timeline.set(nextSection, { autoAlpha: 1 });
          timeline.set(Array.from(nextSection.children), { autoAlpha: 1, y: 0 });
          if (curtain) {
            timeline.fromTo(curtain, { autoAlpha: 1 }, { autoAlpha: 0, duration: reduced ? 0.22 : 0.42, ease: 'power2.out' });
          }
          if (terrain) {
            timeline.fromTo(terrain, { autoAlpha: 0 }, { autoAlpha: 1, duration: reduced ? 0.22 : 0.5, ease: 'power2.out' }, '<');
          }
          if (nav) {
            timeline.fromTo(nav, { y: reduced ? 0 : -18 }, { y: 0, duration: reduced ? 0.25 : 0.58, ease: 'power3.out', clearProps: 'transform' }, '<0.08');
          }
          if (logo) {
            timeline.fromTo(logo, { autoAlpha: 0, scaleY: reduced ? 1 : 0.12, transformOrigin: '50% 100%' }, { autoAlpha: 1, scaleY: 1, duration: reduced ? 0.25 : 0.72, ease: 'power3.out' }, '<0.08');
          }
          if (heading) {
            timeline.fromTo(heading, { autoAlpha: 0, y: reduced ? 0 : 22 }, { autoAlpha: 1, y: 0, duration: reduced ? 0.25 : 0.78, ease: 'power3.out' }, '-=0.35');
          }
          if (italic) {
            timeline.fromTo(italic, { autoAlpha: 0, y: reduced ? 0 : 10 }, { autoAlpha: 1, y: 0, duration: reduced ? 0.2 : 0.52, ease: 'power3.out' }, '-=0.28');
          }
          if (support.length) {
            timeline.fromTo(support, { autoAlpha: 0, y: reduced ? 0 : 12 }, { autoAlpha: 1, y: 0, duration: reduced ? 0.22 : 0.56, stagger: reduced ? 0 : 0.07, ease: 'power3.out' }, '-=0.2');
          }
          previousIndex.current = activeIndex;
          return;
        }
      }

      const direction = activeIndex >= previousIndex.current ? 1 : -1;
      const timeline = gsap.timeline({
        defaults: { overwrite: 'auto' },
        onStart: () => emitPortfolioEvent(portfolioEvents.transitionStart),
        onComplete: () => emitPortfolioEvent(portfolioEvents.transitionEnd),
      });

      if (oldSection && oldSection !== nextSection) {
        const exitTargets = getPlanTargets(oldSection, oldPlan).reverse();
        if (exitTargets.length) timeline.to(exitTargets, {
          autoAlpha: reduced ? 0 : 0.12,
          y: reduced ? 0 : -12 * direction,
          duration: reduced ? 0.2 : 0.42,
          stagger: reduced ? 0 : 0.025,
          ease: 'power2.in',
          willChange: 'transform,opacity',
        }, 0);
      }
      timeline
        .set(nextSection.children, { autoAlpha: 1, y: 0 }, 0)
        .to(slider, {
          y: `${-activeIndex * 100}dvh`,
          duration: reduced ? 0.25 : 1.02,
          ease: 'power2.inOut',
        }, reduced ? 0 : 0.12);

      nextPlan.forEach((step) => {
        const targets = gsap.utils.toArray<HTMLElement>(step.selector, nextSection);
        if (!targets.length) return;
        timeline.fromTo(targets, {
          autoAlpha: 0,
          x: reduced ? 0 : step.x ?? 0,
          y: reduced ? 0 : step.y ?? 18,
          scale: reduced ? 1 : step.scale ?? 1,
          willChange: 'transform,opacity',
        }, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: reduced ? 0.25 : step.duration ?? 0.68,
          stagger: reduced ? 0 : step.stagger ?? 0,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility,willChange',
        }, reduced ? Math.min(step.at, 0.22) : step.at);
      });

      const oldTargets = oldSection ? getPlanTargets(oldSection, oldPlan) : [];
      if (oldTargets.length) timeline.set(oldTargets, { clearProps: 'willChange' });

      previousIndex.current = activeIndex;
    }, root);

    return () => {
      context.kill(false);
      if (cleanupSection) {
        const activeTargets = getPlanTargets(cleanupSection, cleanupPlan);
        if (activeTargets.length) {
          gsap.set(activeTargets, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            clearProps: 'transform,opacity,visibility,willChange',
          });
        }
        gsap.set(Array.from(cleanupSection.children), {
          autoAlpha: 1,
          y: 0,
          clearProps: 'transform,opacity,visibility,willChange',
        });
      }
      if (nav) gsap.set(nav, { autoAlpha: 1, clearProps: 'transform,opacity,visibility' });
      if (terrain) gsap.set(terrain, { autoAlpha: 1, clearProps: 'opacity,visibility' });
      if (terrainMiddle) gsap.set(terrainMiddle, { x: 0, y: 0, clearProps: 'transform' });
      emitPortfolioEvent(portfolioEvents.transitionEnd);
    };
  }, [activeIndex, deckEnabled, rootRef, sliderRef]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) gsap.globalTimeline.pause();
      else gsap.globalTimeline.resume();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);
}
