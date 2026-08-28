import { describe, expect, it } from 'vitest';
import {
  formatGitHubProjects,
  formatRepoTitle,
  parseGitHubRepositories,
  resolveRepoImage,
  type GitHubRepoRaw,
} from './githubRepos';

const repository = (overrides: Partial<GitHubRepoRaw> = {}): GitHubRepoRaw => ({
  id: 1,
  name: 'sample-project',
  full_name: 'kuberbassi/sample-project',
  html_url: 'https://github.com/kuberbassi/sample-project',
  description: 'A sample project.',
  homepage: null,
  stargazers_count: 0,
  forks_count: 0,
  language: 'TypeScript',
  fork: false,
  private: false,
  archived: false,
  updated_at: '2026-08-28T00:00:00Z',
  topics: [],
  ...overrides,
});

describe('GitHub project formatting', () => {
  it('turns repository slugs into readable titles', () => {
    expect(formatRepoTitle('my-ai_api')).toBe('My AI API');
  });

  it('uses the stable GitHub preview URL', () => {
    expect(resolveRepoImage('sample-project')).toBe(
      'https://opengraph.githubassets.com/1/kuberbassi/sample-project',
    );
  });

  it('removes hidden repositories and puts live projects first', () => {
    const projects = formatGitHubProjects([
      repository({ id: 1, name: 'source-only', stargazers_count: 20 }),
      repository({ id: 2, name: 'live-project', homepage: ' https://example.com ' }),
      repository({ id: 3, name: 'forked-project', fork: true }),
      repository({ id: 4, name: 'archived-project', archived: true }),
    ]);

    expect(projects.map(({ slug }) => slug)).toEqual(['live-project', 'source-only']);
    expect(projects[0]).toMatchObject({ link: 'https://example.com', stat: 'LIVE' });
  });

  it('provides safe fallback copy and technology', () => {
    const [project] = formatGitHubProjects([
      repository({ description: null, language: null, topics: undefined }),
    ]);

    expect(project.desc).toContain('Public GitHub software project');
    expect(project.tech).toEqual(['TypeScript']);
    expect(project.year).toBe('2026');
  });

  it('rejects malformed API data before the UI uses it', () => {
    expect(() => parseGitHubRepositories({ message: 'rate limited' })).toThrow(
      'GitHub returned an unexpected response.',
    );
    expect(() => parseGitHubRepositories([repository({ name: undefined as never })])).toThrow();
    expect(parseGitHubRepositories([repository()])).toHaveLength(1);
  });
});
