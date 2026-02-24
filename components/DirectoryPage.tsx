'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CaretDown, MagnifyingGlass, ArrowsVertical, Faders } from '@phosphor-icons/react';
import { listCompanies } from '@/lib/data/companies';
import { Company } from '@/lib/types';
import CompanyCard from './CompanyCard';
import Navbar from './Navbar';

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
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
      >
        {value}
        <CaretDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[160px] py-1 animate-fade-in">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${value === opt ? 'text-[#ff4f12] font-medium bg-[#fff8f6]' : 'text-gray-700'}`}
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
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('All Stages');
  const [type, setType] = useState('All Types');
  const [size, setSize] = useState('All Sizes');
  const [revenue, setRevenue] = useState('All Revenue');
  const [sortAZ, setSortAZ] = useState<'asc' | 'desc'>('asc');

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
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="pt-14">
        <div
          className="relative flex flex-col items-center justify-center px-6 py-20 text-center"
          style={{ background: 'linear-gradient(180deg, #fff7f4 0%, #ffffff 100%)' }}
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 font-display">
            Company <span className="text-[#ff4f12]">Directory</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-md mb-10">
            Explore detailed profiles of leading companies. Search, filter, and discover insights.
          </p>
          {/* Search */}
          <div className="w-full max-w-xl relative">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff4f12]/20 focus:border-[#ff4f12] transition-all"
            />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="border-t border-gray-100 bg-white sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-3">
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
        <div className="max-w-7xl mx-auto px-6 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-8 h-8 border-2 border-[#ff4f12] border-t-transparent animate-spin" />
              <p className="text-sm text-gray-500">Loading companies...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <p className="text-red-500 font-medium">Failed to load companies</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
