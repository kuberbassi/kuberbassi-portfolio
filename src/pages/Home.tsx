import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Code2, House, Mail } from 'lucide-react';
import {
  SiApplemusic,
  SiGithub,
  SiSpotify,
  SiYoutube,
  SiYoutubemusic,
} from 'react-icons/si';
import { TbBrandAmazon } from 'react-icons/tb';
import type { IconType } from 'react-icons';
import { SectionIndicator } from '../components/ui/SectionIndicator';
import { TimeOfDayIcon } from '../components/ui/TimeOfDayIcon';
import { Footer } from '../components/layout/Footer';
import BlurText from '../components/BlurText';
import ScrollVelocity from '../components/ScrollVelocity';
import SpecularButton from '../components/SpecularButton';
import { LightRays } from '../components/effects/LightRays';
import { useGitHubProjects } from '../services/githubRepos';
import { musicChannels } from '../data/music';
import '../styles/portfolio.css';
import '../styles/responsive.css';
import { usePortfolioMotion } from '../hooks/usePortfolioMotion';

const LogoThreeScene = lazy(() =>
  import('../components/canvas/LogoThreeScene').then(({ LogoThreeScene: Component }) => ({
    default: Component,
  })),
);

const RepositoryGallery = lazy(() =>
  import('../components/cards/RepositoryGallery').then(({ RepositoryGallery: Component }) => ({
    default: Component,
  })),
);

const SkillObservatory = lazy(() =>
  import('../components/sections/SkillObservatory').then(({ SkillObservatory: Component }) => ({
    default: Component,
  })),
);

const focus = [
  'Software Engineering',
  'Full-Stack Development',
  'AI Engineering',
  'Automation',
  'Product Design',
  'Interface Design',
  'Browser Applications',
];

const principles = [
  'Simplicity',
  'Precision',
  'Performance',
  'Structure',
  'Intent',
  'Consistency',
  'Curiosity',
];

const githubOrganizations = [
  { name: 'KuberBassi Labs', handle: 'kuberbassi-labs', href: 'https://github.com/kuberbassi-labs' },
  { name: 'VanguardLogic', handle: 'VanguardLogic', href: 'https://github.com/VanguardLogic' },
] as const;

const musicPlatformIcons: Record<string, IconType> = {
  Spotify: SiSpotify,
  'Apple Music': SiApplemusic,
  'Amazon Music': TbBrandAmazon,
  YouTube: SiYoutube,
  'YouTube Music': SiYoutubemusic,
};

