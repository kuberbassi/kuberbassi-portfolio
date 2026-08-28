import { useEffect, useState } from 'react';
import type { Project } from '../types';

export interface GitHubRepoRaw {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
  private: boolean;
  archived?: boolean;
  updated_at: string;
  topics?: string[];
}

export function isGitHubRepoRaw(value: unknown): value is GitHubRepoRaw {
  if (!value || typeof value !== 'object') return false;
  const repository = value as Record<string, unknown>;
  return typeof repository.id === 'number'
    && typeof repository.name === 'string'
    && typeof repository.full_name === 'string'
    && typeof repository.html_url === 'string'
    && (typeof repository.description === 'string' || repository.description === null)
    && (typeof repository.homepage === 'string' || repository.homepage === null)
    && typeof repository.stargazers_count === 'number'
    && typeof repository.forks_count === 'number'
    && (typeof repository.language === 'string' || repository.language === null)
    && typeof repository.fork === 'boolean'
    && typeof repository.private === 'boolean'
    && typeof repository.updated_at === 'string'
    && (repository.archived === undefined || typeof repository.archived === 'boolean')
    && (repository.topics === undefined
      || (Array.isArray(repository.topics) && repository.topics.every((topic) => typeof topic === 'string')));
}

export function parseGitHubRepositories(value: unknown): GitHubRepoRaw[] {
  if (!Array.isArray(value) || !value.every(isGitHubRepoRaw)) {
    throw new Error('GitHub returned an unexpected response.');
  }
  return value;
}

export function formatRepoTitle(name: string): string {
  return name
    .split(/[-_]/)
    .map((word) => {
      const lower = word.toLowerCase();
      if (['ai', 'ui', 'api', 'cli', '3d', 'css', 'js', 'hrms'].includes(lower)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export function resolveRepoImage(repoName: string): string {
  return `https://opengraph.githubassets.com/1/kuberbassi/${repoName}`;
}

export function formatGitHubProjects(rawData: GitHubRepoRaw[]): Project[] {
  return rawData
    .filter((repo) =>
      !repo.fork &&
      !repo.private &&
      !repo.archived &&
      repo.name.toLowerCase() !== 'kuberbassi'
    )
    .sort((a, b) => {
      const liveDifference = Number(Boolean(b.homepage)) - Number(Boolean(a.homepage));
      if (liveDifference !== 0) return liveDifference;
      return b.stargazers_count - a.stargazers_count;
    })
    .map((repo, index) => {
      const slug = repo.name.toLowerCase();
      const title = formatRepoTitle(repo.name);
      const desc = repo.description || 'Public GitHub software project engineered by Kuber Bassi.';
      const homepage = repo.homepage?.trim() || undefined;
      const tech = [repo.language, ...(repo.topics ?? []).slice(0, 3)]
        .filter((item): item is string => Boolean(item));

      if (tech.length === 0) tech.push('TypeScript');

      return {
        title,
        slug,
        desc,
        fullDescription: desc,
        overview: `Automated GitHub repository sync for ${title}.`,
        tech,
        language: repo.language || 'TypeScript',
        stars: repo.stargazers_count,
        img: resolveRepoImage(repo.name),
        link: homepage,
        github: repo.html_url,
        projectId: `GH-${String(index + 1).padStart(3, '0')}`,
        version: 'v1.0.0',
        stat: homepage ? 'LIVE' : 'SOURCE',
        featured: repo.stargazers_count > 0 || index < 4,
        category: slug.includes('ai') || repo.language === 'Python' ? 'ai' : 'fullstack',
        year: new Date(repo.updated_at).getFullYear().toString(),
      };
    });
}

let projectsRequest: Promise<Project[]> | null = null;

export function fetchLiveGitHubProjects(): Promise<Project[]> {
  if (projectsRequest) return projectsRequest;

  projectsRequest = (async () => {
    const res = await fetch('/api/github-projects', {
      headers: { Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      throw new Error(res.status === 403
        ? 'GitHub request limit reached. Please try again shortly.'
        : `GitHub projects are unavailable right now (${res.status}).`);
    }

    return formatGitHubProjects(parseGitHubRepositories(await res.json()));
  })().catch((error) => {
    projectsRequest = null;
    throw error;
  });

  return projectsRequest;
}

export function useGitHubProjects(enabled = true) {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    fetchLiveGitHubProjects()
      .then((data) => {
        if (!isMounted) return;
        setProjectsList(data);
      })
      .catch((reason: unknown) => {
        if (!isMounted) return;
        setProjectsList([]);
        setError(reason instanceof Error ? reason.message : 'Unable to load GitHub projects.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [enabled]);

  return { projects: projectsList, loading, error };
}
