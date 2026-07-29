import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDownRight, Code2, Mail } from 'lucide-react';
import { LogoThreeScene } from '../components/canvas/LogoThreeScene';
import { LightRays } from '../components/effects/LightRays';
import { RepositoryGallery } from '../components/cards/RepositoryGallery';
import { SkillObservatory } from '../components/sections/SkillObservatory';
import { SectionIndicator } from '../components/ui/SectionIndicator';
import { Footer } from '../components/layout/Footer';
import BlurText from '../components/BlurText';
import ScrollVelocity from '../components/ScrollVelocity';
import SpecularButton from '../components/SpecularButton';
import { useGitHubProjects } from '../services/githubRepos';
import '../styles/portfolio.css';

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

const SECTIONS = [
  { id: 'home',      label: 'Intro'     },
  { id: 'about',     label: 'About'     },
  { id: 'toolkit',   label: 'Toolkit'   },
  { id: 'work',      label: 'Work'      },
  { id: 'exploring', label: 'Exploring' },
  { id: 'music',     label: 'Music'     },
  { id: 'contact',   label: 'Contact'   },
];

export default function Home() {
  const { projects, loading } = useGitHubProjects();
  const [activeIndex, setActiveIndex] = useState(0);
  const [deckEnabled, setDeckEnabled] = useState(() => !window.matchMedia('(max-width: 768px), (pointer: coarse)').matches);
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const touchStartYRef = useRef(0);
  const wheelDeltaRef = useRef(0);
  const wheelResetRef = useRef(0);

  const goToSection = useCallback((index: number) => {
    if (index < 0 || index >= SECTIONS.length) return;
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    activeIndexRef.current = index;
    setActiveIndex(index);
    window.dispatchEvent(new CustomEvent('kb:sectionchange', { detail: index }));

    window.setTimeout(() => {
      isAnimatingRef.current = false;
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 80 : 900);
  }, []);

  useEffect(() => {
    const navigate = (index: number) => {
      const section = SECTIONS[index];
      if (!section) return;

      window.history.replaceState(null, '', `#${section.id}`);

      if (deckEnabled) {
        isAnimatingRef.current = false;
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
    const query = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    const updateMode = () => setDeckEnabled(!query.matches);
    query.addEventListener('change', updateMode);
    return () => query.removeEventListener('change', updateMode);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (window.matchMedia('(max-width: 768px), (pointer: coarse)').matches) return;

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
      if (window.matchMedia('(max-width: 768px)').matches) return;
      if (['ArrowDown', 'PageDown', 'Space'].includes(e.code)) {
        e.preventDefault();
        goToSection(activeIndexRef.current + 1);
      } else if (['ArrowUp', 'PageUp'].includes(e.code)) {
        e.preventDefault();
        goToSection(activeIndexRef.current - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (window.matchMedia('(max-width: 768px), (pointer: coarse)').matches) return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartYRef.current - touchEndY;

      if (Math.abs(deltaY) > 40) {
        if (deltaY > 0) {
          goToSection(activeIndexRef.current + 1);
        } else {
          goToSection(activeIndexRef.current - 1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.clearTimeout(wheelResetRef.current);
    };
  }, [goToSection]);

  return (
    <div className="blago-deck-container">
      {/* Right-rail section indicator */}
      <SectionIndicator
        sections={SECTIONS}
        activeIndex={activeIndex}
        onSelectSection={goToSection}
      />

      {/* Full-screen stacked slides wrapper */}
      <div
        className="blago-deck-slider"
        style={{
          transform: `translate3d(0, -${activeIndex * 100}dvh, 0)`,
        }}
      >
        {/* ── Slide 0: Hero ────────────────────────────────────── */}
        <section className={`blago-slide ${activeIndex === 0 ? 'is-active' : ''}`} id="home" aria-hidden={deckEnabled && activeIndex !== 0} inert={deckEnabled && activeIndex !== 0}>
          <div className="kb-hero">
            <LightRays
              className="kb-light"
              raysOrigin="top-center"
              raysColor="#d5b27e"
              raysSpeed={0.28}
              lightSpread={0.82}
              rayLength={1.3}
              fadeDistance={1.25}
              saturation={0.7}
              followMouse
              mouseInfluence={0.05}
              noiseAmount={0.01}
              distortion={0.016}
            />
            <div className="kb-art kb-art--faded">
              <LogoThreeScene />
            </div>
            <div className="kb-meta">
              <span>New Delhi, India</span>
              <span>Independent engineer &amp; product thinker</span>
              <span>IST (UTC+5:30)</span>
            </div>
            <div className="kb-hero-copy">
              <h1>
                Building thoughtful systems that make technology feel <i>effortless.</i>
              </h1>
              <BlurText
                key={activeIndex === 0 ? 'hero-copy-active' : 'hero-copy-idle'}
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
                onClick={() => goToSection(1)}
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
                key={activeIndex === 1 ? 'about-active' : 'about-idle'}
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
              <ScrollVelocity
                items={principles}
                active={activeIndex === 1}
                idleVelocity={24}
                maxVelocity={180}
                copies={4}
              />
            </div>
          </div>
        </section>

        {/* ── Slide 2: Toolkit ─────────────────────────────────── */}
        <section className={`blago-slide ${activeIndex === 2 ? 'is-active' : ''}`} id="toolkit" aria-hidden={deckEnabled && activeIndex !== 2} inert={deckEnabled && activeIndex !== 2}>
          <div className="kb-section kb-arsenal">
            <p className="kb-label">Toolkit</p>
            <h2>
              A considered<br />
              toolkit.
            </h2>
            <SkillObservatory />
          </div>
        </section>

        {/* ── Slide 3: Selected Work ───────────────────────────── */}
        <section className={`blago-slide ${activeIndex === 3 ? 'is-active' : ''}`} id="work" aria-hidden={deckEnabled && activeIndex !== 3} inert={deckEnabled && activeIndex !== 3}>
          <div className="kb-section">
            <div className="kb-section-head">
              <p className="kb-label">Selected Work</p>
              <h2>
                Things I've<br />
                <i>put into motion.</i>
              </h2>
              <BlurText
                key={activeIndex === 3 ? 'work-copy-active' : 'work-copy-idle'}
                text="Drag through a spatial index of products, experiments, and open-source work."
                animateBy="words"
                direction="bottom"
                delay={72}
                stepDuration={0.32}
                threshold={0.2}
                animationFrom={{ filter: 'blur(6px)', opacity: 0, y: 8 }}
                animationTo={[
                  { filter: 'blur(2px)', opacity: 0.55, y: 2 },
                  { filter: 'blur(0px)', opacity: 1, y: 0 },
                ]}
                className="kb-reveal-copy kb-work-intro"
              />
            </div>
            <div className="project-orbit">
              <RepositoryGallery projects={projects} loading={loading} />
            </div>
          </div>
        </section>

        {/* ── Slide 4: Exploring ───────────────────────────────── */}
        <section className={`blago-slide ${activeIndex === 4 ? 'is-active' : ''}`} id="exploring" aria-hidden={deckEnabled && activeIndex !== 4} inert={deckEnabled && activeIndex !== 4}>
          <div className="kb-section kb-now">
            <p className="kb-label">Exploring</p>
            <h2>
              Always<br />
              in <i>progress.</i>
            </h2>
            <div>
              {[
                'Advanced JavaScript',
                'TypeScript',
                'System Design',
                'Testing',
                'AI Workflows',
                'Performance Optimization',
                'Developer Experience',
              ].map((item) => (
                <span key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Slide 5: Music ───────────────────────────────────── */}
        <section className={`blago-slide ${activeIndex === 5 ? 'is-active' : ''}`} id="music" aria-hidden={deckEnabled && activeIndex !== 5} inert={deckEnabled && activeIndex !== 5}>
          <div className="kb-music">
            <div>
              <p className="kb-label">Music</p>
              <h2>
                Making space<br />
                for <i>sound.</i>
              </h2>
            </div>
            <BlurText
              key={activeIndex === 5 ? 'music-copy-active' : 'music-copy-idle'}
              text="Guitar, music production, cinematic sound, original releases, and streaming. A second practice in mood, detail, and composition."
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
          </div>
        </section>

        {/* ── Slide 6: Contact & Footer ───────────────────────── */}
        <section className={`blago-slide ${activeIndex === 6 ? 'is-active' : ''}`} id="contact" aria-hidden={deckEnabled && activeIndex !== 6} inert={deckEnabled && activeIndex !== 6}>
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
                  key={activeIndex === 6 ? 'contact-copy-active' : 'contact-copy-idle'}
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
                    rel="noreferrer"
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
