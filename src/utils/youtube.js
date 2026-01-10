// YouTube API utility with caching and error handling
const CACHE_KEY = 'youtube_videos_cache_v2';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export const fetchYouTubeVideos = async (channelId, apiKey, maxResults = 6) => {
    try {
        // Check cache first
        const cached = getFromCache();
        if (cached) {
            return cached;
        }

        // Step 1: Get recent uploads (fetch extra to account for filtering)
        const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults * 3}&type=video`
        );

        if (!searchResponse.ok) {
            throw new Error(`YouTube API error: ${searchResponse.status}`);
        }

        const searchData = await searchResponse.json();
        const videoIds = searchData.items.map(item => item.id.videoId).join(',');

        // Step 2: Get detailed video info including statistics and contentDetails
        const detailsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=snippet,contentDetails,statistics`
        );

        if (!detailsResponse.ok) {
            throw new Error('Failed to fetch video details');
        }

        const detailsData = await detailsResponse.json();

        // Step 3: Filter out promotional Shorts by title pattern
        const regularVideos = detailsData.items.filter(item => {
            const title = item.snippet.title.toLowerCase();

            // Detect promotional Shorts: "Stream X on all major streaming platforms"
            const isPromotionalShort = title.includes('stream ') &&
                title.includes('on all major streaming platforms');

            // KEEP videos that are NOT promotional Shorts
            return !isPromotionalShort;
        });

        // Step 4: Take only the requested amount
        const limitedVideos = regularVideos.slice(0, maxResults);

        // Step 5: Transform to our format
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

        // Cache the results
        saveToCache(videos);

        return videos;
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return null; // Will trigger fallback
    }
};

// Cache helpers
const getFromCache = () => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;

        if (age < CACHE_DURATION) {
            return data;
        }

        // Cache expired
        localStorage.removeItem(CACHE_KEY);
        return null;
    } catch (error) {
        console.error('Cache read error:', error);
        return null;
    }
};

const saveToCache = (data) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.error('Cache write error:', error);
    }
};

// Format helpers
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
};

const formatViews = (count) => {
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
    return `${num} views`;
};

// Clear cache manually if needed
export const clearYouTubeCache = () => {
    localStorage.removeItem(CACHE_KEY);
};
