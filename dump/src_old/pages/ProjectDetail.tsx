import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { initialProjects, fetchGitHubRepos } from '../data/projects';
import { Project } from '../types';
import { ArrowLeft, ExternalLink, CheckCircle, AlertTriangle, Layers, Code } from 'lucide-react';
import { GithubIcon } from '../components/ui/Icons';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  useEffect(() => {
    fetchGitHubRepos().then((data) => {
      if (data && data.length > 0) {
        setProjects(data);
      }
    });
  }, []);

  const project = projects.find((p) => p.slug === slug || p.slug.toLowerCase() === (slug || '').toLowerCase());

  if (!project) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto px-4 text-center py-20 space-y-6">
          <h1 className="text-title-1 font-heading text-slate-100">Project Not Found</h1>
          <p className="text-slate-400 text-sm">The project parameter "{slug}" could not be located in the repository catalog.</p>
          <Link to="/projects">
            <Button variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Catalog
            </Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-sky-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects Catalog</span>
        </Link>

        {/* Hero Banner */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="cyan">{project.projectId || 'PROJECT-ID'}</Badge>
            <Badge variant={project.stat === 'LIVE' ? 'emerald' : 'slate'}>{project.stat}</Badge>
            <span className="font-mono text-xs text-slate-400">{project.year || '2024'}</span>
          </div>

          <h1 className="text-display font-heading font-extrabold text-slate-100">
            {project.title}
          </h1>

          <p className="text-body-lg text-slate-300 max-w-3xl leading-relaxed">
            {project.fullDescription || project.desc}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" icon={<ExternalLink className="w-4 h-4" />}>
                  Launch Live Demo
                </Button>
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" icon={<GithubIcon className="w-4 h-4" />}>
                  View Source Code
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-slate-900">
          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-8">
            {project.overview && (
              <Card className="space-y-3">
                <h3 className="text-title-3 font-heading text-slate-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-sky-400" />
                  <span>Overview & Architecture</span>
                </h3>
                <p className="text-body-sm text-slate-300 leading-relaxed">
                  {project.overview}
                </p>
              </Card>
            )}

            {project.problem && (
              <Card className="space-y-3 border-amber-500/20 bg-amber-950/10">
                <h3 className="text-title-3 font-heading text-amber-200 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>Problem Statement</span>
                </h3>
                <p className="text-body-sm text-slate-300 leading-relaxed">
                  {project.problem}
                </p>
              </Card>
            )}

            {project.solution && (
              <Card className="space-y-3 border-emerald-500/20 bg-emerald-950/10">
                <h3 className="text-title-3 font-heading text-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Engineering Solution</span>
                </h3>
                <p className="text-body-sm text-slate-300 leading-relaxed">
                  {project.solution}
                </p>
              </Card>
            )}
          </div>

          {/* Sidebar Tech Specs */}
          <div className="space-y-6">
            <Card className="space-y-4">
              <h3 className="font-heading font-bold text-base text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
                <Code className="w-4 h-4 text-sky-400" />
                <span>Tech Stack</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t, idx) => (
                  <span key={idx} className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-800 text-sky-300 border border-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="space-y-3">
              <h3 className="font-heading font-bold text-base text-slate-100 border-b border-slate-800 pb-3">
                Repository Details
              </h3>
              <div className="space-y-2 text-xs font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Language</span>
                  <span className="text-slate-200">{project.language || 'TypeScript'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stars</span>
                  <span className="text-amber-400">{project.stars || 0} ⭐</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="text-emerald-400">{project.stat}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
