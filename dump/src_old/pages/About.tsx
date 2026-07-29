import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { profile, journeyExperience } from '../data/profile';
import { CheckCircle2, MapPin, Mail, Sparkles, Terminal } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <Badge variant="crimson">✦ ABOUT & PHILOSOPHY ✦</Badge>
          <h1 className="text-display font-heading font-extrabold text-white">
            Architecture, Precision & <span className="text-gradient-crimson">Craft</span>.
          </h1>
          <p className="text-body-lg text-slate-300 leading-relaxed">
            {profile.intro}
          </p>
        </div>

        {/* Bio & Identity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <Card className="space-y-4 border-slate-800 bg-slate-950/70 p-7">
              <h2 className="text-title-2 font-heading text-white">Engineering Philosophy</h2>
              <p className="text-body-sm text-slate-300 leading-relaxed">
                {profile.signature}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-900">
                {profile.identityBridge.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <span className="text-xs font-mono text-rose-400 font-bold tracking-wider uppercase">{item.label}</span>
                    <h4 className="font-heading font-bold text-white text-base">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-normal">{item.text}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Principles */}
            <div className="space-y-4">
              <h3 className="text-title-3 font-heading text-slate-200">Core Principles</h3>
              <div className="grid grid-cols-1 gap-4">
                {profile.principles.map((p, idx) => (
                  <Card key={idx} className="p-5 flex items-start gap-4 border-slate-800 bg-slate-950/60">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-heading font-bold text-white">{p.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{p.text}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Info Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="space-y-4 bg-slate-950/80 border-slate-800 p-6">
              <h3 className="font-heading font-bold text-lg text-white border-b border-slate-900 pb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-rose-400" />
                <span>Profile Parameters</span>
              </h3>
              <div className="space-y-3 text-sm font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Name</span>
                  <span className="text-white font-bold">{profile.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Role</span>
                  <span className="text-rose-400 text-xs font-semibold">{profile.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Location</span>
                  <span className="text-slate-300 text-xs inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.location}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Email</span>
                  <a href={`mailto:${profile.email}`} className="text-rose-400 hover:underline text-xs inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{profile.email}</span>
                  </a>
                </div>
              </div>
            </Card>

            <Card className="space-y-4 border-slate-800 bg-slate-950/80 p-6">
              <h3 className="font-heading font-bold text-lg text-white border-b border-slate-900 pb-3">
                Focus Areas
              </h3>
              <ul className="space-y-2 text-xs font-mono">
                {profile.focusAreas.map((area, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="space-y-8 pt-8">
          <div>
            <Badge variant="cyan" className="mb-2">✦ EXPERIENCE TIMELINE ✦</Badge>
            <h2 className="text-title-1 font-heading text-white">Journey & Track Record</h2>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
            {journeyExperience.map((exp) => (
              <div key={exp.id} className="relative pl-10 space-y-2">
                <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-[#050508] border-2 border-rose-500 shadow-sm shadow-rose-500/50" />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-heading font-bold text-lg text-white">{exp.title}</h3>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 text-rose-300 border border-rose-500/30">
                    {exp.period}
                  </span>
                </div>
                <span className="block text-xs font-mono text-slate-400">{exp.organization} • {exp.role}</span>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">{exp.description}</p>
                <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pt-1">
                  {exp.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
