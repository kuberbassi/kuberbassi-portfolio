/**
 * SELF-MAINTAINING PROJECT CONFIG (FULLY AUTOMATED)
 * ==================================================
 * Pulls all public repositories from GitHub at runtime.
 * Automatically sorts featured repositories first, then by last updated.
 */

import featuredConfig from './featured_projects.json';

const CARD_COLORS = ['v4-card-teal', 'v4-card-blue', 'v4-card-red', 'v4-card-green', 'v4-card-red'];
const GITHUB_USER = 'kuberbassi';
const GITHUB_API = 'https://api.github.com';

/**
 * Derives a display title from a GitHub repo name.
 * e.g. "adhikar-ai" → "Adhikar AI", "mcd-hrms" → "MCD HRMS"
 */
function formatRepoName(repoName) {
    const ACRONYMS = ['ai', 'hrms', 'mcd', 'yt', 'api', 'ui', 'ux', 'cms', 'sdk', 'cli'];
    return repoName
        .split(/[-_]/)
        .map(word => ACRONYMS.includes(word.toLowerCase())
            ? word.toUpperCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
}

/**
 * Generates a project ID from the repo name.
 * e.g. "adhikar-ai" → "ADHK-001"
 */
function generateProjectId(repoName, index) {
    const slug = repoName.replace(/[-_]/g, '').substring(0, 4).toUpperCase();
    return `${slug}-${String((index + 1) * 101).padStart(3, '0')}`;
}

/**
 * Returns initial projects (using localStorage cache if available, or fallback loading placeholders).
 * This ensures instant rendering while the fresh API call loads.
 */
export function getInitialProjects() {
    try {
        const cached = localStorage.getItem('v5_github_cache');
        if (cached) {
            const { data } = JSON.parse(cached);
            if (Array.isArray(data) && data.length > 0) {
                return data;
            }
        }
    } catch (e) {}

    // Static fallback projects list in case of network/connection issues
    return [
        {
            title: "Zenith",
            desc: "Next-generation academic hub and resource collaboration platform.",
            tech: ["Next.js", "React", "TailwindCSS"],
            language: "JavaScript",
            stars: 4,
            img: "/assets/projects/zenith.png",
            link: "https://zenith-edu.vercel.app",
            github: "https://github.com/kuberbassi/zenith",
            projectId: "ZNTH-101",
            version: "main",
            stat: "LIVE",
            cardClass: CARD_COLORS[0]
        },
        {
            title: "IndiaOnRoaming",
            desc: "Travel and roaming connectivity platform providing data plans and eSIM integration for travelers.",
            tech: ["Next.js", "Stripe", "PostgreSQL"],
            language: "TypeScript",
            stars: 2,
            img: "/assets/projects/indiaonroaming.png",
            link: "https://indiaonroaming.com",
            github: "https://github.com/kuberbassi/indiaonroaming",
            projectId: "ROAM-202",
            version: "main",
            stat: "LIVE",
            cardClass: CARD_COLORS[1]
        },
        {
            title: "YT Music Scrobbler",
            desc: "Background service and web interface to track and scrobble YouTube Music listening history to Last.fm.",
            tech: ["JavaScript", "Chrome Ext", "Last.fm API"],
            language: "JavaScript",
            stars: 6,
            img: "/assets/projects/ytmusic-scrobbler.png",
            link: "",
            github: "https://github.com/kuberbassi/ytmusic-scrobbler",
            projectId: "SCRO-303",
            version: "main",
            stat: "SOURCE",
            cardClass: CARD_COLORS[2]
        },
        {
            title: "Cosma Space",
            desc: "Interactive space exploration and cosmology visualization platform.",
            tech: ["Three.js", "React", "WebGL"],
            language: "JavaScript",
            stars: 10,
            img: "/assets/projects/cosma-space.png",
            link: "https://cosma-space.vercel.app",
            github: "https://github.com/kuberbassi/cosma-space",
            projectId: "CSMS-404",
            version: "main",
            stat: "LIVE",
            cardClass: CARD_COLORS[3]
        }
    ];
}

async function fetchReposWithCache(username) {
  const cacheKey = `gh_project_library_v3_${username}`;
    const ttl = 3600000; // 1 hour TTL

    try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < ttl) return data;
        }
    } catch (e) {}

    const proxyUrl = `/api/github?endpoint=repos&username=${encodeURIComponent(username)}&limit=100`;
    let response;

    try {
        response = await fetch(proxyUrl);
    } catch (e) {}

    const isJson = response && response.ok && response.headers.get('content-type')?.includes('application/json');

    if (!isJson) {
        const headers = {};
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        if (token) {
            headers['Authorization'] = `token ${token}`;
        }
        response = await fetch(`${GITHUB_API}/users/${username}/repos?sort=updated&direction=desc&per_page=100`, { headers });
    }

    if (!response.ok) {
        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) return JSON.parse(cached).data;
        } catch (e) {}
        throw new Error('Unable to fetch GitHub project library');
    }

    const data = await response.json();
    try {
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
    } catch (e) {}

    return data;
}

function projectFromRepo(repo, index, override = {}) {
    const repoName = repo.name;
    let homepage = repo.homepage && repo.homepage.startsWith('http') ? repo.homepage : '';

    if (repoName === 'cosma-space') {
        homepage = 'https://cosma-space.vercel.app';
    }

    return {
        title: formatRepoName(repoName),
        desc: repo.description || 'Documentation available in source repository.',
        tech: repo.topics?.length ? repo.topics.slice(0, 4) : [repo.language || 'Repository'],
        language: repo.language || 'Repository',
        stars: repo.stargazers_count || 0,
        img: `/assets/projects/${repoName}.png`,
        link: homepage,
        github: repo.html_url,
        projectId: generateProjectId(repoName, index),
        version: repo.default_branch || 'main',
        stat: homepage ? 'LIVE' : 'SOURCE',
        cardClass: CARD_COLORS[index % CARD_COLORS.length],
        updatedAt: repo.updated_at,
        ...stripUndefined(override),
    };
}

/**
 * Enriches and builds the complete automated project list from the GitHub API.
 */
export async function enrichProjects() {
    try {
        const repos = await fetchReposWithCache(GITHUB_USER);
        const featuredList = featuredConfig.featured_repos || [];

        const processedRepos = repos
            .filter((repo) => !repo.fork && !repo.archived && repo.name !== GITHUB_USER)
            .sort((a, b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();

                const aFeatured = featuredList.includes(aName) || a.topics?.includes('featured') || a.topics?.includes('pinned');
                const bFeatured = featuredList.includes(bName) || b.topics?.includes('featured') || b.topics?.includes('pinned');

                if (aFeatured && !bFeatured) return -1;
                if (!aFeatured && bFeatured) return 1;

                // If both are featured, maintain config file ordering
                if (aFeatured && bFeatured) {
                    const aIndex = featuredList.indexOf(aName);
                    const bIndex = featuredList.indexOf(bName);
                    if (aIndex !== -1 && bIndex !== -1) {
                        return aIndex - bIndex;
                    }
                    if (aIndex !== -1) return -1;
                    if (bIndex !== -1) return 1;
                }

                // Default sort: most recently updated first
                return new Date(b.updated_at) - new Date(a.updated_at);
            });

        return processedRepos.map((repo, i) => projectFromRepo(repo, i));
    } catch (e) {
        console.error("Failed to fetch/enrich GitHub project archive:", e);
        return getInitialProjects();
    }
}

/** Removes undefined values so spread doesn't clobber defaults */
function stripUndefined(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

// Export a legacy/empty array to prevent breaking imports of "projects"
export const projects = [];
