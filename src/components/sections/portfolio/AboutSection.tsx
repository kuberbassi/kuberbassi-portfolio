import BlurText from '../../BlurText';
import ScrollVelocity from '../../ScrollVelocity';
import { PortfolioSlide } from './PortfolioSlide';

const focus = ['Software Engineering', 'Full-Stack Development', 'AI Engineering', 'Automation', 'Product Design', 'Interface Design', 'Browser Applications'];
const principles = ['Simplicity', 'Precision', 'Performance', 'Structure', 'Intent', 'Consistency', 'Curiosity'];

export function AboutSection({ activeIndex, leavingIndex, deckEnabled }: {
  activeIndex: number;
  leavingIndex: number | null;
  deckEnabled: boolean;
}) {
  const active = activeIndex === 1;
  const present = !deckEnabled || active || leavingIndex === 1 || Math.abs(activeIndex - 1) <= 1;
  return (
    <PortfolioSlide id="about" index={1} activeIndex={activeIndex} deckEnabled={deckEnabled}>
      <div className="kb-intro">
        <div className="kb-about-content">
          <p className="kb-label kb-about-label">About</p>
          <h2>Useful things.<br /><i>Carefully made.</i></h2>
          <BlurText
            text="I build software, products, and creative tools with simplicity, performance, and long-term thinking."
            animateBy="letters" direction="bottom" delay={18} stepDuration={0.38} threshold={0.2}
            animationFrom={{ filter: 'blur(8px)', opacity: 0, y: 12 }}
            animationTo={[{ filter: 'blur(3px)', opacity: 0.55, y: 3 }, { filter: 'blur(0px)', opacity: 1, y: 0 }]}
            easing={(value: number) => 1 - Math.pow(1 - value, 3)} className="kb-about-statement"
          />
        </div>
        <div className="kb-focus kb-about-strip" aria-label="Focus and principles">
          <div className="kb-marquee-viewport"><div className="kb-marquee">
            {[...focus, ...focus].map((item, index) => <span key={`${item}-${index}`}>{item} <b>✦</b></span>)}
          </div></div>
          {present && <ScrollVelocity items={principles} active={active} idleVelocity={24} maxVelocity={180} copies={4} />}
        </div>
      </div>
    </PortfolioSlide>
  );
}
