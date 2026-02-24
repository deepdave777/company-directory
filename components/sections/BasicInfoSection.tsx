'use client';

import Image from 'next/image';
import { Globe, LinkedinLogo, MapPin, Users, Buildings, Hash, Calendar, CurrencyDollar } from '@phosphor-icons/react';
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Top row: logo + name + badges */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200">
          {logo ? (
            <Image
              src={logo}
              alt={name}
              width={64}
              height={64}
              className="w-full h-full object-contain"
              unoptimized
            />
          ) : (
            <span className="text-gray-400 font-bold text-2xl">{name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            {hq && (
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-3.5 h-3.5" />
                {hq}
              </span>
            )}
          </div>
          {industry && <p className="text-gray-500 text-sm mb-3">{industry}</p>}
          <div className="flex flex-wrap items-center gap-2">
            {currentStage && (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#ff4f12] text-white">
                {currentStage}
              </span>
            )}
            {type && (
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                {type}
              </span>
            )}
            {revenue && (
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                {revenue}
              </span>
            )}
            {employeeRange && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                <Users className="w-3 h-3" />
                {employeeRange}
              </span>
            )}
            {linkedinFollowers && Number(linkedinFollowers.replace(/,/g, '')) > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
                <LinkedinLogo className="w-3 h-3" />
                {Number(linkedinFollowers.replace(/,/g, '')).toLocaleString()} followers
              </span>
            )}
            {lastUpdated && (
              <span className="text-xs text-gray-500 order-last sm:order-none sm:ml-auto w-full sm:w-auto text-right sm:text-left">
                Last updated: {lastUpdated}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-sm border-t border-gray-100 pt-5">
        {website && (
          <div className="flex items-start gap-2">
            <Globe className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-500">Website:{' '}
              <a href={ensureHttps(website)} target="_blank" rel="noopener noreferrer" className="text-gray-900 font-medium hover:text-[#ff4f12] transition-colors">
                {extractDomain(website)}
              </a>
            </span>
          </div>
        )}
        {linkedin && (
          <div className="flex items-start gap-2">
            <LinkedinLogo className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-500">LinkedIn:{' '}
              <a href={ensureHttps(linkedin)} target="_blank" rel="noopener noreferrer" className="text-gray-900 font-medium hover:text-[#ff4f12] transition-colors">
                {linkedinFollowers && Number(linkedinFollowers) > 0 ? `${Number(linkedinFollowers).toLocaleString()} followers` : 'View Profile'}
              </a>
            </span>
          </div>
        )}
        {headcount != null && (
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-500">Headcount:{' '}
              <span className="text-gray-900 font-medium">{headcount.toLocaleString()}</span>
            </span>
          </div>
        )}
        {sic != null && (
          <div className="flex items-start gap-2">
            <Hash className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-500">SIC:{' '}
              <span className="text-gray-900 font-medium">{sic}</span>
            </span>
          </div>
        )}
        {naics != null && (
          <div className="flex items-start gap-2">
            <Hash className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-500">NAICS:{' '}
              <span className="text-gray-900 font-medium">{naics}</span>
            </span>
          </div>
        )}
        {foundingYear != null && (
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-500">Founded:{' '}
              <span className="text-gray-900 font-medium">{foundingYear}</span>
            </span>
          </div>
        )}
        {address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-500">Address:{' '}
              <span className="text-gray-900 font-medium">{address}</span>
            </span>
          </div>
        )}
        {operatingCountries.length > 0 && (
          <div className="flex items-start gap-2">
            <Globe className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-500">Operating:{' '}
              <span className="text-gray-900 font-medium">{operatingCountries.join(', ')}</span>
            </span>
          </div>
        )}
        {pricingText && (
          <div className="flex items-start gap-2">
            <CurrencyDollar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-500">Pricing:{' '}
              <span className="text-gray-900 font-medium">{pricingText}</span>
            </span>
          </div>
        )}
        {ticker && (
          <div className="flex items-start gap-2">
            <Buildings className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-500">Ticker:{' '}
              <span className="text-gray-900 font-medium font-mono">{ticker}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
