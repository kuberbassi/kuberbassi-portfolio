import { Code2, Mail } from 'lucide-react';
import BlurText from '../../BlurText';
import SpecularButton from '../../SpecularButton';
import { Footer } from '../../layout/Footer';
import { PortfolioSlide } from './PortfolioSlide';

export function ContactSection({ activeIndex, deckEnabled }: { activeIndex: number; deckEnabled: boolean }) {
  return (
    <PortfolioSlide id="contact" index={5} activeIndex={activeIndex} deckEnabled={deckEnabled}>
      <div className="kb-closing-card">
        <div className="kb-closing">
          <div className="kb-contact-heading">
            <div className="kb-contact-eyebrow"><p className="kb-label">Contact</p></div>
            <h2>Have an idea?<br /><i>Let's build it well.</i></h2>
            <BlurText
              text="Let's build something worth using." animateBy="words" direction="bottom"
              delay={18} stepDuration={0.38} threshold={0.2}
              animationFrom={{ filter: 'blur(8px)', opacity: 0, y: 12 }}
              animationTo={[{ filter: 'blur(3px)', opacity: 0.55, y: 3 }, { filter: 'blur(0px)', opacity: 1, y: 0 }]}
              className="kb-reveal-copy kb-contact-intro"
            />
            <div className="kb-contact-actions">
              <SpecularButton
                href="mailto:me@kuberbassi.com" size="md" radius={12} tint="#d5b27e" tintOpacity={0.9}
                textColor="#080807" lineColor="#fff0d0" baseColor="#755a35" intensity={1.1} shineSize={16} shineFade={34}
              >Email me <Mail size={17} /></SpecularButton>
              <SpecularButton
                href="https://github.com/kuberbassi" target="_blank" rel="noopener noreferrer" size="md"
                radius={12} tint="#080807" tintOpacity={0.58} lineColor="#d5b27e" baseColor="#4a3c29"
                intensity={1} shineSize={18} shineFade={40}
              >GitHub <Code2 size={17} /></SpecularButton>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PortfolioSlide>
  );
}
