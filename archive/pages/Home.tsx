import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Terminal, Sparkles, ExternalLink, Cpu, Layers, Zap, CheckCircle2, Flame, Activity } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { profile } from '../data/profile';
import { initialProjects, fetchGitHubRepos } from '../data/projects';
import { GithubIcon } from '../components/ui/Icons';
import { Project } from '../types';

export const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  useEffect(() => {
    fetchGitHubRepos().then((data) => {
      if (data && data.length > 0) {
        setProjects(data);
      }
    });
  }, []);

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <PageWrapper>
      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="relative pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-8 max-w-4xl">
            {/* Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/80 border border-rose-500/30 text-xs font-mono text-slate-200 shadow-xl shadow-rose-950/20 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="tracking-wider uppercase">SYSTEM ACTIVE • {profile.availability}</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight leading-[1.08] text-white">
                Architecting <span className="text-gradient-crimson">High-Performance</span> Digital Systems.
              </h1>
              <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
                Hi, I'm <strong className="text-white font-semibold">{profile.name}</strong> — a Full-Stack Systems Architect & Product Engineer crafting scalable web applications, AI automation agents, and interactive digital interfaces.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link to="/projects">
                <Button variant="crimson" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                  EXPLORE PROJECTS
                </Button>
              </Link>

              <Link to="/contact">
                <Button variant="secondary" size="lg" icon={<Sparkles className="w-4 h-4 text-rose-400" />}>
                  GET IN TOUCH
                </Button>
              </Link>
            </motion.div>

            {/* Metrics Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8 border-t border-white/10"
            >
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-1">
                <span className="block font-heading font-bold text-3xl text-white">30+</span>
                <span className="text-xs text-slate-400 font-mono">Public Repositories</span>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-1">
                <span className="block font-heading font-bold text-3xl text-rose-400">Full-Stack</span>
                <span className="text-xs text-slate-400 font-mono">React 19, Node & Python</span>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-1">
                <span className="block font-heading font-bold text-3xl text-sky-400">AI & RAG</span>
                <span className="text-xs text-slate-400 font-mono">Automated Workflows</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== 2. FEATURED PROJECTS SHOWCASE ==================== */}
      <section className="section-padding relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <Badge variant="crimson" className="mb-3">
                ✦ CURATED WORK ✦
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">Featured Engineering Builds</h2>
            </div>
            <Link to="/projects">
              <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                ALL PROJECTS →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Card key={project.slug} className="flex flex-col justify-between group border-white/10 bg-slate-950/70 hover:border-rose-500/40 p-6 rounded-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-rose-400 font-bold tracking-wider">{project.projectId}</span>
                    <Badge variant={project.stat === 'LIVE' ? 'emerald' : 'slate'} size="sm">
                      {project.stat}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-white group-hover:text-rose-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                    {project.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tech.map((t, idx) => (
                      <span key={idx} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-6 mt-6 border-t border-white/5">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-400 hover:text-rose-300"
                    >
                      <span>LIVE APP</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>SOURCE</span>
                    </a>
                  )}
                  <Link to={`/projects/${project.slug}`} className="ml-auto text-xs text-slate-500 hover:text-slate-300 font-mono">
                    SPECS →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 3. CAPABILITIES & ARCHITECTURE MATRIX ==================== */}
      <section className="section-padding relative bg-slate-950/70 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <Badge variant="cyan" className="mb-3">
              ✦ CORE STACK ✦
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">Technical Architecture & Stack</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="space-y-4 border-white/10 bg-slate-950/60 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white">Frontend Engineering</h3>
              <ul className="space-y-2 text-xs font-mono text-slate-400">
                {profile.skills.frontend.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="space-y-4 border-white/10 bg-slate-950/60 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white">Backend Systems</h3>
              <ul className="space-y-2 text-xs font-mono text-slate-400">
                {profile.skills.backend.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="space-y-4 border-white/10 bg-slate-950/60 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white">AI Agents & RAG</h3>
              <ul className="space-y-2 text-xs font-mono text-slate-400">
                {profile.skills.aiAutomation.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="space-y-4 border-white/10 bg-slate-950/60 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white">DevOps & Tooling</h3>
              <ul className="space-y-2 text-xs font-mono text-slate-400">
                {profile.skills.tools.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* ==================== 4. CONTACT CTA ==================== */}
      <section className="section-padding relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center p-10 sm:p-14 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 border-rose-500/30 space-y-6 shadow-2xl shadow-rose-950/30 rounded-3xl">
            <Badge variant="crimson" className="mx-auto">
              ✦ INITIATE COLLABORATION ✦
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
              Ready to Engineer Your Next Digital System?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Available for software architecture, AI workflow automation, custom web applications, and product development.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link to="/contact">
                <Button variant="crimson" size="lg" icon={<Flame className="w-4 h-4" />}>
                  START TRANSMISSION
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </PageWrapper>
  );
};
