import { useCallback, useEffect, useRef, useState } from 'react';
import { usePortfolioMotion } from './usePortfolioMotion';
import { emitPortfolioEvent, listenForPortfolioEvent, portfolioEvents } from '../utils/portfolioEvents';

export interface DeckSection {
  id: string;
  label: string;
}

const DECK_MEDIA_QUERY = '(max-width: 1023px), (pointer: coarse)';
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useSectionDeck(sections: readonly DeckSection[]) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const [deckEnabled, setDeckEnabled] = useState(() => !window.matchMedia(DECK_MEDIA_QUERY).matches);
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const wheelDeltaRef = useRef(0);
  const wheelResetRef = useRef(0);
  const leavingTimerRef = useRef(0);
  const animationTimerRef = useRef(0);
  const deckRootRef = useRef<HTMLDivElement>(null);
  const deckSliderRef = useRef<HTMLDivElement>(null);

  usePortfolioMotion({ rootRef: deckRootRef, sliderRef: deckSliderRef, activeIndex, deckEnabled });

  const goToSection = useCallback((index: number) => {
    if (index < 0 || index >= sections.length) return;
    if (index === activeIndexRef.current || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    setLeavingIndex(activeIndexRef.current);
    window.clearTimeout(leavingTimerRef.current);
    window.clearTimeout(animationTimerRef.current);
    leavingTimerRef.current = window.setTimeout(() => setLeavingIndex(null), 1400);
    activeIndexRef.current = index;
    setActiveIndex(index);
    emitPortfolioEvent(portfolioEvents.sectionChange, index);

    animationTimerRef.current = window.setTimeout(() => {
      isAnimatingRef.current = false;
    }, reducedMotion() ? 360 : 1750);
  }, [sections.length]);

  useEffect(() => () => {
    window.clearTimeout(leavingTimerRef.current);
    window.clearTimeout(animationTimerRef.current);
  }, []);

  useEffect(() => {
    const navigate = (index: number) => {
      const section = sections[index];
      if (!section) return;
      window.history.replaceState(null, '', `#${section.id}`);

      if (deckEnabled) {
        goToSection(index);
        return;
      }

      activeIndexRef.current = index;
      setActiveIndex(index);
      document.getElementById(section.id)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
    };

    const removeNavigationListener = listenForPortfolioEvent(portfolioEvents.navigate, navigate);

    const initialIndex = sections.findIndex(({ id }) => `#${id}` === window.location.hash);
    if (initialIndex > 0) window.setTimeout(() => navigate(initialIndex), 0);

    return removeNavigationListener;
  }, [deckEnabled, goToSection, sections]);

  useEffect(() => {
    emitPortfolioEvent(portfolioEvents.sectionChange, 0);
  }, []);

  useEffect(() => {
    const query = window.matchMedia(DECK_MEDIA_QUERY);
    const updateMode = () => setDeckEnabled(!query.matches);
    query.addEventListener('change', updateMode);
    return () => query.removeEventListener('change', updateMode);
  }, []);

  useEffect(() => {
    if (deckEnabled || !('IntersectionObserver' in window)) return;

    const observedSections = sections
      .map(({ id }, index) => ({ element: document.getElementById(id), index }))
      .filter((entry): entry is { element: HTMLElement; index: number } => Boolean(entry.element));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const section = visible
        ? observedSections.find(({ element }) => element === visible.target)
        : undefined;
      if (!section) return;
      activeIndexRef.current = section.index;
      setActiveIndex(section.index);
      emitPortfolioEvent(portfolioEvents.sectionChange, section.index);
    }, { rootMargin: '-28% 0px -52% 0px', threshold: [0, 0.15, 0.35] });

    observedSections.forEach(({ element }) => observer.observe(element));
    return () => observer.disconnect();
  }, [deckEnabled, sections]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (window.matchMedia(DECK_MEDIA_QUERY).matches || event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('.project-orbit')) return;

      const projectBox = target?.closest<HTMLElement>('.kb-projects');
      if (projectBox) {
        const { scrollTop, scrollHeight, clientHeight } = projectBox;
        const atBoundary = (scrollTop === 0 && event.deltaY < 0)
          || (Math.abs(scrollHeight - clientHeight - scrollTop) < 3 && event.deltaY > 0);
        if (!atBoundary) return;
      }

      event.preventDefault();
      if (isAnimatingRef.current) return;
      if (Math.sign(event.deltaY) !== Math.sign(wheelDeltaRef.current)) wheelDeltaRef.current = 0;
      wheelDeltaRef.current += event.deltaY;

      window.clearTimeout(wheelResetRef.current);
      wheelResetRef.current = window.setTimeout(() => { wheelDeltaRef.current = 0; }, 140);
      if (Math.abs(wheelDeltaRef.current) < 55) return;

      const direction = wheelDeltaRef.current > 0 ? 1 : -1;
      wheelDeltaRef.current = 0;
      goToSection(activeIndexRef.current + direction);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (window.matchMedia('(max-width: 1023px)').matches || event.defaultPrevented) return;
      if (['ArrowDown', 'PageDown', 'Space'].includes(event.code)) {
        event.preventDefault();
        goToSection(activeIndexRef.current + 1);
      } else if (['ArrowUp', 'PageUp'].includes(event.code)) {
        event.preventDefault();
        goToSection(activeIndexRef.current - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(wheelResetRef.current);
    };
  }, [goToSection]);

  return { activeIndex, leavingIndex, deckEnabled, goToSection, deckRootRef, deckSliderRef };
}
