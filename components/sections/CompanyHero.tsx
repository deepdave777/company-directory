'use client';

import Image from 'next/image';
import { Company } from '@/lib/types';

interface Props {
  company: Company;
}

export default function CompanyHero({ company }: Props) {
  const name = company.W2 || 'Unknown Company';
  const industry = company['Company Industry'] || 'Technology';
  const logo = company['Company Logo URL'];
  let defaultTagline = company['Business Description'] || '';
  if (defaultTagline.length > 150) {
    defaultTagline = defaultTagline.substring(0, 150) + '...';
  }

  return (
    <div className="bg-white w-full border-b border-[#7d7373]">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[440px]">
        {/* Left Column: Text Content */}
        <div className="py-16 pr-12 lg:pr-24 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block w-2.5 h-2.5 bg-[#ff4f12]"></span>
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">{industry}</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-normal text-gray-900 leading-[1.1] tracking-tight font-display mb-6">
            {name}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
            {defaultTagline}
          </p>
        </div>
        
        {/* Right Column: Dark Logo Block */}
        <div className="bg-[#0A1A2F] flex items-center justify-center p-16 relative overflow-hidden">
          {/* Subtle grid background pattern typical for Floqer visual elements */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {logo ? (
              <Image 
                src={logo} 
                alt={`${name} logo`} 
                width={300} 
                height={200} 
                className="w-auto h-auto max-w-[280px] max-h-[180px] object-contain drop-shadow-2xl" 
                unoptimized 
              />
            ) : (
              <span className="text-white font-black text-8xl uppercase opacity-20 tracking-tighter mix-blend-overlay">
                {name.charAt(0)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
