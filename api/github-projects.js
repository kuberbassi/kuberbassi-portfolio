const GITHUB_REPOS_URL = 'https://api.github.com/users/kuberbassi/repos?sort=updated&per_page=100';

export default async function handler(_request, response) {
  try {
    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'kuberbassi-portfolio',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const githubResponse = await fetch(GITHUB_REPOS_URL, { headers });
    const body = await githubResponse.json();

    response.setHeader(
      'Cache-Control',
      githubResponse.ok
        ? 'public, s-maxage=900, stale-while-revalidate=3600'
        : 'no-store',
    );
    response.status(githubResponse.status).json(body);
  } catch {
    response.status(502).json({ message: 'Unable to reach GitHub.' });
  }
}
