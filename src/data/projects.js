/**
 * SELF-MAINTAINING PROJECT CONFIG
 * ================================
 * Just add a new project with `github` + `link` URLs.
 * Everything else (title, description, tech, language, stats)
 * is auto-fetched from the GitHub API at runtime.
 *
 * Optional overrides: title, desc, img, projectId, version, stat, cardClass
 */

const CARD_COLORS = ['v4-card-teal', 'v4-card-blue', 'v4-card-red', 'v4-card-green', 'v4-card-red'];

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
 * Returns instant defaults for all projects (no API call needed).
 * Use this for the initial render while enrichProjects() loads.
 */
export function getInitialProjects(minimalProjects) {
    return minimalProjects.map((proj, i) => {
        const repoName = proj.github.replace('https://github.com/', '').split('/').pop();
        return {
            title: proj.title || formatRepoName(repoName),
            desc: proj.desc || 'Loading from GitHub...',
            tech: proj.tech || [],
            language: proj.language || 'JavaScript',
            stars: 0,
            img: proj.img || `/dev-portfolio/images/projects/${repoName}.png`,
            link: proj.link || '',
            github: proj.github,
            projectId: proj.projectId || generateProjectId(repoName, i),
            version: proj.version || 'LATEST',
            stat: proj.stat || (proj.link ? 'LIVE' : 'DEV'),
            cardClass: proj.cardClass || CARD_COLORS[i % CARD_COLORS.length],
        };
    });
}

/**
 * Enriches a minimal project config with data from the GitHub API.
 * Falls back gracefully if the API call fails.
 */
export async function enrichProjects(minimalProjects) {
    const enriched = await Promise.all(minimalProjects.map(async (proj, i) => {
        const repoUrl = proj.github;
        const repoBase = repoUrl.replace('https://github.com/', '');
        const repoName = repoBase.split('/').pop();

        // Defaults (no API needed)
        const defaults = {
            title: formatRepoName(repoName),
            desc: 'Project details loading...',
            tech: [],
            language: 'JavaScript',
            stars: 0,
            img: `/dev-portfolio/images/projects/${repoName}.png`,
            link: proj.link || '',
            github: proj.github,
            projectId: generateProjectId(repoName, i),
            version: 'LATEST',
            stat: proj.link ? 'LIVE' : 'DEV',
            cardClass: CARD_COLORS[i % CARD_COLORS.length],
        };

        try {
            const res = await fetch(`https://api.github.com/repos/${repoBase}`);
            if (!res.ok) return { ...defaults, ...stripUndefined(proj) };
            const data = await res.json();

            return {
                ...defaults,
                title: formatRepoName(repoName),
                desc: data.description || defaults.desc,
                tech: data.topics?.length ? data.topics.slice(0, 4) : [data.language || 'System'],
                language: data.language || defaults.language,
                stars: data.stargazers_count || 0,
                // Override with any user-specified values
                ...stripUndefined(proj),
            };
        } catch {
            return { ...defaults, ...stripUndefined(proj) };
        }
    }));

    return enriched;
}

/** Removes undefined values so spread doesn't clobber defaults */
function stripUndefined(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

/**
 * MINIMAL PROJECT LIST
 * ====================
 * To add a new project: just add { github, link }.
 * To override auto-derived fields: add title, desc, img, etc.
 */
export const projects = [
    {
        github: "https://github.com/kuberbassi/adhikar-ai",
        link: "https://adhikar.ai.kuberbassi.com/",
    },
    {
        github: "https://github.com/kuberbassi/mcd-hrms",
        link: "https://mcd-hrms.web.app",
        title: "MCD HRMS",          // override: acronym formatting
    },
    {
        github: "https://github.com/kuberbassi/acadhub",
        link: "https://acadhub.kuberbassi.com",
        title: "AcadHub",           // override: specific casing
    },
    {
        github: "https://github.com/kuberbassi/indiaonroaming",
        link: "https://indiaonroaming.com",
        title: "IndiaOnRoaming",    // override: brand name
    },
    {
        github: "https://github.com/kuberbassi/ytmusic-scrobbler",
        link: "https://ytscrobbler.kuberbassi.com/",
        title: "YT Music Scrobbler", // override: readable name
    },
];
