import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ArrowUpRight } from 'lucide-react';
import { profile } from '../../data/profile';
import { navigationLinks } from '../../data/navigation';
import { socials } from '../../data/socials';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-sky-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-slate-900">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-slate-100 text-lg">
                {profile.name}
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              {profile.intro}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{profile.availability}</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading text-xs uppercase tracking-widest text-slate-300 font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              {navigationLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-sky-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/legacy/"
                  className="text-amber-400/80 hover:text-amber-300 transition-colors inline-flex items-center gap-1 font-mono text-xs"
                >
                  <span>Legacy Archive</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="font-heading text-xs uppercase tracking-widest text-slate-300 font-semibold">
              Connect
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-sky-400 hover:border-sky-500/40 text-xs font-medium transition-all inline-flex items-center gap-1.5"
                >
                  <span>{s.label}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              ))}
            </div>
            <p className="text-slate-400 text-xs font-mono pt-2">
              Email: <a href={`mailto:${profile.email}`} className="text-sky-400 hover:underline">{profile.email}</a>
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p className="text-slate-400">
            Built with React 19, TypeScript & Vite.
          </p>
        </div>
      </div>
    </footer>
  );
};
