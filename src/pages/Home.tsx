import { useEffect, useState } from 'react';
import { AboutSection } from '../components/sections/portfolio/AboutSection';
import { ContactSection } from '../components/sections/portfolio/ContactSection';
import { HeroSection } from '../components/sections/portfolio/HeroSection';
import { MusicSection } from '../components/sections/portfolio/MusicSection';
import { ToolkitSection } from '../components/sections/portfolio/ToolkitSection';
import { WorkSection } from '../components/sections/portfolio/WorkSection';
import { SectionIndicator } from '../components/ui/SectionIndicator';
import { useSectionDeck } from '../hooks/useSectionDeck';
import { useGitHubProjects } from '../services/githubRepos';
import '../styles/portfolio.css';
import '../styles/responsive.css';

const sections = [
  { id: 'home', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'toolkit', label: 'Toolkit' },
  { id: 'work', label: 'Work' },
  { id: 'music', label: 'Music' },
  { id: 'contact', label: 'Contact' },
] as const;

export default function Home() {
  const {
    activeIndex,
    leavingIndex,
    deckEnabled,
    goToSection,
    deckRootRef,
    deckSliderRef,
  } = useSectionDeck(sections);
  const [workMounted, setWorkMounted] = useState(false);
  const { projects, loading, error } = useGitHubProjects(workMounted);

  useEffect(() => {
    if (activeIndex === 3) {
      const idleWindow = window as Window & {
        requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
        cancelIdleCallback?: (handle: number) => void;
      };
      let timer = 0;
      let idleHandle: number | null = null;
      const mountWork = () => {
        timer = window.setTimeout(() => {
          if (idleWindow.requestIdleCallback) {
            idleHandle = idleWindow.requestIdleCallback(() => setWorkMounted(true), { timeout: 900 });
          } else {
            setWorkMounted(true);
          }
        }, 360);
      };
      mountWork();
      return () => {
        clearTimeout(timer);
        if (idleHandle !== null) idleWindow.cancelIdleCallback?.(idleHandle);
      };
    }
    // Keep repository data, image decoding, and the gallery out of the initial section transitions.
  }, [activeIndex]);

  return (
    <div className="blago-deck-container" ref={deckRootRef}>
      <div className="portfolio-load-curtain" aria-hidden="true" />
      <SectionIndicator sections={sections} activeIndex={activeIndex} onSelectSection={goToSection} />
      <div className="blago-deck-slider" ref={deckSliderRef}>
        <HeroSection activeIndex={activeIndex} leavingIndex={leavingIndex} deckEnabled={deckEnabled} />
        <AboutSection activeIndex={activeIndex} leavingIndex={leavingIndex} deckEnabled={deckEnabled} />
        <ToolkitSection activeIndex={activeIndex} leavingIndex={leavingIndex} deckEnabled={deckEnabled} />
        <WorkSection
          activeIndex={activeIndex}
          deckEnabled={deckEnabled}
          mounted={workMounted}
          projects={projects}
          loading={loading}
          error={error}
        />
        <MusicSection activeIndex={activeIndex} leavingIndex={leavingIndex} deckEnabled={deckEnabled} />
        <ContactSection activeIndex={activeIndex} deckEnabled={deckEnabled} />
      </div>
    </div>
  );
}
