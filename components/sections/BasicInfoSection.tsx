'use client';

import Image from 'next/image';
import { Globe, Linkedin, MapPin, Users, Building, Hash, Calendar, DollarSign, MousePointerClick, Trophy } from 'lucide-react';
import { Company } from '@/lib/types';
import { extractDomain, ensureHttps, parseJsonField, isValidTicker, formatFundingStage, formatDate } from '@/lib/utils';

interface Props {
  company: Company;
}

export default function BasicInfoSection({ company }: Props) {
  const name = company.W2 || 'Unknown';
  const logo = company['Company Logo URL'];
  const hq = company.HQ;
  const website = company.Website;
  const linkedin = company['LinkedIn Company Page URL'];
  const linkedinFollowers = company['LinkedIn Followers'];
  const lastUpdatedRaw = company['Last Updated'];
  const lastUpdated = lastUpdatedRaw ? formatDate(String(lastUpdatedRaw)) : null;
  const currentStage = formatFundingStage(company['Current Funding Stage']) || null;
  const type = company['Public or Private Company Type'];
  const ticker = isValidTicker(company.Ticker) ? company.Ticker : null;
  const revenue = company['Revenue Range'];
  const employeeRange = company['Employee Range'];
  const headcount = company['Employee Headcount'];
  const sic = company['SIC Code'];
  const naics = company['NAICS Code'];
  const industry = company['Company Industry'];
  const address = company['Company Address'];
  const foundingYear = company['Founding Year'];
  const pricingModels = parseJsonField<{ model?: string; type?: string; name?: string }>(company['Pricing Model']);
  const pricingText = pricingModels.length > 0
    ? (pricingModels[0].model || pricingModels[0].type || pricingModels[0].name || '')
    : null;

  const operatingCountries = parseJsonField<string>(company['Countries Operational']);
  const totalVisits = company['Total Visits'];
  const globalRank = company['Global Rank'];
  const webDataMonth = company['Web Data Month'];

  return (
    <div className="bg-white border border-[#7d7373] border-t-2 border-t-[#ff4f12] p-6 sm:p-8">
      {/* Top row: logo + name + badges */}
      <div className="flex items-start gap-5 mb-6">
        <div className="w-16 h-16 overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center border border-[#7d7373]">
          {logo ? (
            <Image
              src={logo}
              alt={name}
              width={64}
              height={64}
              className="w-full h-full object-contain p-1.5"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 font-semibold text-xl">{name.charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{name}</h1>
              {hq && (
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin strokeWidth={1.5} className="w-3.5 h-3.5 text-gray-400" />
                  {hq}
                </span>
              )}
            </div>
            {lastUpdated && (
              <span className="text-xs text-gray-400 sm:ml-auto">
                Last updated: {lastUpdated}
              </span>
            )}
          </div>
          {industry && <p className="text-gray-500 text-sm mb-3">{industry}</p>}
          <div className="flex flex-wrap items-center gap-2">
            {currentStage && (
              <span className="px-2.5 py-1 text-xs font-semibold bg-[#ff4f12] text-white">
                {currentStage}
              </span>
            )}
            {type && (
              <span className="px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-700 border border-[#7d7373]">
                {type}
              </span>
            )}
            {revenue && (
              <span className="px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-700 border border-[#7d7373]">
                {revenue}
              </span>
            )}
            {employeeRange && (
              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-700 border border-[#7d7373]">
                <Users strokeWidth={1.5} className="w-3 h-3" />
                {employeeRange}
              </span>
            )}
            {linkedinFollowers && Number(linkedinFollowers.replace(/,/g, '')) > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
                <Linkedin strokeWidth={1.5} className="w-3 h-3" />
                {Number(linkedinFollowers.replace(/,/g, '')).toLocaleString()} followers
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details grid — original 3-column layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-sm border-t border-[#7d7373] pt-5">
        {website && (
          <div className="flex items-start gap-2">
            <Globe strokeWidth={1.5} className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">Website:{' '}
              <a href={ensureHttps(website)} target="_blank" rel="noopener noreferrer" className="text-gray-900 font-medium hover:text-[#ff4f12] transition-colors">
                {extractDomain(website)}
              </a>
            </span>
          </div>
        )}
        {linkedin && (
          <div className="flex items-start gap-2">
            <Linkedin strokeWidth={1.5} className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">LinkedIn:{' '}
              <a href={ensureHttps(linkedin)} target="_blank" rel="noopener noreferrer" className="text-gray-900 font-medium hover:text-[#ff4f12] transition-colors">
                {linkedinFollowers && Number(linkedinFollowers.replace(/,/g, '')) > 0 ? `${Number(linkedinFollowers.replace(/,/g, '')).toLocaleString()} followers` : 'View Profile'}
              </a>
            </span>
          </div>
        )}
        {headcount != null && (
          <div className="flex items-start gap-2">
            <Users strokeWidth={1.5} className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">Headcount:{' '}
              <span className="text-gray-900 font-medium">{headcount.toLocaleString()}</span>
            </span>
          </div>
        )}
        {totalVisits && (
          <div className="flex items-start gap-2">
            <MousePointerClick strokeWidth={1.5} className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">Web Visits{webDataMonth ? ` (${webDataMonth})` : ''}:{' '}
              <span className="text-gray-900 font-medium">{totalVisits}</span>
            </span>
          </div>
        )}
        {globalRank && (
          <div className="flex items-start gap-2">
            <Trophy strokeWidth={1.5} className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">Global Rank:{' '}
              <span className="text-gray-900 font-medium">#{String(globalRank).replace(/#/g, '')}</span>
            </span>
          </div>
        )}
        {sic != null && (
          <div className="flex items-start gap-2">
            <Hash strokeWidth={1.5} className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">SIC:{' '}
              <span className="text-gray-900 font-medium">{sic}</span>
            </span>
          </div>
        )}
        {naics != null && (
          <div className="flex items-start gap-2">
            <Hash strokeWidth={1.5} className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">NAICS:{' '}
              <span className="text-gray-900 font-medium">{naics}</span>
            </span>
          </div>
        )}
        {foundingYear != null && (
          <div className="flex items-start gap-2">
            <Calendar strokeWidth={1.5} className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">Founded:{' '}
              <span className="text-gray-900 font-medium">{foundingYear}</span>
            </span>
          </div>
        )}
        {address && (
          <div className="flex items-start gap-2 sm:col-span-2 lg:col-span-1">
            <MapPin strokeWidth={1.5} className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">Address:{' '}
              <span className="text-gray-900 font-medium">{address}</span>
            </span>
          </div>
        )}
        {operatingCountries.length > 0 && (
          <div className="flex items-start gap-2 sm:col-span-2 lg:col-span-2">
            <Globe strokeWidth={1.5} className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">Operating:{' '}
              <span className="text-gray-900 font-medium">{operatingCountries.join(', ')}</span>
            </span>
          </div>
        )}
        {pricingText && (
          <div className="flex items-start gap-2">
            <DollarSign strokeWidth={1.5} className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">Pricing:{' '}
              <span className="text-gray-900 font-medium">{pricingText}</span>
            </span>
          </div>
        )}
        {ticker && (
          <div className="flex items-start gap-2">
            <Building strokeWidth={1.5} className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">Ticker:{' '}
              <span className="text-gray-900 font-medium font-mono">{ticker}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