const SECTIONS = [
  { id: 'home',      label: 'Intro'     },
  { id: 'about',     label: 'About'     },
  { id: 'toolkit',   label: 'Toolkit'   },
  { id: 'work',      label: 'Work'      },
  { id: 'music',     label: 'Music'     },
  { id: 'contact',   label: 'Contact'   },
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const [deckEnabled, setDeckEnabled] = useState(() => !window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches);
  const workIsActive = activeIndex === 3;
  const heroIsActive = activeIndex === 0;
  const aboutIsActive = activeIndex === 1;
  const toolkitIsActive = activeIndex === 2;
  const musicIsActive = activeIndex === 4;
  const heroPresent = heroIsActive || leavingIndex === 0;
  const aboutPresent = aboutIsActive || leavingIndex === 1;
  const toolkitPresent = toolkitIsActive || leavingIndex === 2;
  const musicPresent = musicIsActive || leavingIndex === 4;
  const [workMounted, setWorkMounted] = useState(false);
  const { projects, loading, error: projectsError } = useGitHubProjects(workMounted);
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const wheelDeltaRef = useRef(0);
  const wheelResetRef = useRef(0);
  const leavingTimerRef = useRef(0);
  const deckRootRef = useRef<HTMLDivElement>(null);
  const deckSliderRef = useRef<HTMLDivElement>(null);

  usePortfolioMotion({ rootRef: deckRootRef, sliderRef: deckSliderRef, activeIndex, deckEnabled });

  useEffect(() => {
    if (workIsActive) setWorkMounted(true);
  }, [workIsActive]);

  const goToSection = useCallback((index: number) => {
    if (index < 0 || index >= SECTIONS.length) return;
    if (index === activeIndexRef.current) return;
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    setLeavingIndex(activeIndexRef.current);
    window.clearTimeout(leavingTimerRef.current);
    leavingTimerRef.current = window.setTimeout(() => setLeavingIndex(null), 1400);
    activeIndexRef.current = index;
    setActiveIndex(index);
    window.dispatchEvent(new CustomEvent('kb:sectionchange', { detail: index }));

    window.setTimeout(() => {
      isAnimatingRef.current = false;
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 360 : 1750);
  }, []);

  useEffect(() => () => window.clearTimeout(leavingTimerRef.current), []);

  useEffect(() => {
    const navigate = (index: number) => {
      const section = SECTIONS[index];
      if (!section) return;

      window.history.replaceState(null, '', `#${section.id}`);

      if (deckEnabled) {
        goToSection(index);
        return;
      }

      activeIndexRef.current = index;
      setActiveIndex(index);
      document.getElementById(section.id)?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
    };

    const handleNavigation = (event: Event) => {
      navigate((event as CustomEvent<number>).detail);
    };

    window.addEventListener('kb:navigate', handleNavigation);

    const initialIndex = SECTIONS.findIndex(({ id }) => `#${id}` === window.location.hash);
    if (initialIndex > 0) {
      window.setTimeout(() => navigate(initialIndex), 0);
    }

    return () => window.removeEventListener('kb:navigate', handleNavigation);
  }, [deckEnabled, goToSection]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('kb:sectionchange', { detail: 0 }));
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1023px), (pointer: coarse)');
    const updateMode = () => setDeckEnabled(!query.matches);
    query.addEventListener('change', updateMode);
    return () => query.removeEventListener('change', updateMode);
  }, []);

  useEffect(() => {
    if (deckEnabled || !('IntersectionObserver' in window)) return;

    const sections = SECTIONS
      .map(({ id }, index) => ({ element: document.getElementById(id), index }))
      .filter((entry): entry is { element: HTMLElement; index: number } => Boolean(entry.element));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const section = sections.find(({ element }) => element === visible.target);
      if (!section) return;
      activeIndexRef.current = section.index;
      setActiveIndex(section.index);
      window.dispatchEvent(new CustomEvent('kb:sectionchange', { detail: section.index }));
    }, { rootMargin: '-28% 0px -52% 0px', threshold: [0, 0.15, 0.35] });

    sections.forEach(({ element }) => observer.observe(element));
    return () => observer.disconnect();
  }, [deckEnabled]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches) return;
      if (e.defaultPrevented) return;

      const target = e.target as HTMLElement | null;
      if (target?.closest('.project-orbit')) return;

      // Check if user is scrolling inside a nested scroll container (e.g. project list)
      const projectBox = target?.closest('.kb-projects');
      if (projectBox) {
        const { scrollTop, scrollHeight, clientHeight } = projectBox;
        const isAtTop = scrollTop === 0 && e.deltaY < 0;
        const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 3 && e.deltaY > 0;
        if (!isAtTop && !isAtBottom) {
          return; // Let user scroll inside projects
        }
      }

      e.preventDefault();
      if (isAnimatingRef.current) return;

      if (Math.sign(e.deltaY) !== Math.sign(wheelDeltaRef.current)) {
        wheelDeltaRef.current = 0;
      }
      wheelDeltaRef.current += e.deltaY;

      window.clearTimeout(wheelResetRef.current);
      wheelResetRef.current = window.setTimeout(() => {
        wheelDeltaRef.current = 0;
      }, 140);

      if (Math.abs(wheelDeltaRef.current) >= 55) {
        const direction = wheelDeltaRef.current > 0 ? 1 : -1;
        wheelDeltaRef.current = 0;
        goToSection(activeIndexRef.current + direction);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.matchMedia('(max-width: 1023px)').matches) return;
      if (e.defaultPrevented) return;
      if (['ArrowDown', 'PageDown', 'Space'].includes(e.code)) {
        e.preventDefault();
        goToSection(activeIndexRef.current + 1);
      } else if (['ArrowUp', 'PageUp'].includes(e.code)) {
        e.preventDefault();
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

  return (
    <div className="blago-deck-container" ref={deckRootRef}>
      <div className="portfolio-load-curtain" aria-hidden="true" />
      {/* Right-rail section indicator */}
      <SectionIndicator
        sections={SECTIONS}
        activeIndex={activeIndex}
        onSelectSection={goToSection}
      />

      {/* Full-screen stacked slides wrapper */}
      <div
        className="blago-deck-slider"
        ref={deckSliderRef}
      >
        {/* ── Slide 0: Hero ────────────────────────────────────── */}
        <section className={`blago-slide ${activeIndex === 0 ? 'is-active' : ''}`} id="home" aria-hidden={deckEnabled && activeIndex !== 0} inert={deckEnabled && activeIndex !== 0}>
          <div className="kb-hero">
            {heroPresent && (
              <LightRays
                className="kb-light"
                raysColor="#d5b27e"
                followMouse={deckEnabled}
                mouseInfluence={0.05}
              />
            )}
            <div className="kb-art kb-art--faded">
              {heroPresent && (
                <Suspense fallback={<div className="kb-logo-placeholder" aria-hidden="true" />}>
                  <LogoThreeScene />
                </Suspense>
              )}
            </div>
            <div className="kb-meta">
              <span className="kb-location">
                <House aria-hidden="true" size={15} strokeWidth={1.7} />
                <span>New Delhi, India</span>
              </span>
              <span>Independent engineer &amp; product thinker</span>
              <TimeOfDayIcon />
            </div>
            <div className="kb-hero-copy">
              <h1>
                Building thoughtful<br />
                systems that make<br />
                technology feel<br />
                <i>effortless.</i>
              </h1>
              <BlurText
                text="Turning ideas into clean, useful, and reliable digital products."
                animateBy="letters"
                direction="bottom"
                delay={16}
                stepDuration={0.34}
                threshold={0.2}
                animationFrom={{ filter: 'blur(7px)', opacity: 0, y: 10 }}
                animationTo={[
                  { filter: 'blur(2px)', opacity: 0.58, y: 2 },
                  { filter: 'blur(0px)', opacity: 1, y: 0 },
                ]}
                easing={(value: number) => 1 - Math.pow(1 - value, 3)}
                className="kb-reveal-copy kb-hero-intro"
              />
              <SpecularButton
                className="kb-circle"
                size="sm"
                radius={999}
                tint="#080807"
                tintOpacity={0.5}
                lineColor="#d5b27e"
                baseColor="#493c2b"
                intensity={1.1}
                shineSize={18}
                shineFade={38}
                ariaLabel="Explore selected work"
                onClick={() => window.dispatchEvent(new CustomEvent('kb:navigate', { detail: 1 }))}
              >
                <ArrowDownRight />
              </SpecularButton>
            </div>
          </div>
        </section>

        {/* ── Slide 1: About ───────────────────────────────────── */}
        <section className={`blago-slide ${activeIndex === 1 ? 'is-active' : ''}`} id="about" aria-hidden={deckEnabled && activeIndex !== 1} inert={deckEnabled && activeIndex !== 1}>
          <div className="kb-intro">
            <div className="kb-about-content">
              <p className="kb-label kb-about-label">About</p>
              <h2>
                Useful things.<br />
                <i>Carefully made.</i>
              </h2>
              <BlurText
                text="I build software, products, and creative tools with simplicity, performance, and long-term thinking."
                animateBy="letters"
                direction="bottom"
                delay={18}
                stepDuration={0.38}
                threshold={0.2}
                animationFrom={{ filter: 'blur(8px)', opacity: 0, y: 12 }}
                animationTo={[
                  { filter: 'blur(3px)', opacity: 0.55, y: 3 },
                  { filter: 'blur(0px)', opacity: 1, y: 0 },
                ]}
                easing={(value: number) => 1 - Math.pow(1 - value, 3)}
                className="kb-about-statement"
              />
            </div>
            <div className="kb-focus kb-about-strip" aria-label="Focus and principles">
              <div className="kb-marquee-viewport">
                <div className="kb-marquee">
                  {[...focus, ...focus].map((item, i) => (
                    <span key={`${item}-${i}`}>
                      {item} <b>✦</b>
                    </span>
                  ))}
                </div>
              </div>
              {aboutPresent && (
                <ScrollVelocity
                  items={principles}
                  active={aboutIsActive}
                  idleVelocity={24}
                  maxVelocity={180}
                  copies={4}
                />
              )}
            </div>
          </div>
        </section>

        {/* ── Slide 2: Toolkit ─────────────────────────────────── */}
        <section className={`blago-slide ${activeIndex === 2 ? 'is-active' : ''}`} id="toolkit" aria-hidden={deckEnabled && activeIndex !== 2} inert={deckEnabled && activeIndex !== 2}>
          <div className="kb-section kb-arsenal kb-toolkit-layout">
            <div className="kb-toolkit-intro">
              <p className="kb-label">Toolkit</p>
              <h2>
                A considered<br />
                <i>toolkit.</i>
              </h2>
            </div>
            {toolkitPresent && (
              <Suspense fallback={<div className="tech-wall tech-wall--loading" aria-hidden="true" />}>
                <SkillObservatory active={toolkitIsActive} />
              </Suspense>
            )}
          </div>
        </section>

        {/* ── Slide 3: Selected Work ───────────────────────────── */}
        <section className={`blago-slide ${activeIndex === 3 ? 'is-active' : ''}`} id="work" aria-hidden={deckEnabled && activeIndex !== 3} inert={deckEnabled && activeIndex !== 3}>
          <div className="kb-section">
            <div className="kb-section-head">
              <p className="kb-label">Work</p>
              <h2>
                Things I've<br />
                <i>put into motion.</i>
              </h2>
              <div className="kb-work-context">
                <BlurText
                  text="A selection of products, experiments, and open-source work."
                  animateBy="words"
                  direction="bottom"
                  delay={62}
                  stepDuration={0.32}
                  threshold={0.2}
                  animationFrom={{ filter: 'blur(6px)', opacity: 0, y: 8 }}
                  animationTo={[
                    { filter: 'blur(2px)', opacity: 0.55, y: 2 },
                    { filter: 'blur(0px)', opacity: 1, y: 0 },
                  ]}
                  className="kb-reveal-copy kb-work-intro"
                />
                <div className="kb-work-orgs" aria-label="GitHub organizations">
                  <span><SiGithub size={12} aria-hidden="true" /> Organizations</span>
                  <div>
                    {githubOrganizations.map((organization) => (
                      <SpecularButton
                        className="kb-work-org-link"
                        href={organization.href}
                        key={organization.handle}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        radius={999}
                        tint="#090908"
                        tintOpacity={0.58}
                        lineColor="#d5b27e"
                        baseColor="#403629"
                        intensity={0.8}
                        shineSize={12}
                        shineFade={30}
                      >
                        <img src={`https://github.com/${organization.handle}.png?size=48`} alt="" loading="lazy" decoding="async" />
                        <span>{organization.name}</span>
                      </SpecularButton>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="project-orbit">
              {workMounted && (
                <Suspense fallback={<div className="repo-gallery-shell repo-gallery-shell--loading" aria-hidden="true" />}>
                  <RepositoryGallery projects={projects} loading={loading} error={projectsError} />
                </Suspense>
              )}
            </div>
          </div>
        </section>

        {/* ── Slide 4: Music ───────────────────────────────────── */}
        <section className={`blago-slide ${activeIndex === 4 ? 'is-active' : ''}`} id="music" aria-hidden={deckEnabled && activeIndex !== 4} inert={deckEnabled && activeIndex !== 4}>
          <div className="kb-music">
            <div className="kb-music-copy">
              <p className="kb-label">Music</p>
              <h2>
                Making space<br />
                for <i>sound.</i>
              </h2>
            </div>
            <div className="kb-music-listen">
              <BlurText
                text="Original music, cinematic sound, and guitar — another way I build with intention."
                animateBy="words"
                direction="bottom"
                delay={54}
                stepDuration={0.32}
                threshold={0.2}
                animationFrom={{ filter: 'blur(6px)', opacity: 0, y: 8 }}
                animationTo={[
                  { filter: 'blur(2px)', opacity: 0.55, y: 2 },
                  { filter: 'blur(0px)', opacity: 1, y: 0 },
                ]}
                className="kb-reveal-copy kb-music-intro"
              />
              {musicPresent && (
                <div className="kb-spotify-shell">
                  <span className="kb-spotify-skeleton" aria-hidden="true" />
                  <iframe
                  className="kb-spotify-embed"
                  title="Featured track on Spotify"
                  src="https://open.spotify.com/embed/track/19uF87i1d51C6AeTrMUWaA?utm_source=generator&theme=0&si=26ffa32d9b8140b7"
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  onMouseEnter={() => window.dispatchEvent(new CustomEvent('kb:cursorsuspend', { detail: true }))}
                  onMouseLeave={() => window.dispatchEvent(new CustomEvent('kb:cursorsuspend', { detail: false }))}
                  onLoad={(event) => event.currentTarget.parentElement?.classList.add('is-ready')}
                  />
                </div>
              )}
              <nav className="kb-music-platforms" aria-label="Listen on music platforms">
                {musicChannels.map((channel) => {
                  const PlatformIcon = musicPlatformIcons[channel.name];
                  return (
                    <SpecularButton
                      className="kb-music-platform"
                      href={channel.url}
                      key={channel.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      ariaLabel={`Open Kuber Bassi on ${channel.name}`}
                      size="sm"
                      radius={12}
                      tint="#090908"
                      tintOpacity={0.72}
                      lineColor="#d5b27e"
                      baseColor="#403629"
                      intensity={0.9}
                      shineSize={16}
                      shineFade={38}
                    >
                      <PlatformIcon className="kb-music-platform-icon" aria-hidden="true" />
                      <span className="kb-music-platform-copy">
                        <small>Artist profile</small>
                        <strong>{channel.name}</strong>
                      </span>
                      <ArrowUpRight className="kb-music-platform-arrow" aria-hidden="true" />
                    </SpecularButton>
                  );
                })}
              </nav>
            </div>
          </div>
        </section>

        {/* ── Slide 5: Contact & Footer ───────────────────────── */}
        <section className={`blago-slide ${activeIndex === 5 ? 'is-active' : ''}`} id="contact" aria-hidden={deckEnabled && activeIndex !== 5} inert={deckEnabled && activeIndex !== 5}>
          <div className="kb-closing-card">
            <div className="kb-closing">
              <div className="kb-contact-heading">
                <div className="kb-contact-eyebrow">
                  <p className="kb-label">Contact</p>
                </div>
                <h2>
                  Have an idea?<br />
                  <i>Let's build it well.</i>
                </h2>
                <BlurText
                  text="Let's build something worth using."
                  animateBy="letters"
                  direction="bottom"
                  delay={18}
                  stepDuration={0.38}
                  threshold={0.2}
                  animationFrom={{ filter: 'blur(8px)', opacity: 0, y: 12 }}
                  animationTo={[
                    { filter: 'blur(3px)', opacity: 0.55, y: 3 },
                    { filter: 'blur(0px)', opacity: 1, y: 0 },
                  ]}
                  className="kb-reveal-copy kb-contact-intro"
                />
                <div className="kb-contact-actions">
                  <SpecularButton
                    href="mailto:me@kuberbassi.com"
                    size="md"
                    radius={12}
                    tint="#d5b27e"
                    tintOpacity={0.9}
                    textColor="#080807"
                    lineColor="#fff0d0"
                    baseColor="#755a35"
                    intensity={1.1}
                    shineSize={16}
                    shineFade={34}
                  >
                    Email me <Mail size={17} />
                  </SpecularButton>
                  <SpecularButton
                    href="https://github.com/kuberbassi"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="md"
                    radius={12}
                    tint="#080807"
                    tintOpacity={0.58}
                    lineColor="#d5b27e"
                    baseColor="#4a3c29"
                    intensity={1}
                    shineSize={18}
                    shineFade={40}
                  >
                    GitHub <Code2 size={17} />
                  </SpecularButton>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </section>
      </div>
    </div>
  );
}
