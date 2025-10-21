import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for managing document head metadata
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.canonicalUrl - Canonical URL for the page
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.ogType - Open Graph type (default: website)
 * @param {Array} props.keywords - Keywords for meta keywords tag
 * @param {Object} props.structuredData - JSON-LD structured data
 */
const SEO = ({
    title,
    description,
    canonicalUrl,
    ogImage = '/images/web-app-manifest-512x512.png',
    ogType = 'website',
    keywords = [],
    structuredData = null,
}) => {
    // Default site name to append to titles
    const siteName = 'Baton Rouge GA';

    // Format the title with site name
    const formattedTitle = title ? `${title} | ${siteName}` : siteName;

    // Base URL for canonical and OG URLs
    const baseUrl = 'https://batonrougega.org';

    // Format canonical URL
    const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;

    // Format OG image URL
    const fullOgImageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{formattedTitle}</title>
            {description && <meta name="description" content={description} />}
            {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

            {/* Canonical URL */}
            <link rel="canonical" href={fullCanonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={formattedTitle} />
            {description && <meta property="og:description" content={description} />}
            <meta property="og:url" content={fullCanonicalUrl} />
            <meta property="og:image" content={fullOgImageUrl} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={formattedTitle} />
            {description && <meta name="twitter:description" content={description} />}
            <meta name="twitter:image" content={fullOgImageUrl} />

            {/* Structured Data / JSON-LD */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;