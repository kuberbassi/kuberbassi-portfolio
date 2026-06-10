import { useEffect } from 'react';

const SEO = ({
  title = "Kuber Bassi | Software Architect & Music Producer",
  description = "Portfolio of Kuber Bassi, a Software Architect & Music Producer crafting high-performance full-stack applications, automation systems, and original instrumentals.",
  keywords = "Kuber Bassi, Software Architect, Software Engineer, Music Producer, Full-Stack Developer, Systems Engineering, UI/UX, Web Dev, React, Node, Guitarist, Artist",
  ogType = "website",
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

    // Determine if this exact page should be indexed
    // Only index when host is exactly 'kuberbassi.com' and path is root '/'
    const isHomepage = window.location.pathname === '/' || window.location.pathname === '';
    const isMainDomain = window.location.hostname === 'kuberbassi.com';
    const shouldIndex = isHomepage && isMainDomain;
    const robotsValue = shouldIndex ? 'index, follow' : 'noindex, nofollow';

    // Update Meta Tags
    updateMeta('name', 'description', description);
    updateMeta('name', 'keywords', keywords);
    updateMeta('name', 'author', 'Kuber Bassi');
    updateMeta('name', 'robots', robotsValue);

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
    // Always keep canonical pointing to the main homepage to consolidate authority
    canonical.setAttribute('href', 'https://kuberbassi.com/');

  }, [title, description, keywords, ogType, ogImage, twitterCard, url]);

  return null; // Side effects only
};

export default SEO;
