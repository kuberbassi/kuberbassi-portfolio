export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { endpoint, username, slug, limit } = req.query;
    const githubToken = process.env.GITHUB_TOKEN;

    const headers = {};
    if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
    }
    headers['User-Agent'] = 'kuberbassi-portfolio';

    try {
        let targetUrl = '';
        if (endpoint === 'profile') {
            if (!username) return res.status(400).json({ error: 'Username is required' });
            targetUrl = `https://api.github.com/users/${username}`;
        } else if (endpoint === 'repos') {
            if (!username) return res.status(400).json({ error: 'Username is required' });
            const perPage = Math.min(Math.max(parseInt(limit || '100', 10) || 100, 1), 100);
            targetUrl = `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=${perPage}`;
        } else if (endpoint === 'events') {
            if (!username) return res.status(400).json({ error: 'Username is required' });
            targetUrl = `https://api.github.com/users/${username}/events/public?per_page=100`;
        } else if (endpoint === 'org-profile') {
            if (!slug) return res.status(400).json({ error: 'Slug is required' });
            targetUrl = `https://api.github.com/orgs/${slug}`;
        } else if (endpoint === 'org-repos') {
            if (!slug) return res.status(400).json({ error: 'Slug is required' });
            targetUrl = `https://api.github.com/orgs/${slug}/repos?sort=updated&direction=desc&per_page=30`;
        } else {
            return res.status(400).json({ error: 'Invalid endpoint specified' });
        }

        const response = await fetch(targetUrl, { headers });
        if (!response.ok) {
            console.error(`GitHub API proxy error for ${targetUrl}: status ${response.status}`);
            return res.status(response.status).json({ error: `GitHub API proxy failed with status ${response.status}` });
        }

        const data = await response.json();
        
        // Cache for 1 hour at edge, 1 hour browser
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600');
        return res.status(200).json(data);
    } catch (error) {
        console.error('Serverless GitHub Handler Error:', error);
        return res.status(500).json({ error: 'Failed to proxy GitHub request', details: error.message });
    }
}
