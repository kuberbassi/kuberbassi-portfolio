import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { musicChannels, musicReleases } from '../data/music';
import { Music as MusicIcon, ExternalLink, Radio, Disc, Volume2 } from 'lucide-react';

export const Music: React.FC = () => {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <Badge variant="gold">✦ DISCOGRAPHY & CHANNELS ✦</Badge>
          <h1 className="text-display font-heading font-extrabold">
            Music & <span className="text-gradient-gold">Resonance</span>.
          </h1>
          <p className="text-body-lg text-slate-300 leading-relaxed">
            Original compositions, guitar performances, atmospheric ambient soundscapes, and digital music distribution.
          </p>
        </div>

        {/* Streaming Channels */}
        <div className="space-y-6">
          <h2 className="text-title-2 font-heading text-slate-100 flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400" />
            <span>Streaming Channels & Frequency Bands</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {musicChannels.map((channel) => (
              <Card key={channel.name} className="border-amber-500/20 bg-amber-950/10 space-y-4 hover:border-amber-500/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MusicIcon className="w-4 h-4 text-amber-400" />
                    <h3 className="font-heading font-bold text-slate-100">{channel.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {channel.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {channel.desc}
                </p>

                <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">TUNING {channel.tuning} MHz</span>
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-200"
                  >
                    <span>Listen</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Releases & Audio Player */}
        <div className="space-y-6 pt-6">
          <h2 className="text-title-2 font-heading text-slate-100 flex items-center gap-2">
            <Disc className="w-5 h-5 text-amber-400" />
            <span>Official Releases & Soundscapes</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {musicReleases.map((release) => (
              <Card key={release.id} className="p-8 space-y-6 border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-amber-400 font-semibold">{release.type} • {release.releaseDate}</span>
                    <h3 className="text-title-2 font-heading text-slate-100">{release.title}</h3>
                  </div>
                  <Badge variant="gold" size="sm">{release.genre}</Badge>
                </div>

                <p className="text-body-sm text-slate-300 leading-relaxed">
                  {release.description}
                </p>

                {release.audioPreviewUrl && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                      <Volume2 className="w-4 h-4 animate-pulse" />
                      <span>HIGH FIDELITY AUDIO PREVIEW</span>
                    </div>
                    <audio controls className="w-full h-10 rounded-lg">
                      <source src={release.audioPreviewUrl} type="audio/mp3" />
                      Your browser does not support audio elements.
                    </audio>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  {release.spotifyUrl && (
                    <a
                      href={release.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold hover:bg-emerald-500 hover:text-slate-950 transition-all inline-flex items-center gap-1"
                    >
                      <span>Spotify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {release.appleMusicUrl && (
                    <a
                      href={release.appleMusicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/30 text-xs font-mono font-semibold hover:bg-pink-500 hover:text-slate-950 transition-all inline-flex items-center gap-1"
                    >
                      <span>Apple Music</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
