'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { CaretDown, MagnifyingGlass, ArrowsVertical, Faders } from '@phosphor-icons/react';
import { listCompanies } from '@/lib/data/companies';
import { Company } from '@/lib/types';
import CompanyCard from './CompanyCard';
import LayoutWrapper from './LayoutWrapper';
import { createSafeSlug } from '@/lib/slugUtils';

const STAGES = ['All Stages', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D', 'Series E', 'Series F', 'Corporate', 'IPO', 'Private Equity'];
const TYPES = ['All Types', 'Public', 'Private'];
const SIZES = ['All Sizes', '1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10001+'];
const REVENUES = ['All Revenue', '<1M', '1M-10M', '10M-50M', '50M-100M', '100M-500M', '500M-1B', '1B-10B', '10B+'];

interface FilterDropdownProps {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

function FilterDropdown({ value, options, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          value.startsWith('All')
            ? 'text-gray-700 bg-white border border-gray-200 hover:border-gray-300'
            : 'text-[#ff4f12] bg-[#fff1ec] border border-[#ff4f12] hover:border-[#ff4f12]'
        }`}
      >
        {value}
        <CaretDown className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''} ${
          value.startsWith('All') ? 'text-gray-400' : 'text-[#ff4f12]'
        }`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[160px] py-1 animate-fade-in">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${value === opt ? 'text-[#ff4f12] font-medium bg-[#fff1ec]' : 'text-gray-700'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DirectoryPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filtered, setFiltered] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<Company[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [stage, setStage] = useState('All Stages');
  const [type, setType] = useState('All Types');
  const [size, setSize] = useState('All Sizes');
  const [revenue, setRevenue] = useState('All Revenue');
  const [sortAZ, setSortAZ] = useState<'asc' | 'desc'>('asc');
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle click outside for search suggestions
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update search suggestions when typing
  useEffect(() => {
    if (search.length > 0) {
      const suggestions = companies.filter(company =>
        company.W2?.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [search, companies]);

  useEffect(() => {
    async function fetchCompanies() {
      setLoading(true);
      const data = await listCompanies();
      if (!data || data.length === 0) {
        setError('No companies found');
      } else {
        setCompanies(data);
      }
      setLoading(false);
      setMounted(true);
    }
    fetchCompanies();
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...companies];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => (c.W2 || '').toLowerCase().includes(q));
    }

    if (stage !== 'All Stages') {
      result = result.filter(c => c.Stage === stage);
    }

    if (type !== 'All Types') {
      result = result.filter(c => (c['Public or Private Company Type'] || '').toLowerCase() === type.toLowerCase());
    }

    if (size !== 'All Sizes') {
      result = result.filter(c => c['Employee Range'] === size);
    }

    if (revenue !== 'All Revenue') {
      result = result.filter(c => c['Revenue Range'] === revenue);
    }

    result.sort((a, b) => {
      const nameA = (a.W2 || '').toLowerCase();
      const nameB = (b.W2 || '').toLowerCase();
      return sortAZ === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    setFiltered(result);
  }, [companies, search, stage, type, size, revenue, sortAZ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="pt-14">
        <div className="relative px-16 hero-grid">
          <div className="max-w-7xl mx-auto relative py-36">
            <div className="flex flex-col gap-4 text-left max-w-4xl">
              <h1 className="text-6xl sm:text-5xl lg:text-6xl font-normal text-gray-900 leading-none tracking-tight font-display">
                Explore insights on people, companies &<span className="text-[#ff4f12]"> businesses</span>
              </h1>
              <p className="text-gray-600 text-base sm:text-lg max-w-xl">
                Discover & learn the GTM skills you need to grow faster and build with confidence using Floqer.
              </p>
              {/* Search with suggestions */}
              <div className="w-full max-w-xl relative mt-4" ref={searchRef}>
                <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
                  className="w-full pl-11 pr-4 py-3.5 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff4f12]/20 focus:border-[#ff4f12] transition-all"
                />
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-64 overflow-y-auto">
                    {searchSuggestions.map((company) => {
                      const slug = createSafeSlug(company.W2);
                      return (
                        <Link
                          key={company.W2}
                          href={`/company/${slug}`}
                          onClick={() => {
                            setSearch(company.W2);
                            setShowSuggestions(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200">
                            {company['Company Logo URL'] ? (
                              <Image
                                src={company['Company Logo URL']}
                                alt={company.W2}
                                width={32}
                                height={32}
                                className="w-full h-full object-contain"
                                unoptimized
                              />
                            ) : (
                              <span className="text-gray-400 font-bold text-xs">
                                {company.W2.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 truncate">
                              {company.W2}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {company['Company Industry'] || 'Technology'}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {/* <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[520px]">
                <Image
                  src="/download.png"
                  alt="Floqer growth illustration"
                  width={1024}
                  height={512}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div> */}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="border-t border-gray-100 bg-white sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-16 py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mr-1">
                <Faders className="w-4 h-4" />
                <span className="font-medium">Filters</span>
              </div>
              <FilterDropdown value={stage} options={STAGES} onChange={setStage} />
              <FilterDropdown value={type} options={TYPES} onChange={setType} />
              <FilterDropdown value={size} options={SIZES} onChange={setSize} />
              <FilterDropdown value={revenue} options={REVENUES} onChange={setRevenue} />
            </div>
            <button
              onClick={() => setSortAZ(s => s === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <ArrowsVertical className="w-3.5 h-3.5 text-gray-400" />
              {sortAZ === 'asc' ? 'A → Z' : 'Z → A'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-16 py-6">
          {loading ? (
            <div className={`flex flex-col items-center justify-center py-24 gap-4 ${
              mounted ? 'fade-in' : 'opacity-0'
            }`}>
              <div className="w-8 h-8 border-2 border-[#ff4f12] border-t-transparent animate-spin" />
              <p className="text-sm text-gray-500">Loading companies...</p>
            </div>
          ) : error ? (
            <div className={`flex flex-col items-center justify-center py-24 gap-3 ${
              mounted ? 'fade-in' : 'opacity-0'
            }`}>
              <p className="text-red-500 font-medium">Failed to load companies</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          ) : (
            <div className={mounted ? 'fade-in' : 'opacity-0'}>
            <>
              <p className="text-sm text-gray-500 mb-5">
                {filtered.length} {filtered.length === 1 ? 'company' : 'companies'} found
              </p>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <p className="text-gray-500 font-medium">No companies match your filters</p>
                  <button
                    onClick={() => { setSearch(''); setStage('All Stages'); setType('All Types'); setSize('All Sizes'); setRevenue('All Revenue'); }}
                    className="text-sm text-[#ff4f12] hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((company) => (
                    <CompanyCard key={company.W2} company={company} />
                  ))}
                </div>
              )}
            </>
            </div>
          )}
        </div>
      </div>
    </div>
    </LayoutWrapper>
  );
}
