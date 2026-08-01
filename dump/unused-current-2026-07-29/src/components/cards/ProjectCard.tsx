import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Star } from 'lucide-react';

function IconGithub({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.73.083-.73 1.205.084 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.305 3.492.997.108-.776.418-1.305.762-1.605-2.665-.3-5.467-1.335-5.467-5.93 0-1.31.465-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.232 1.91 1.232 3.22 0 4.61-2.807 5.625-5.48 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.697.825.578C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';
import { staggerItem, cardHover } from '../../lib/motion';
import type { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const statVariant: Record<string, 'success' | 'accent' | 'default' | 'ghost'> = {
  LIVE:     'success',
  SOURCE:   'default',
  WIP:      'accent',
  ARCHIVED: 'ghost',
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <motion.article
      variants={staggerItem}
      initial="rest"
      whileHover="hover"
      className={cn(
        'group relative flex flex-col surface p-7 sm:p-8 rounded-2xl transition-all duration-250 hover:border-[var(--color-border-strong)]',
        className
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={statVariant[project.stat] ?? 'default'}>{project.stat}</Badge>
          <span className="type-mono">{project.year}</span>
        </div>
        <div className="flex items-center gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} GitHub`}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <IconGithub size={16} />
            </a>
          )}
          {typeof project.stars === 'number' && project.stars > 0 && (
            <span className="flex items-center gap-1 type-mono text-[var(--color-text-muted)]">
              <Star size={12} /> {project.stars}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="type-h4 mb-2 text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
        {project.title}
      </h3>

      {/* Description */}
      <p className="type-sm clamp-2 mb-5 flex-1">{project.desc}</p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-2 mb-5">
        {project.tech.slice(0, 4).map((t) => (
          <Badge key={t} variant="ghost" className="type-mono">
            {t}
          </Badge>
        ))}
      </div>

      {/* CTA */}
      <Link
        to={`/projects/${project.slug}`}
        className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mt-auto"
      >
        View details <ArrowUpRight size={12} />
      </Link>

      {/* Hover accent line */}
      <motion.span
        variants={cardHover}
        className="absolute bottom-0 left-0 w-full h-px bg-[var(--color-accent)] origin-left"
        style={{ scaleX: 0 }}
        animate={{ scaleX: 0 }}
        whileHover={{ scaleX: 1, transition: { duration: 0.3 } }}
      />
    </motion.article>
  );
}
