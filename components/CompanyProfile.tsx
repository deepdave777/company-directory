'use client';

import { Company } from '@/lib/types';
import { parseJsonField } from '@/lib/utils';
import BasicInfoSection from './sections/BasicInfoSection';
import AboutSection from './sections/AboutSection';
import LatestNewsSection from './sections/LatestNewsSection';
import TechnologiesSection from './sections/TechnologiesSection';
import KeyFocusAreasSection from './sections/KeyFocusAreasSection';
import CompetitorsSection from './sections/CompetitorsSection';
import AffiliatedCompaniesSection from './sections/AffiliatedCompaniesSection';
import LeadershipSection from './sections/LeadershipSection';
import FundingSection from './sections/FundingSection';
import EmployeeInsightsSection from './sections/EmployeeInsightsSection';
import SocialMediaSection from './sections/SocialMediaSection';
import FAQsSection from './sections/FAQsSection';

interface Props {
  company: Company;
}

export default function CompanyProfile({ company }: Props) {
  const technologies = parseJsonField<string>(company.Technologies);
  const keyFocusAreas = parseJsonField<string>(company['Key Focus Areas']);
  const latestNews = parseJsonField<import('@/lib/types').NewsItem>(company['Latest News']);
  const affiliatedCompanies = parseJsonField<import('@/lib/types').AffiliatedCompany>(company['Affiliated Companies']);
  const competitors = parseJsonField<import('@/lib/types').Competitor>(company.Competitors);
  const fundingRounds = parseJsonField<import('@/lib/types').FundingRound>(company['Funding Rounds']);
  const headcountByCountry = parseJsonField<import('@/lib/types').HeadcountByCountry>(company['Employee Headcount by Country']);
  const headcountByMonth = parseJsonField<import('@/lib/types').HeadcountByMonth>(company['Employee HeadCount by Month']);
  const youtubeMentions = parseJsonField<import('@/lib/types').YoutubeVideo>(company['Youtube Mentions']);
  const redditMentions = parseJsonField<import('@/lib/types').RedditPost>(company['Reddit Mentions']);
  const faqs = parseJsonField<import('@/lib/types').FAQ>(company.FAQs);

  return (
    <div className="space-y-5">
      {/* Basic Info — full width */}
      <BasicInfoSection company={company} />

      {/* About — full width */}
      <AboutSection description={company['Business Description']} companyName={company.W2} />

      {/* Competitors — full width */}
      <CompetitorsSection competitors={competitors} />

      {/* Leadership — full width */}
      <LeadershipSection leadership={company.Leadership} />

      {/*
        Persistent 2-col layout: left col (lg:col-span-2) stays fixed width for ALL remaining
        sections. Right col (lg:col-span-1) holds Technologies, Key Focus Areas, Affiliated.
        items-start prevents the left col from stretching to match right col height.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* LEFT COLUMN — fixed 2/3 width throughout */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <LatestNewsSection news={latestNews} aiSummary={company['News AI Summary']} />

          <FundingSection
            numberOfRounds={company['Number of Funding Rounds']}
            currentStage={company['Current Funding Stage']}
            totalFunding={company['Total Funding']}
            fundingRounds={fundingRounds}
          />

          <EmployeeInsightsSection
            headcount={company['Employee Headcount']}
            byCountry={company['Employee Headcount by Country']}
            byMonth={company['Employee HeadCount by Month']}
          />

          <SocialMediaSection
            youtube={youtubeMentions}
            reddit={redditMentions}
            youtubeSummary={company['YouTube AI Summary']}
            redditSummary={company['Reddit AI Summary']}
          />

          <FAQsSection faqs={faqs} />
        </div>

        {/* RIGHT SIDEBAR — 1/3 width, stacks naturally */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          <TechnologiesSection technologies={technologies} />
          <KeyFocusAreasSection focusAreas={keyFocusAreas} />
          <AffiliatedCompaniesSection companies={affiliatedCompanies} />
        </div>
      </div>
    </div>
  );
}
