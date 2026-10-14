import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://talkinexx.com';
const BRAND_NAME = 'Talkinexx';
const DEFAULT_IMAGE = `${BASE_URL}/assets/img/logo.png`;

export const ROUTE_SEO_DATA = {
  '/': {
    title: 'Talkinexx | WhatsApp Cloud Automation & AI Chatbot Platform',
    description: 'Scale conversations with Talkinexx - the leading WhatsApp Cloud Automation and AI Chatbot SaaS. Official Meta API, high-speed broadcasts & 24/7 AI support.',
    keywords: 'WhatsApp Cloud API, WhatsApp Automation, WhatsApp AI Chatbot, WhatsApp Broadcast, Meta Business API, WhatsApp CRM, Customer Support AI, Talkinexx',
    schemaType: 'SoftwareApplication',
  },
  '/whatsapp-campaigns': {
    title: 'WhatsApp Broadcast Campaigns | High-Speed Bulk Messaging | Talkinexx',
    description: 'Broadcast WhatsApp campaigns with 98% open rates and zero ban risks. Reach thousands of opted-in customers instantly using official Meta Cloud API.',
    keywords: 'WhatsApp Broadcast, Bulk WhatsApp Marketing, WhatsApp Campaigns, WhatsApp Marketing Software, High Speed WhatsApp Broadcast, Meta Verified WhatsApp Marketing',
    schemaType: 'Service',
  },
  '/automated-messaging': {
    title: 'Automated WhatsApp Messaging & Drip Workflows | Talkinexx',
    description: 'Build powerful automated WhatsApp drip campaigns, order updates, booking confirmations, and abandoned cart recovery workflows with zero code.',
    keywords: 'Automated WhatsApp Messaging, WhatsApp Drip Campaigns, WhatsApp Autoresponder, Abandoned Cart WhatsApp, WhatsApp Notification Workflows',
    schemaType: 'Service',
  },
  '/whatsapp-ai-copilot': {
    title: 'WhatsApp AI Copilot & Smart Customer Support | Talkinexx',
    description: 'Empower your support team with WhatsApp AI Copilot. Resolve 80% of customer queries instantly with contextual generative AI and live agent handoff.',
    keywords: 'WhatsApp AI Copilot, AI Customer Support, WhatsApp Chatbot AI, Conversational AI for WhatsApp, Smart Customer Service Automation',
    schemaType: 'Service',
  },
  '/contact-list-retargeting': {
    title: 'WhatsApp Contact List Retargeting & CRM Segmentation | Talkinexx',
    description: 'Segment customer lists, tag leads, and trigger hyper-targeted WhatsApp re-engagement campaigns that convert cold contacts into repeat buyers.',
    keywords: 'WhatsApp Retargeting, WhatsApp CRM, Contact List Segmentation, WhatsApp Audience Targeting, WhatsApp Customer Retention',
    schemaType: 'Service',
  },
  '/whatsapp-analytics': {
    title: 'Real-Time WhatsApp Analytics & Performance Reports | Talkinexx',
    description: 'Track message delivery, read rates, click-through rates, response times, and campaign ROI with enterprise-grade WhatsApp analytics and live metrics.',
    keywords: 'WhatsApp Analytics, WhatsApp Campaign Tracking, Message Delivery Rate, WhatsApp Read Receipts, Customer Engagement Metrics',
    schemaType: 'Service',
  },
  '/pricing': {
    title: 'Talkinexx Pricing Plans | Transparent WhatsApp Cloud API Pricing',
    description: 'Flexible, transparent pricing for growing businesses and enterprises. Get unlimited contacts, AI copilots, broadcast automation, and dedicated support.',
    keywords: 'WhatsApp API Pricing, Talkinexx Plans, WhatsApp Automation Cost, Enterprise WhatsApp Cloud API, AI Chatbot Pricing',
    schemaType: 'Product',
  },
  '/contact': {
    title: 'Contact Talkinexx | Book a Live Demo & Talk to Automation Experts',
    description: 'Have questions or need a tailored enterprise solution? Contact the Talkinexx team today or schedule a 1-on-1 personalized live demonstration.',
    keywords: 'Contact Talkinexx, Book WhatsApp Automation Demo, Talkinexx Support, WhatsApp Business Consultation, Enterprise WhatsApp Solutions',
    schemaType: 'ContactPage',
  },
  '/privacy': {
    title: 'Privacy Policy | Talkinexx Data Security & GDPR Compliance',
    description: 'Review Talkinexx privacy practices, data handling policies, encryption standards, and GDPR compliance commitments for WhatsApp Business API users.',
    keywords: 'Talkinexx Privacy Policy, Data Protection, GDPR Compliance, WhatsApp API Security, User Data Rights',
    schemaType: 'WebPage',
  },
  '/terms': {
    title: 'Terms of Service | Talkinexx User & Service Agreement',
    description: 'Read the legal terms of service, acceptable use guidelines, service level agreements, and subscription policies governing Talkinexx platform use.',
    keywords: 'Talkinexx Terms of Service, User Agreement, SLA, WhatsApp API Terms, Platform Acceptable Use Policy',
    schemaType: 'WebPage',
  },
  '/terms-and-conditions': {
    title: 'Terms of Service | Talkinexx User & Service Agreement',
    description: 'Read the legal terms of service, acceptable use guidelines, service level agreements, and subscription policies governing Talkinexx platform use.',
    keywords: 'Talkinexx Terms of Service, User Agreement, SLA, WhatsApp API Terms, Platform Acceptable Use Policy',
    schemaType: 'WebPage',
  },
  '/login': {
    title: 'Login to Talkinexx | Access Your WhatsApp Automation Dashboard',
    description: 'Sign in to your Talkinexx dashboard to manage WhatsApp campaigns, monitor AI chatbots, track live analytics, and communicate with customers.',
    keywords: 'Talkinexx Login, WhatsApp Dashboard, Sign In Talkinexx, Manage WhatsApp Campaigns',
    schemaType: 'WebPage',
  },
  '/signup': {
    title: 'Get Started Free with Talkinexx | Create Your WhatsApp Automation Account',
    description: 'Sign up for Talkinexx today and launch your first WhatsApp broadcast or AI chatbot in minutes. No credit card required to start.',
    keywords: 'Talkinexx Sign Up, Try WhatsApp Automation, Free WhatsApp Bot Account, Start WhatsApp Cloud API',
    schemaType: 'WebPage',
  },
};

