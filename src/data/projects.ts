import type { Project } from '../types';

export const projects: Project[] = [
  {
    title: 'Zenith',
    slug: 'zenith',
    desc: 'Next-generation academic hub and resource collaboration platform.',
    fullDescription:
      'Zenith is a modern academic platform designed to streamline course material access, collaborative study groups, and notes management.',
    overview:
      'Built with React and Node.js, Zenith provides an intuitive interface for students and educators to organize knowledge seamlessly.',
    problem: 'Existing study platforms are fragmented, ad-heavy, and lack real-time collaborative organization.',
    solution:
      'Unified, high-speed single-page application with instant search, structured subject trees, and clean Markdown notes rendering.',
    tech: ['React', 'Node.js', 'Tailwind CSS', 'Vite'],
    language: 'TypeScript',
    stars: 5,
    img: '/assets/projects/zenith.png',
    link: 'https://zenith-edu.vercel.app',
    github: 'https://github.com/kuberbassi/zenith',
    projectId: 'ZNTH-101',
    version: 'v1.4.0',
    stat: 'LIVE',
    featured: true,
    category: 'fullstack',
    year: '2024',
  },
  {
    title: 'IndiaOnRoaming',
    slug: 'indiaonroaming',
    desc: 'Travel & roaming connectivity platform providing data plans and eSIM integration for travelers.',
    fullDescription:
      'IndiaOnRoaming connects travelers with flexible eSIM data packages across regions with transparent pricing.',
    overview:
      'Integrated with payment gateways and automated eSIM profile delivery services for friction-free travel setup.',
    problem: 'Travelers face expensive roaming fees and confusing local SIM activation procedures.',
    solution: 'Instant digital eSIM purchase flow with real-time data usage tracking and multi-currency checkout.',
    tech: ['Next.js', 'Stripe', 'PostgreSQL', 'TypeScript'],
    language: 'TypeScript',
    stars: 3,
    img: '/assets/projects/indiaonroaming.png',
    link: 'https://indiaonroaming.com',
    github: 'https://github.com/kuberbassi/indiaonroaming',
    projectId: 'ROAM-202',
    version: 'v2.1.0',
    stat: 'LIVE',
    featured: true,
    category: 'fullstack',
    year: '2024',
  },
  {
    title: '3D Book Codex',
    slug: '3d-book-codex',
    desc: 'Interactive 3D scroll-linked and button-navigated page-flip book component for React.',
    fullDescription:
      'An open-source React component built with GSAP and WebGL CSS 3D transforms to display projects as an ancient codex.',
    overview:
      'High-performance 3D page flip physics curve with responsive layout and touch/keyboard controls.',
    problem: 'Standard portfolio grids feel repetitive and lack distinct visual storytelling.',
    solution:
      'Immersive 3D interactive book interface with realistic parchment textures, custom binding stitches, and smooth state transitions.',
    tech: ['React 19', 'GSAP', 'CSS 3D', 'Vite'],
    language: 'JavaScript',
    stars: 8,
    link: 'https://3d-book-codex.vercel.app',
    github: 'https://github.com/kuberbassi/book-component',
    projectId: 'CDX-303',
    version: 'v1.0.0',
    stat: 'LIVE',
    featured: true,
    category: 'open-source',
    year: '2025',
  },
  {
    title: 'YT Music Scrobbler',
    slug: 'ytmusic-scrobbler',
    desc: 'Background service & browser extension tracking YouTube Music listening history to Last.fm.',
    fullDescription:
      'Automatically captures track metadata from YouTube Music playback and submits scrobbles to Last.fm APIs.',
    overview:
      'Lightweight Chrome Extension + background script with offline queuing and duplicate filtration.',
    problem: 'YouTube Music lacks native background scrobbling on desktop browsers and mobile web.',
    solution:
      'Seamless background DOM observer with real-time Last.fm API handshake and playback notifications.',
    tech: ['JavaScript', 'Chrome Extension API', 'Last.fm REST API'],
    language: 'JavaScript',
    stars: 7,
    github: 'https://github.com/kuberbassi/ytmusic-scrobbler',
    projectId: 'SCRO-404',
    version: 'v1.2.0',
    stat: 'SOURCE',
    featured: false,
    category: 'tools',
    year: '2024',
  },
  {
    title: 'Adhikar AI',
    slug: 'adhikar-ai',
    desc: 'AI-powered platform simplifying Indian legal and government information for citizens.',
    fullDescription:
      'Adhikar AI uses LLM agentic retrieval to make complex legal statutes, citizen rights, and government schemes understandable.',
    overview: 'RAG-powered conversational interface with multi-language translation support.',
    problem: 'Legal terminology and government schemes are difficult for ordinary citizens to search and comprehend.',
    solution: 'Natural language search assistant that cites relevant legal clauses in plain language.',
    tech: ['React', 'Python', 'FastAPI', 'LangChain'],
    language: 'Python',
    stars: 4,
    github: 'https://github.com/kuberbassi/adhikar-ai',
    projectId: 'ADHK-505',
    version: 'v0.9.0',
    stat: 'SOURCE',
    featured: false,
    category: 'ai',
    year: '2024',
  },
  {
    title: 'Cosma Space',
    slug: 'cosma-space',
    desc: 'Interactive 3D space exploration and cosmology visualization platform.',
    fullDescription:
      'WebGL 3D canvas rendering planetary orbits, constellation mappings, and astronomical data.',
    overview: 'Built using Three.js and custom shaders for high FPS particle rendering.',
    problem: 'Space data is typically presented in static tables rather than interactive spatial dimensions.',
    solution: 'Full 360-degree interactive WebGL galaxy camera control with live planetary telemetry.',
    tech: ['Three.js', 'React', 'WebGL', 'GLSL'],
    language: 'JavaScript',
    stars: 6,
    github: 'https://github.com/kuberbassi/cosma-space',
    projectId: 'CSMA-606',
    version: 'v1.0.0',
    stat: 'SOURCE',
    featured: false,
    category: 'systems',
    year: '2024',
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export async function fetchGitHubRepos(username = 'kuberbassi'): Promise<Project[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`);
    if (!res.ok) throw new Error(`GitHub API HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const formatted: Project[] = data
      .filter((repo: Record<string, unknown>) => !repo.fork && !repo.private)
      .map((repo: Record<string, unknown>, index: number) => {
        const slug = (repo.name as string).toLowerCase();
        const formattedTitle = (repo.name as string)
          .split(/[-_]/)
          .map((w: string) =>
            ['ai', 'ui', 'api', 'cli', '3d'].includes(w.toLowerCase())
              ? w.toUpperCase()
              : w.charAt(0).toUpperCase() + w.slice(1)
          )
          .join(' ');

        return {
          title: formattedTitle,
          slug,
          desc: (repo.description as string) || 'Public GitHub repository.',
          tech: [(repo.language as string) || 'Code', 'GitHub API'].filter(Boolean),
          language: (repo.language as string) || 'Code',
          stars: (repo.stargazers_count as number) || 0,
          link: (repo.homepage as string) || undefined,
          github: repo.html_url as string,
          projectId: `${slug.substring(0, 4).toUpperCase()}-${String((index + 1) * 101).padStart(3, '0')}`,
          version: 'main',
          stat: (repo.homepage ? 'LIVE' : 'SOURCE') as 'LIVE' | 'SOURCE',
          featured: (repo.stargazers_count as number) > 3,
          category: (repo.language === 'Python' ? 'ai' : 'fullstack') as 'ai' | 'fullstack',
          year: new Date(repo.updated_at as string).getFullYear().toString(),
        };
      });

    return formatted;
  } catch {
    return [];
  }
}
