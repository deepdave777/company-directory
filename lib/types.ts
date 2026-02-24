export interface Company {
  W2: string;
  'Company Logo URL': string | null;
  Website: string | null;
  'LinkedIn Company Page URL': string | null;
  'LinkedIn Followers': string | null;
  Stage: string | null;
  'Public or Private Company Type': string | null;
  Ticker: string | null;
  'Revenue Range': string | null;
  'Employee Range': string | null;
  'Business Description': string | null;
  'SIC Code': number | null;
  'NAICS Code': number | null;
  'Company Industry': string | null;
  HQ: string | null;
  'Company Address': string | null;
  'Countries Operational': string[] | null;
  'Founding Year': number | null;
  Technologies: string[] | null;
  'Latest News': NewsItem[] | null;
  'Key Focus Areas': string[] | null;
  'Affiliated Companies': AffiliatedCompany[] | null;
  Competitors: Competitor[] | null;
  Leadership: string | null;
  'Number of Funding Rounds': number | null;
  'Total Funding': number | null;
  'Current Funding Stage': string | null;
  'Latest Funding Date': string | null;
  'Funding Stages': FundingStage[] | null;
  'Employee Headcount': number | null;
  'Employee Headcount by Country': HeadcountByCountry[] | null;
  'Employee HeadCount by Month': HeadcountByMonth[] | null;
  'Youtube Mentions': YoutubeVideo[] | null;
  'Reddit Mentions': RedditPost[] | null;
  FAQs: FAQ[] | null;
  'Funding Rounds': FundingRound[] | null;
  'Pricing Model': PricingModel[] | null;
  'News AI Summary': string | null;
  'YouTube AI Summary': string | null;
  'Reddit AI Summary': string | null;
  'Last Updated': string | null;
}

export interface NewsItem {
  title: string;
  date: string;
  url?: string;
  source?: string;
}

export interface AffiliatedCompany {
  name: string;
  url?: string;
  website?: string;
}

export interface Competitor {
  name: string;
  logo?: string;
  website?: string;
}

export interface FundingStage {
  stage: string;
  amount?: number;
  date?: string;
  investors?: string[];
}

export interface FundingRound {
  'Round Type'?: string;
  round_type?: string;
  type?: string;
  Amount?: number | string;
  amount?: number | string;
  Date?: string;
  date?: string;
  Investors?: string | string[];
  investors?: string | string[];
}

export interface HeadcountByCountry {
  country: string;
  count: number;
  headcount?: number;
  [key: string]: unknown;
}

export interface HeadcountByMonth {
  month: string;
  count: number;
  headcount?: number;
  date?: string;
  [key: string]: unknown;
}

export interface YoutubeVideo {
  title: string;
  thumbnail?: string;
  views?: number | string;
  date?: string;
  url?: string;
  channel?: string;
  [key: string]: unknown;
}

export interface RedditPost {
  title: string;
  subreddit?: string;
  url?: string;
  date?: string;
  score?: number;
  [key: string]: unknown;
}

export interface FAQ {
  question: string;
  answer: string;
  [key: string]: unknown;
}

export interface PricingModel {
  model?: string;
  type?: string;
  name?: string;
}
