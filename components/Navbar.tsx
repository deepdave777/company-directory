'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#7d7373]">
      <div className="max-w-[1400px] mx-auto px-6 h-[68px] relative flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            {/* Floqer Logo */}
            <Image
              src="/floqer-logo-NEW.svg"
              alt="Floqer"
              width={120}
              height={32}
              className="h-[22px] w-auto"
            />
          </Link>
        </div>
        
        <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          <Link
            href="#"
            className="text-[14px] font-semibold text-gray-900 transition-colors"
          >
            Use cases
          </Link>
          <Link
            href="#"
            className="text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Product
          </Link>
          <Link
            href="#"
            className="text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Customers
          </Link>
          <Link
            href="#"
            className="text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Blogs
          </Link>
          <Link
            href="#"
            className="text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Resources
          </Link>
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <Link
            href="https://app.floqer.com/login"
            className="text-[14px] font-medium text-gray-900 transition-colors hover:text-gray-600 hidden sm:block"
          >
            Log in
          </Link>
          <Link
            href="https://app.floqer.com/signup"
            className="bg-[#0f172a] text-white px-5 py-2.5 text-[14px] font-medium hover:bg-black transition-colors rounded-sm"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
