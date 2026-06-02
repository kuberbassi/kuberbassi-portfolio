import { useEffect } from 'react';

const SEO = ({
  title = "KUBER BASSI | Guitarist & Producer",
  description = "Rock guitarist, music producer & sound designer crafting high-energy instrumentals. Stream on Spotify, Apple Music & YouTube. Unique blend of technical mastery and creative expression.",
  keywords = "Kuber Bassi, rock guitar, instrumental music, music producer, sound designer, guitarist, electric guitar, music production",
  ogType = "profile",
  ogImage = "https://kuberbassi.com/og-image.png",
  twitterCard = "summary_large_image",
  url = "https://kuberbassi.com"
}) => {
  useEffect(() => {
    // Update Title
    document.title = title;

    // Helper to update/create meta tag
    const updateMeta = (attrName, attrVal, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Update Meta Tags
    updateMeta('name', 'description', description);
    updateMeta('name', 'keywords', keywords);
    updateMeta('name', 'author', 'Kuber Bassi');
    updateMeta('name', 'robots', 'index, follow');

    updateMeta('property', 'og:type', ogType);
    updateMeta('property', 'og:url', url);
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:image', ogImage);

    updateMeta('property', 'twitter:card', twitterCard);
    updateMeta('property', 'twitter:url', url);
    updateMeta('property', 'twitter:title', title);
    updateMeta('property', 'twitter:description', description);
    updateMeta('property', 'twitter:image', ogImage);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

  }, [title, description, keywords, ogType, ogImage, twitterCard, url]);

  return null; // Side effects only
};

export default SEO;
