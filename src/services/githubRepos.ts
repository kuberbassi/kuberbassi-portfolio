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

export function resolveRepoImage(repoName: string, homepage: string | null): string {
  if (homepage && homepage.trim().startsWith('http')) {
    // If live website exists, priority open-graph preview / live embed thumbnail
    return `https://opengraph.githubassets.com/1/kuberbassi/${repoName}`;
  }
  // Standard GitHub repository embed image
  return `https://opengraph.githubassets.com/1/kuberbassi/${repoName}`;
}

let projectsRequest: Promise<Project[]> | null = null;

export function fetchLiveGitHubProjects(): Promise<Project[]> {
  if (projectsRequest) return projectsRequest;

  projectsRequest = (async () => {
    const res = await fetch('/api/github-projects', {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) {
      throw new Error(res.status === 403
        ? 'GitHub request limit reached. Please try again shortly.'
        : `GitHub projects are unavailable right now (${res.status}).`);
    }

    const rawData: GitHubRepoRaw[] = await res.json();
    if (!Array.isArray(rawData)) throw new Error('GitHub returned an unexpected response.');

    const formatted: Project[] = rawData
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
      .map((repo, idx) => {
        const slug = repo.name.toLowerCase();
        const title = formatRepoTitle(repo.name);
        const desc = repo.description || 'Public GitHub software project engineered by Kuber Bassi.';
        const homepage = repo.homepage && repo.homepage.trim().length > 0 ? repo.homepage.trim() : undefined;
        const img = resolveRepoImage(repo.name, repo.homepage);

        const techList: string[] = [];
        if (repo.language) techList.push(repo.language);
        if (repo.topics && repo.topics.length > 0) {
          techList.push(...repo.topics.slice(0, 3));
        }
        if (techList.length === 0) techList.push('TypeScript');

        const isAI = slug.includes('ai') || repo.language === 'Python';
        const category = isAI ? 'ai' : 'fullstack';

        return {
          title,
          slug,
          desc,
          fullDescription: desc,
          overview: `Automated GitHub repository sync for ${title}.`,
          tech: techList,
          language: repo.language || 'TypeScript',
          stars: repo.stargazers_count,
          img,
          link: homepage,
          github: repo.html_url,
          projectId: `GH-${String(idx + 1).padStart(3, '0')}`,
          version: 'v1.0.0',
          stat: homepage ? 'LIVE' : 'SOURCE',
          featured: repo.stargazers_count > 0 || idx < 4,
          category,
          year: new Date(repo.updated_at).getFullYear().toString(),
        };
      });

    return formatted;
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
