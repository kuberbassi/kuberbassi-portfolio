import { lazy, Suspense, useCallback, useRef, useState } from 'react';
import { ArrowDownRight, House } from 'lucide-react';
import BlurText from '../../BlurText';
import SpecularButton from '../../SpecularButton';
import { LightRays } from '../../effects/LightRays';
import { NavTooltip } from '../../ui/NavTooltip';
import { TimeOfDayIcon } from '../../ui/TimeOfDayIcon';
import { emitPortfolioEvent, portfolioEvents } from '../../../utils/portfolioEvents';
import { PortfolioSlide } from './PortfolioSlide';

const LogoThreeScene = lazy(() =>
  import('../../canvas/LogoThreeScene').then(({ LogoThreeScene: Component }) => ({ default: Component })),
);

type OpenTooltip = 'location' | 'time' | null;

export function HeroSection({ activeIndex, leavingIndex, deckEnabled }: {
  activeIndex: number;
  leavingIndex: number | null;
  deckEnabled: boolean;
}) {
  const present = activeIndex === 0 || leavingIndex === 0;
  const [openTooltip, setOpenTooltip] = useState<OpenTooltip>(null);
  const locationRef = useRef<HTMLButtonElement>(null);
  const timeRef = useRef<HTMLButtonElement>(null);

  const handleLocationTap = useCallback(() => {
    setOpenTooltip((prev) => (prev === 'location' ? null : 'location'));
  }, []);

  const handleTimeTap = useCallback(() => {
    setOpenTooltip((prev) => (prev === 'time' ? null : 'time'));
  }, []);

  const closeTooltip = useCallback(() => setOpenTooltip(null), []);

  return (
    <PortfolioSlide id="home" index={0} activeIndex={activeIndex} deckEnabled={deckEnabled}>
      <div className="kb-hero">
        {present && <LightRays className="kb-light" raysColor="#d5b27e" followMouse={deckEnabled} mouseInfluence={0.05} />}
        <div className="kb-art kb-art--faded">
          {present && (
            <Suspense fallback={<div className="kb-logo-placeholder" aria-hidden="true" />}>
              <LogoThreeScene />
            </Suspense>
          )}
        </div>
        <div className="kb-meta">
          {/* Location — desktop shows full text; mobile tap reveals tooltip */}
          <button
            ref={locationRef}
            className="kb-location kb-meta-tap"
            aria-label="Show location"
            onClick={handleLocationTap}
          >
            <House aria-hidden="true" size={15} strokeWidth={1.7} />
            <span>New Delhi, India</span>
          </button>
          <span>Independent engineer &amp; product thinker</span>
          {/* Timezone — desktop shows full text; mobile tap reveals tooltip */}
          <button
            ref={timeRef}
            className="kb-meta-tap"
            aria-label="Show timezone"
            onClick={handleTimeTap}
          >
            <TimeOfDayIcon />
          </button>
        </div>

        {/* Tooltips — only visible on mobile/tablet */}
        <NavTooltip open={openTooltip === 'location'} onClose={closeTooltip} anchorRef={locationRef}>
          <House aria-hidden="true" size={13} strokeWidth={1.7} />
          New Delhi, India
        </NavTooltip>
        <NavTooltip open={openTooltip === 'time'} onClose={closeTooltip} anchorRef={timeRef}>
          <TimeOfDayIcon />
        </NavTooltip>

        <div className="kb-hero-copy">
          <h1>Building thoughtful<br />systems that make<br />technology feel<br /><i>effortless.</i></h1>
          <div className="kb-hero-action">
            <BlurText
              text="Turning ideas into clean, useful, and reliable digital products."
              animateBy="letters" direction="bottom" delay={16} stepDuration={0.34} threshold={0.2}
              animationFrom={{ filter: 'blur(7px)', opacity: 0, y: 10 }}
              animationTo={[{ filter: 'blur(2px)', opacity: 0.58, y: 2 }, { filter: 'blur(0px)', opacity: 1, y: 0 }]}
              easing={(value: number) => 1 - Math.pow(1 - value, 3)}
              className="kb-reveal-copy kb-hero-intro"
            />
            <SpecularButton
              className="kb-circle" size="sm" radius={999} tint="#080807" tintOpacity={0.5}
              lineColor="#d5b27e" baseColor="#493c2b" intensity={1.1} shineSize={18} shineFade={38}
              ariaLabel="Explore selected work" onClick={() => emitPortfolioEvent(portfolioEvents.navigate, 1)}
            >
              <ArrowDownRight />
            </SpecularButton>
          </div>
        </div>
      </div>
    </PortfolioSlide>
  );
}
