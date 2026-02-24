import { Company } from '@/lib/types';
import { parseJsonField } from '@/lib/utils';
import BasicInfoSection from './sections/BasicInfoSection';
import AboutSection from './sections/AboutSection';
import LatestNewsSection from './sections/LatestNewsSection';
import TechnologiesSection from './sections/TechnologiesSection';
import KeyFocusAreasSection from './sections/KeyFocusAreasSection';
import CompetitorsSection from './sections/CompetitorsSection';
import LeadershipSection from './sections/LeadershipSection';
import FundingSection from './sections/FundingSection';
import ProductsSection from './sections/ProductsSection';
import BusinessModelSection from './sections/BusinessModelSection';
import CustomerBaseSection from './sections/CustomerBaseSection';
import PartnershipsSection from './sections/PartnershipsSection';
import AdditionalInfoSection from './sections/AdditionalInfoSection';

interface Props {
  company: Company;
}

export default function CompanyProfileServer({ company }: Props) {
  const leadership = parseJsonField(company['Leadership Team']);
  const funding = parseJsonField(company['Funding History']);
  const products = parseJsonField(company['Products & Services']);
  const businessModel = parseJsonField(company['Business Model']);
  const customerBase = parseJsonField(company['Customer Base']);
  const partnerships = parseJsonField(company['Partnerships']);
  const competitors = parseJsonField(company['Competitors']);
  const tech = parseJsonField(company['Technologies']);
  const focus = parseJsonField(company['Key Focus Areas']);
  const news = parseJsonField(company['Latest News']);

  return (
    <div className="space-y-8">
      <BasicInfoSection company={company} />
      
      {leadership && leadership.length > 0 && (
        <LeadershipSection leadership={leadership} />
      )}
      
      {funding && funding.length > 0 && (
        <FundingSection funding={funding} />
      )}
      
      {products && products.length > 0 && (
        <ProductsSection products={products} />
      )}
      
      {businessModel && businessModel.length > 0 && (
        <BusinessModelSection businessModel={businessModel} />
      )}
      
      {customerBase && customerBase.length > 0 && (
        <CustomerBaseSection customerBase={customerBase} />
      )}
      
      {partnerships && partnerships.length > 0 && (
        <PartnershipsSection partnerships={partnerships} />
      )}
      
      {competitors && competitors.length > 0 && (
        <CompetitorsSection competitors={competitors} />
      )}
      
      {tech && tech.length > 0 && (
        <TechnologiesSection technologies={tech} />
      )}
      
      {focus && focus.length > 0 && (
        <KeyFocusAreasSection focusAreas={focus} />
      )}
      
      {news && news.length > 0 && (
        <LatestNewsSection news={news} />
      )}
      
      <AboutSection company={company} />
      <AdditionalInfoSection company={company} />
    </div>
  );
}
