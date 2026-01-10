import { useState, useEffect } from 'react';
import { fetchYouTubeVideos } from '../utils/youtube';

// Fallback videos - used if API fails or no API key
const FALLBACK_VIDEOS = [
    {
        id: "jBvW6Q9t0Gk",
        title: "Rock Band | Farewell 2024 | New Era Public School",
        thumbnail: "https://img.youtube.com/vi/jBvW6Q9t0Gk/maxresdefault.jpg",
        views: "12K views",
        viewCount: "12543",
        date: "Dec 2024"
    },
    {
        id: "YdQo4DVrPfg",
        title: "Chhaap Tilak | Dillagi | Amity International School | Band Cover",
        thumbnail: "https://img.youtube.com/vi/YdQo4DVrPfg/maxresdefault.jpg",
        views: "8.5K views",
        viewCount: "8521",
        date: "Nov 2024"
    }
];

const useYouTubeVideos = (maxResults = 6) => {
    const [videos, setVideos] = useState(FALLBACK_VIDEOS);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadVideos = async () => {
            const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
            const channelId = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

            // If no API key, use fallback
            if (!apiKey || !channelId) {
                setVideos(FALLBACK_VIDEOS);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const fetchedVideos = await fetchYouTubeVideos(channelId, apiKey, maxResults);

                if (fetchedVideos && fetchedVideos.length > 0) {
                    setVideos(fetchedVideos);
                } else {
                    setVideos(FALLBACK_VIDEOS);
                    setError('Failed to fetch videos. Using cached data.');
                }
            } catch (err) {
                console.error('Error loading YouTube videos:', err);
                setError(err.message);
                setVideos(FALLBACK_VIDEOS);
            } finally {
                setLoading(false);
            }
        };

        loadVideos();
    }, [maxResults]);

    return { videos, loading, error };
};

export default useYouTubeVideos;
