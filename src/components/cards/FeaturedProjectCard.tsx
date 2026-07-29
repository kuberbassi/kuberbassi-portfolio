import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';

function IconGithub({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.73.083-.73 1.205.084 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.305 3.492.997.108-.776.418-1.305.762-1.605-2.665-.3-5.467-1.335-5.467-5.93 0-1.31.465-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.232 1.91 1.232 3.22 0 4.61-2.807 5.625-5.48 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.697.825.578C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';
import { fadeUpVariants } from '../../lib/motion';
import type { Project } from '../../types';

interface FeaturedProjectCardProps {
  project: Project;
  index: number;
  className?: string;
}

const statVariant: Record<string, 'success' | 'accent' | 'default' | 'ghost'> = {
  LIVE:     'success',
  SOURCE:   'default',
  WIP:      'accent',
  ARCHIVED: 'ghost',
};

export function FeaturedProjectCard({ project, index, className }: FeaturedProjectCardProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.article
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={cn(
        'group grid gap-8 items-center',
        'lg:grid-cols-[1fr_1fr]',
        className
      )}
    >
      {/* Number + content — alternates side */}
      <div className={cn('flex flex-col gap-6', !isEven && 'lg:order-2')}>
        {/* Index */}
        <span
          className="font-display text-[7rem] font-800 leading-none select-none pointer-events-none"
          style={{ color: 'var(--color-border)', lineHeight: 1 }}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Meta */}
        <div className="flex items-center gap-3 flex-wrap -mt-12">
          <Badge variant={statVariant[project.stat] ?? 'default'}>{project.stat}</Badge>
          <span className="type-label">{project.category}</span>
          <span className="type-mono">{project.year}</span>
        </div>

        {/* Title */}
        <h3 className="type-h2 text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
          {project.title}
        </h3>

        {/* Description */}
        <p className="type-lead">{project.desc}</p>

        {/* Tech */}
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Badge key={t} variant="ghost" className="type-mono">{t}</Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:gap-3 transition-all duration-200"
          >
            Case study <ArrowUpRight size={14} />
          </Link>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <IconGithub size={14} /> Source
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <ExternalLink size={14} strokeWidth={1.5} /> Live
            </a>
          )}
        </div>
      </div>

      {/* Visual panel */}
      <div
        className={cn(
          'relative aspect-video surface-2 overflow-hidden flex items-center justify-center',
          !isEven && 'lg:order-1'
        )}
      >
        {project.img ? (
          <img
            src={project.img}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-400"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <span
              className="text-5xl font-display font-bold text-gradient select-none"
            >
              {project.title.charAt(0)}
            </span>
            <span className="type-mono">{project.projectId}</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] to-transparent opacity-20"
          aria-hidden="true"
        />
      </div>
    </motion.article>
  );
}
