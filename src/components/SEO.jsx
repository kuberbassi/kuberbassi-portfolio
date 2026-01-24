import React from 'react';

const SEO = ({
  title = "KUβER βΔSSI | Guitarist & Producer",
  description = "Rock guitarist, music producer & sound designer crafting high-energy instrumentals. Stream on Spotify, Apple Music & YouTube. Unique blend of technical mastery and creative expression.",
  keywords = "Kuber Bassi, KUβER βΔSSI, KUBER BASSI, KuberB, rock guitar, instrumental music, music producer, sound designer, guitarist, electric guitar, music production",
  ogType = "profile",
  ogImage = "https://kuberbassi.com/og-image.jpg",
  twitterCard = "summary_large_image",
  url = "https://kuberbassi.com"
}) => {
  return (
    <>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Kuber Bassi" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {ogType === "profile" && <meta property="profile:username" content="KuberB" />}

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
    </>
  );
};

export default SEO;
