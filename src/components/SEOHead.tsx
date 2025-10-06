'use client'

import Head from 'next/head'

export default function SEOHead() {
  return (
    <Head>
      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="CA-ON" />
      <meta name="geo.region" content="IN-KA" />
      <meta name="geo.placename" content="Toronto, Ontario, Canada" />
      <meta name="geo.placename" content="Bangalore, Karnataka, India" />
      <meta name="geo.position" content="43.6532;-79.3832" />
      <meta name="ICBM" content="43.6532, -79.3832" />
      
      {/* Language and Region */}
      <meta httpEquiv="content-language" content="en-CA" />
      <meta name="language" content="English" />
      <meta name="geo.country" content="CA" />
      <meta name="geo.country" content="IN" />
      
      {/* Mobile and Responsive */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Glen Pais Portfolio" />
      
      {/* Theme and Colors */}
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="msapplication-TileColor" content="#8B5CF6" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Additional Open Graph Tags */}
      <meta property="og:locale" content="en_CA" />
      <meta property="og:locale:alternate" content="en_IN" />
      <meta property="og:site_name" content="Glen Flavian Pais Portfolio" />
      <meta property="og:updated_time" content="2024-01-15T00:00:00+00:00" />
      
      {/* Twitter Card Additional Tags */}
      <meta name="twitter:domain" content="flavglen.dev" />
      <meta name="twitter:url" content="https://flavglen.dev" />
      
      {/* Business/Professional Tags */}
      <meta name="business:contact_data:country_name" content="Canada" />
      <meta name="business:contact_data:region" content="Ontario" />
      <meta name="business:contact_data:locality" content="Toronto" />
      
      {/* Skills and Expertise */}
      <meta name="keywords" content="React developer , Next.js developer Canada, TypeScript developer Toronto, AI developer Bangalore, Frontend developer Vancouver, Web developer Mumbai, Freelance developer Delhi, Remote developer Canada, Full stack developer India, Cursor AI developer, GitHub Copilot developer, V0.dev developer" />
      
      {/* Performance and Security */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="referrer" content="origin-when-cross-origin" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {/* DNS Prefetch for better performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//github.com" />
      <link rel="dns-prefetch" href="//linkedin.com" />
      <link rel="dns-prefetch" href="//twitter.com" />
    </Head>
  )
}