const updateOrCreateMeta = (name, content, isProperty = false) => {
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    if (isProperty) {
      element.setAttribute('property', name);
    } else {
      element.setAttribute('name', name);
    }
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const updateCanonicalLink = (url) => {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
};

const updateJsonLd = (schemaData) => {
  let script = document.getElementById('talkinexx-dynamic-jsonld');
  if (!script) {
    script = document.createElement('script');
    script.id = 'talkinexx-dynamic-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaData, null, 2);
};

const SEO = ({ customSeo }) => {
  const location = useLocation();

  useEffect(() => {
    // Scroll window smoothly to top on route change for best UX & crawler readability
    window.scrollTo(0, 0);

    const pathname = location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    const config = customSeo || ROUTE_SEO_DATA[pathname] || ROUTE_SEO_DATA['/'];

    const fullUrl = `${BASE_URL}${pathname === '/' ? '' : pathname}`;
    const pageTitle = config.title || ROUTE_SEO_DATA['/'].title;
    const pageDesc = config.description || ROUTE_SEO_DATA['/'].description;
    const pageKeywords = config.keywords || ROUTE_SEO_DATA['/'].keywords;
    const isNoIndex = config.noIndex || false;

    // 1. Update Document Title
    document.title = pageTitle;

    // 2. Standard Meta Tags
    updateOrCreateMeta('description', pageDesc);
    updateOrCreateMeta('keywords', pageKeywords);
    updateOrCreateMeta('author', BRAND_NAME);
    updateOrCreateMeta(
      'robots',
      isNoIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    updateOrCreateMeta('theme-color', '#0B1520');

    // 3. Canonical Tag
    updateCanonicalLink(fullUrl);

    // 4. OpenGraph Tags
    updateOrCreateMeta('og:locale', 'en_US', true);
    updateOrCreateMeta('og:type', config.schemaType === 'Article' ? 'article' : 'website', true);
    updateOrCreateMeta('og:site_name', BRAND_NAME, true);
    updateOrCreateMeta('og:title', pageTitle, true);
    updateOrCreateMeta('og:description', pageDesc, true);
    updateOrCreateMeta('og:url', fullUrl, true);
    updateOrCreateMeta('og:image', DEFAULT_IMAGE, true);
    updateOrCreateMeta('og:image:alt', `${BRAND_NAME} - WhatsApp Cloud Automation Platform`, true);

    // 5. Twitter Card Tags
    updateOrCreateMeta('twitter:card', 'summary_large_image');
    updateOrCreateMeta('twitter:site', '@Talkinexx');
    updateOrCreateMeta('twitter:creator', '@Talkinexx');
    updateOrCreateMeta('twitter:title', pageTitle);
    updateOrCreateMeta('twitter:description', pageDesc);
    updateOrCreateMeta('twitter:image', DEFAULT_IMAGE);

    // 6. Structured Data (Schema.org JSON-LD)
    const pageSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          url: BASE_URL,
          name: BRAND_NAME,
          description: 'Official WhatsApp Cloud API & AI Chatbot Automation SaaS',
          publisher: {
            '@id': `${BASE_URL}/#organization`,
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${BASE_URL}/?s={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': 'Organization',
          '@id': `${BASE_URL}/#organization`,
          name: BRAND_NAME,
          url: BASE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/assets/img/logo.png`,
            width: '600',
            height: '180',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-800-TALKINEXX',
            contactType: 'customer service',
            areaServed: 'Worldwide',
            availableLanguage: ['en', 'es', 'pt', 'ar'],
          },
          sameAs: [
            'https://twitter.com/Talkinexx',
            'https://linkedin.com/company/talkinexx',
            'https://facebook.com/talkinexx',
          ],
        },
        {
          '@type': config.schemaType || 'WebPage',
          '@id': `${fullUrl}#webpage`,
          url: fullUrl,
          name: pageTitle,
          description: pageDesc,
          isPartOf: {
            '@id': `${BASE_URL}/#website`,
          },
          inLanguage: 'en-US',
        },
        ...(pathname === '/' || pathname === '/pricing'
          ? [
              {
                '@type': 'SoftwareApplication',
                name: 'Talkinexx WhatsApp Cloud Automation',
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Cloud, Web browser',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                  priceValidUntil: '2028-12-31',
                  availability: 'https://schema.org/InStock',
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.9',
                  ratingCount: '1480',
                  bestRating: '5',
                  worstRating: '1',
                },
              },
            ]
          : []),
      ],
    };

    updateJsonLd(pageSchema);
  }, [location.pathname, customSeo]);

  return null;
};

export default SEO;
