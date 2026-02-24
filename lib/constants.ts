// Application constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 24,
  MAX_PAGE_SIZE: 100,
  SITEMAP_COMPANIES_PER_PAGE: 50000,
} as const;

export const FILTERS = {
  STAGES: [
    'All Stages', 
    'Seed', 
    'Series A', 
    'Series B', 
    'Series C', 
    'Series D', 
    'Series E', 
    'Series F', 
    'Corporate', 
    'IPO', 
    'Private Equity'
  ] as const,
  TYPES: ['All Types', 'Public', 'Private'] as const,
  SIZES: [
    'All Sizes', 
    '1-10', 
    '11-50', 
    '51-200', 
    '201-500', 
    '501-1000', 
    '1001-5000', 
    '5001-10000', 
    '10001+'
  ] as const,
  REVENUES: [
    'All Revenue', 
    '<1M', 
    '1M-10M', 
    '10M-50M', 
    '50M-100M', 
    '100M-500M', 
    '500M-1B', 
    '1B-10B', 
    '10B+'
  ] as const,
} as const;

export const DELAYS = {
  SEARCH_DEBOUNCE: 300,
  ANIMATION_DURATION: 200,
} as const;

export const BRAND = {
  PRIMARY_COLOR: '#ff4f12',
  SITE_NAME: 'Floqer Directory',
} as const;
