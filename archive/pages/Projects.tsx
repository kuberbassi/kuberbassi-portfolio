import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { initialProjects, fetchGitHubRepos } from '../data/projects';
import { Project } from '../types';
import { Search, ExternalLink, Filter } from 'lucide-react';
import { GithubIcon } from '../components/ui/Icons';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchGitHubRepos().then((data) => {
      if (data && data.length > 0) {
        setProjects(data);
      }
    });
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      activeCategory === 'all' ||
      (activeCategory === 'fullstack' && p.category === 'fullstack') ||
      (activeCategory === 'ai' && p.category === 'ai') ||
      (activeCategory === 'systems' && p.category === 'systems');

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tech.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <Badge variant="crimson">✦ REPOSITORY CATALOG ✦</Badge>
          <h1 className="text-display font-heading font-extrabold text-white">
            Engineering <span className="text-gradient-crimson">Catalog</span>.
          </h1>
          <p className="text-body-lg text-slate-300 leading-relaxed">
            Full-stack applications, AI RAG systems, WebGL canvas experiments, and public GitHub open-source repositories.
          </p>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-slate-950/80 p-3 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-lg">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeCategory === 'all'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              ALL ({projects.length})
            </button>
            <button
              onClick={() => setActiveCategory('fullstack')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeCategory === 'fullstack'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              FULL-STACK
            </button>
            <button
              onClick={() => setActiveCategory('ai')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeCategory === 'ai'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              AI & AUTOMATION
            </button>
            <button
              onClick={() => setActiveCategory('systems')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeCategory === 'systems'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              SYSTEMS & WEBGL
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tech, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.slug} className="flex flex-col justify-between group border-slate-800/80 bg-slate-950/70 hover:border-rose-500/40">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-rose-400 font-bold tracking-wider">{project.projectId}</span>
                  <Badge variant={project.stat === 'LIVE' ? 'emerald' : 'slate'} size="sm">
                    {project.stat}
                  </Badge>
                </div>

                <h3 className="text-title-3 font-heading text-white group-hover:text-rose-400 transition-colors">
                  {project.title}
                </h3>

                <p className="text-body-sm text-slate-300 line-clamp-3 leading-relaxed">
                  {project.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tech.map((t, idx) => (
                    <span key={idx} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6 mt-6 border-t border-slate-900">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-rose-400 hover:text-rose-300"
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
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-400 hover:text-white"
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

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800">
            <Filter className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="font-heading font-bold text-lg text-slate-200">No matching projects found</h3>
            <p className="text-xs text-slate-400">Try adjusting your search query or switching categories.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
