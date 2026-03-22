'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
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
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
          value.startsWith('All')
            ? 'text-gray-600 bg-white border border-[#7d7373] hover:border-gray-400'
            : 'text-[#ff4f12] bg-[#fff1ec] border border-[#ff4f12]/40 hover:border-[#ff4f12]'
        }`}
      >
        {value}
        <ChevronDown strokeWidth={1.5}  className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''} ${
          value.startsWith('All') ? 'text-gray-400' : 'text-[#ff4f12]'
        }`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-[#7d7373] shadow-lg z-20 min-w-[160px] py-1 animate-fade-in">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-[#FAFAFA] transition-colors ${value === opt ? 'text-[#ff4f12] font-medium bg-[#fff1ec]' : 'text-gray-700'}`}
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
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchSuggestions, setSearchSuggestions] = useState<Company[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [stage, setStage] = useState('All Stages');
  const [type, setType] = useState('All Types');
  const [size, setSize] = useState('All Sizes');
  const [revenue, setRevenue] = useState('All Revenue');
  const [sortAZ, setSortAZ] = useState<'asc' | 'desc'>('asc');
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch companies from server-side API
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '24',
        search,
        stage,
        type,
        size,
        revenue,
        sort: sortAZ
      });

      const response = await fetch(`/api/companies?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      
      const result = await response.json();
      
      setCompanies(result.data || []);
      setTotalPages(result.pagination.totalPages);
      setTotalItems(result.pagination.totalItems);
      setMounted(true);
    } catch (err) {
      setError('Failed to load companies');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, stage, type, size, revenue, sortAZ]);

  // Debounced search
  const [searchInput, setSearchInput] = useState(search);
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchInput.trim()) {
        setSearchSuggestions([]);
        return;
      }
      try {
        const params = new URLSearchParams({ search: searchInput, limit: '5' });
        const res = await fetch(`/api/companies?${params}`);
        if (res.ok) {
          const json = await res.json();
          setSearchSuggestions(json.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const timer = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setSearch(searchInput);
        setPage(1);
      }
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timer);
  }, [searchInput, search]);

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

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="pt-20 bg-[#FAFAFA] border-b border-[#7d7373/60]">
        <div className="relative px-6 lg:px-16 hero-grid">
          <div className="max-w-4xl mx-auto relative py-20 sm:py-28 flex flex-col items-center text-center">
            <div className="flex flex-col gap-6 items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50/50 border border-orange-100 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4f12]"></span>
                <span className="text-xs font-semibold tracking-wide text-[#ff4f12] uppercase">Directory</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-normal text-gray-900 leading-[1.08] tracking-tight font-display">
                Explore insights on people, companies &<span className="text-[#ff4f12]"> businesses</span>
              </h1>
              <p className="text-gray-500 text-base sm:text-lg max-w-xl">
                Discover & learn the GTM skills you need to grow faster and build with confidence using Floqer.
              </p>
              {/* Search with suggestions */}
              <div className="w-full max-w-2xl relative mt-8" ref={searchRef}>
                <Search strokeWidth={1.5}  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
                  className="w-full pl-11 pr-4 py-3.5 text-sm border border-[#7d7373] rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04),0_16px_32px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-[#ff4f12]/20 focus:border-[#ff4f12] transition-all"
                />
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#7d7373] rounded-lg shadow-lg z-30 max-h-64 overflow-y-auto">
                    {searchSuggestions.map((company) => {
                      const slug = createSafeSlug(company.W2);
                      return (
                        <a
                          key={company.W2}
                          href={`/company/${slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setSearchInput(company.W2);
                            setSearch(company.W2);
                            setShowSuggestions(false);
                            router.push(`/company/${slug}`);
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#FAFAFA] transition-colors border-b border-[#7d7373] last:border-b-0"
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center border border-[#7d7373]">
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
                        </a>
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
        <div className="border-t border-[#7d7373] bg-white sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-16 py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mr-1">
                <SlidersHorizontal strokeWidth={1.5}  className="w-4 h-4" />
                <span className="font-medium">Filters</span>
              </div>
              <FilterDropdown value={stage} options={STAGES} onChange={(value) => { setStage(value); setPage(1); }} />
              <FilterDropdown value={type} options={TYPES} onChange={(value) => { setType(value); setPage(1); }} />
              <FilterDropdown value={size} options={SIZES} onChange={(value) => { setSize(value); setPage(1); }} />
              <FilterDropdown value={revenue} options={REVENUES} onChange={(value) => { setRevenue(value); setPage(1); }} />
            </div>
            <button
              onClick={() => setSortAZ(s => s === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-[#7d7373] hover:border-gray-400 transition-colors"
            >
              <ArrowUpDown strokeWidth={1.5}  className="w-3.5 h-3.5 text-gray-400" />
              {sortAZ === 'asc' ? 'A → Z' : 'Z → A'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-8">
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
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-400">
                  Showing <span className="font-medium text-gray-700">{totalItems}</span> {totalItems === 1 ? 'company' : 'companies'}
                </p>
                <p className="text-sm text-gray-400">
                  Page <span className="font-medium text-gray-700">{page}</span> of {totalPages}
                </p>
              </div>
              {companies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <p className="text-gray-500 font-medium">No companies match your filters</p>
                  <button
                    onClick={() => {
                      setSearch('');
                      setStage('All Stages');
                      setType('All Types');
                      setSize('All Sizes');
                      setRevenue('All Revenue');
                      setPage(1);
                    }}
                    className="text-sm text-[#ff4f12] hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {companies.map((company: Company) => (
                      <CompanyCard key={company.W2} company={company} />
                    ))}
                  </div>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                        onClick={() => {
                          setPage(Math.max(1, page - 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={page === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-[#7d7373] hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1;
                          const isActive = pageNum === page;
                          const isNearStart = pageNum < 3;
                          const isNearEnd = pageNum > totalPages - 3;
                          
                          if (isNearStart || isNearEnd || isActive) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => {
                                  setPage(pageNum);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${
                                  isActive
                                    ? 'bg-[#ff4f12] text-white'
                                    : 'text-gray-600 bg-white border border-[#7d7373] hover:border-gray-400'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                          return null;
                        })}
                      </div>
                      
                      <button
                        onClick={() => {
                          setPage(Math.min(totalPages, page + 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={page === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-[#7d7373] rounded-lg hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </LayoutWrapper>
  );
}
