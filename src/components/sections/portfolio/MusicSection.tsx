import { ArrowUpRight } from 'lucide-react';
import { SiApplemusic, SiSpotify, SiYoutube, SiYoutubemusic } from 'react-icons/si';
import { TbBrandAmazon } from 'react-icons/tb';
import type { IconType } from 'react-icons';
import { musicChannels } from '../../../data/music';
import { emitPortfolioEvent, portfolioEvents } from '../../../utils/portfolioEvents';
import BlurText from '../../BlurText';
import SpecularButton from '../../SpecularButton';
import { PortfolioSlide } from './PortfolioSlide';

const platformIcons: Record<string, IconType> = {
  Spotify: SiSpotify,
  'Apple Music': SiApplemusic,
  'Amazon Music': TbBrandAmazon,
  YouTube: SiYoutube,
  'YouTube Music': SiYoutubemusic,
};

export function MusicSection({ activeIndex, leavingIndex, deckEnabled }: {
  activeIndex: number;
  leavingIndex: number | null;
  deckEnabled: boolean;
}) {
  const active = activeIndex === 4;
  const present = !deckEnabled || active || leavingIndex === 4 || Math.abs(activeIndex - 4) <= 1;
  return (
    <PortfolioSlide id="music" index={4} activeIndex={activeIndex} deckEnabled={deckEnabled}>
      <div className="kb-music">
        <div className="kb-music-copy"><p className="kb-label">Music</p><h2>Making space<br />for <i>sound.</i></h2></div>
        <div className="kb-music-listen">
          <BlurText
            text="Original music, cinematic sound, and guitar — another way I build with intention."
            animateBy="words" direction="bottom" delay={54} stepDuration={0.32} threshold={0.2}
            animationFrom={{ filter: 'blur(6px)', opacity: 0, y: 8 }}
            animationTo={[{ filter: 'blur(2px)', opacity: 0.55, y: 2 }, { filter: 'blur(0px)', opacity: 1, y: 0 }]}
            className="kb-reveal-copy kb-music-intro"
          />
          {present && (
            <div className="kb-spotify-shell">
              <span className="kb-spotify-skeleton" aria-hidden="true" />
              <iframe
                className="kb-spotify-embed" title="Featured track on Spotify"
                src="https://open.spotify.com/embed/track/19uF87i1d51C6AeTrMUWaA?utm_source=generator&theme=0&si=26ffa32d9b8140b7"
                width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy" onMouseEnter={() => emitPortfolioEvent(portfolioEvents.cursorSuspend, true)}
                onMouseLeave={() => emitPortfolioEvent(portfolioEvents.cursorSuspend, false)}
                onLoad={(event) => event.currentTarget.parentElement?.classList.add('is-ready')}
              />
            </div>
          )}
          <nav className="kb-music-platforms" aria-label="Listen on music platforms">
            {musicChannels.map((channel) => {
              const PlatformIcon = platformIcons[channel.name];
              return (
                <SpecularButton
                  className="kb-music-platform" href={channel.url} key={channel.name} target="_blank"
                  rel="noopener noreferrer" ariaLabel={`Open Kuber Bassi on ${channel.name}`} size="sm"
                  radius={12} tint="#090908" tintOpacity={0.72} lineColor="#d5b27e" baseColor="#403629"
                  intensity={0.9} shineSize={16} shineFade={38}
                >
                  <PlatformIcon className="kb-music-platform-icon" aria-hidden="true" />
                  <span className="kb-music-platform-copy"><small>Artist profile</small><strong>{channel.name}</strong></span>
                  <ArrowUpRight className="kb-music-platform-arrow" aria-hidden="true" />
                </SpecularButton>
              );
            })}
          </nav>
        </div>
      </div>
    </PortfolioSlide>
  );
}
