export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const apiKey = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY;
    const channelId = req.query.channelId || process.env.VITE_YOUTUBE_CHANNEL_ID || 'UCcw12FyihnsK7TEHFBVHApw';
    const maxResults = parseInt(req.query.maxResults) || 6;

    if (!apiKey) {
        return res.status(500).json({ error: 'YouTube API Key is not configured' });
    }

    try {
        // Step 1: Fetch recent videos
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults * 3}&type=video`;
        const searchResponse = await fetch(searchUrl);

        if (!searchResponse.ok) {
            const errBody = await searchResponse.text();
            console.error('YouTube Search API failed:', errBody);
            throw new Error(`YouTube API returned status ${searchResponse.status}`);
        }

        const searchData = await searchResponse.json();
        const videoIds = searchData.items.map(item => item.id.videoId).filter(Boolean).join(',');

        if (!videoIds) {
            return res.status(200).json([]);
        }

        // Step 2: Fetch detailed statistics
        const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=snippet,contentDetails,statistics`;
        const detailsResponse = await fetch(detailsUrl);

        if (!detailsResponse.ok) {
            throw new Error(`YouTube Details API returned status ${detailsResponse.status}`);
        }

        const detailsData = await detailsResponse.json();

        // Step 3: Filter promotional shorts
        const regularVideos = detailsData.items.filter(item => {
            const title = item.snippet.title.toLowerCase();
            const isPromotionalShort = title.includes('stream ') && title.includes('on all major streaming platforms');
            return !isPromotionalShort;
        });

        const limitedVideos = regularVideos.slice(0, maxResults);

        // Transform
        const videos = limitedVideos.map(item => ({
            id: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.maxresdefault?.url ||
                       item.snippet.thumbnails.high?.url ||
                       item.snippet.thumbnails.medium?.url,
            date: formatDate(item.snippet.publishedAt),
            views: formatViews(item.statistics.viewCount),
            viewCount: item.statistics.viewCount
        }));

        // Set Edge Cache: Cache for 1 hour at edge, 1 hour browser
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600');
        return res.status(200).json(videos);
    } catch (error) {
        console.error('Serverless YouTube Handler Error:', error);
        return res.status(500).json({ error: 'Failed to fetch YouTube videos', details: error.message });
    }
}

// Helpers inside the function
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
}

function formatViews(count) {
    const num = parseInt(count);
    if (isNaN(num)) return '0 views';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
    return `${num} views`;
}
