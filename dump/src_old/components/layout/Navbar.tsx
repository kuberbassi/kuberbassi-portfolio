import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';
import { navigationLinks } from '../../data/navigation';
import { profile } from '../../data/profile';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 pointer-events-none">
      <div
        className={`max-w-6xl mx-auto pointer-events-auto rounded-2xl transition-all duration-300 ${
          scrolled
            ? 'bg-[#08080d]/90 border border-rose-500/20 shadow-2xl shadow-black/80 backdrop-blur-2xl px-5 py-2.5'
            : 'bg-[#0a0a10]/75 border border-white/10 shadow-xl backdrop-blur-xl px-6 py-3'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-slate-950 transition-all duration-300 shadow-md shadow-rose-500/20">
              <Terminal className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-white group-hover:text-rose-400 transition-colors text-sm tracking-tight">
                {profile.name}
              </span>
              <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase">
                Systems Architect
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-full border border-white/10 shadow-inner">
            {navigationLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-rose-500 text-slate-950 font-bold shadow-md shadow-rose-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Links & Socials */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href="https://github.com/kuberbassi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8.5 h-8.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-all"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/kuberbassi/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8.5 h-8.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-all"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-4 py-2 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500 hover:text-slate-950 transition-all duration-300 shadow-sm shadow-rose-500/10"
            >
              <span>CONNECT</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/10">
            <nav className="flex flex-col gap-1.5">
              {navigationLinks.map((link) => {
                const isActive =
                  link.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-colors ${
                      isActive
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
