'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-16 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          {/* Floqer Logo */}
          <Image
            src="/floqer-logo-NEW.svg"
            alt="Floqer"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Directory
        </Link>
      </div>
    </nav>
  );
}
