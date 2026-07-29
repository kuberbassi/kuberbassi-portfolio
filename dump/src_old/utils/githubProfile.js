const GITHUB_API = 'https://api.github.com';

async function fetchWithCache(url, cacheKey, ttl = 3600000) { // 1 hour TTL
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      // Return cached if within TTL
      if (Date.now() - timestamp < ttl) {
        return data;
      }
    }
  } catch (e) {
    // Ignore localStorage errors
  }

  // Determine proxy URL or fallback to original URL
  let fetchUrl = url;
  if (url.startsWith(GITHUB_API)) {
    const path = url.replace(GITHUB_API, '');
    let endpoint = '';
    let username = '';
    let slug = '';

    // Parse path to match endpoint types
    if (path.startsWith('/users/') && path.includes('/repos')) {
      endpoint = 'repos';
      username = path.split('/')[2];
    } else if (path.startsWith('/users/') && path.includes('/events')) {
      endpoint = 'events';
      username = path.split('/')[2];
    } else if (path.startsWith('/users/')) {
      endpoint = 'profile';
      username = path.split('/')[2];
    } else if (path.startsWith('/orgs/') && path.includes('/repos')) {
      endpoint = 'org-repos';
      slug = path.split('/')[2];
    } else if (path.startsWith('/orgs/')) {
      endpoint = 'org-profile';
      slug = path.split('/')[2];
    }

    if (endpoint) {
      const proxyUrl = `/api/github?endpoint=${endpoint}${username ? `&username=${encodeURIComponent(username)}` : ''}${slug ? `&slug=${encodeURIComponent(slug)}` : ''}`;
      try {
        const proxyResponse = await fetch(proxyUrl);
        const isJson = proxyResponse.ok && proxyResponse.headers.get('content-type')?.includes('application/json');
        if (isJson) {
          const data = await proxyResponse.json();
          try {
            localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
          } catch (e) {}
          return data;
        }
        console.warn(`Serverless GitHub proxy failed, falling back to direct API call for ${url}`);
      } catch (e) {
        console.warn(`Failed to call serverless GitHub proxy, falling back to direct API call:`, e);
      }
    }
  }

  const headers = {};
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const response = await fetch(fetchUrl, { headers });
  if (!response.ok) {
    // If rate limited, try to return stale cache as a last resort
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached).data;
    } catch (e) {}
    throw new Error(`GitHub request failed: ${response.status}`);
  }
  
  const data = await response.json();
  
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
  } catch (e) {
    // Ignore localStorage errors
  }
  
  return data;
}

export async function fetchGitHubProfile(username) {
  return fetchWithCache(`${GITHUB_API}/users/${username}`, `gh_profile_${username}`);
}

export async function fetchFeaturedRepos(username, limit = 6) {
  const repos = await fetchWithCache(
    `${GITHUB_API}/users/${username}/repos?sort=updated&direction=desc&per_page=20`,
    `gh_repos_${username}`
  );

  return repos
    .filter((repo) => !repo.fork && !repo.archived)
    .sort((a, b) => {
      const aScore = (a.stargazers_count || 0) * 3 + (a.forks_count || 0) * 2;
      const bScore = (b.stargazers_count || 0) * 3 + (b.forks_count || 0) * 2;
      return bScore - aScore || new Date(b.updated_at) - new Date(a.updated_at);
    })
    .slice(0, limit);
}

export async function fetchGitHubOrganization(slug, limit = 6) {
  const [profile, repos] = await Promise.all([
    fetchWithCache(`${GITHUB_API}/orgs/${slug}`, `gh_org_profile_${slug}`),
    fetchWithCache(`${GITHUB_API}/orgs/${slug}/repos?sort=updated&direction=desc&per_page=30`, `gh_org_repos_${slug}`)
  ]);

  const activeRepos = repos
    .filter((repo) => !repo.archived)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  return {
    slug,
    profile,
    repos: activeRepos.slice(0, limit),
    allRepos: activeRepos,
  };
}

export async function fetchGitHubEvents(username) {
  return fetchWithCache(`${GITHUB_API}/users/${username}/events/public?per_page=100`, `gh_events_${username}`);
}

export function buildGitHubAnalytics({ repos = [], orgs = [], events = [] }) {
  const orgRepos = orgs.flatMap((org) => org.allRepos || org.repos || []);
  const allRepos = [...repos, ...orgRepos];
  const languageCounts = new Map();
  const eventCounts = new Map();
  const thirtyDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;

  allRepos.forEach((repo) => {
    if (repo.language) {
      languageCounts.set(repo.language, (languageCounts.get(repo.language) || 0) + 1);
    }
  });

  events.forEach((event) => {
    eventCounts.set(event.type, (eventCounts.get(event.type) || 0) + 1);
  });

  const topLanguages = [...languageCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([language, count]) => ({ language, count }));

  const topEvents = [...eventCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([type, count]) => ({ type: type.replace('Event', ''), count }));

  return {
    repoCount: allRepos.length,
    totalStars: allRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
    totalForks: allRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
    recentlyUpdated: allRepos.filter((repo) => new Date(repo.updated_at).getTime() >= thirtyDaysAgo).length,
    topLanguages,
    topEvents,
    recentEvents: events.slice(0, 5),
  };
}

export function formatDate(dateString) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}
