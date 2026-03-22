'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-gray-400 py-16 px-6 lg:px-16 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16 text-sm">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              {/* Note: Update src to a dark-mode optimized logo if available */}
              <Image
                src="/floqer-logo-NEW.svg"
                alt="Floqer"
                width={120}
                height={32}
                className="h-7 w-auto invert brightness-0"
              />
            </Link>
            <p className="text-gray-500 leading-relaxed text-xs">
              Empowering GTM teams with actionable intelligence and reliable data.
            </p>
          </div>

          <div>
            <h4 className="text-gray-200 font-semibold mb-4 text-xs tracking-wider uppercase">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-white transition-colors">Directory</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Chrome Extension <span className="text-[#ff4f12] text-[10px] uppercase font-bold ml-1 bg-[#ff4f12]/10 px-1.5 py-0.5 rounded">New</span></Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">API Access</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-200 font-semibold mb-4 text-xs tracking-wider uppercase">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Case Studies</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-200 font-semibold mb-4 text-xs tracking-wider uppercase">Company</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-200 font-semibold mb-4 text-xs tracking-wider uppercase">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-800 pt-8 gap-4">
          <div className="flex items-center gap-4">
            <a href="#" className="bg-[#ff4f12] text-white p-1.5 rounded-sm hover:bg-[#e04510] transition-colors">
              <Linkedin className="w-4 h-4 fill-current" />
            </a>
            <a href="#" className="bg-[#ff4f12] text-white p-1.5 rounded-sm hover:bg-[#e04510] transition-colors">
              <Twitter className="w-4 h-4 fill-current" />
            </a>
            <a href="#" className="bg-[#ff4f12] text-white p-1.5 rounded-sm hover:bg-[#e04510] transition-colors">
              <Youtube className="w-4 h-4 fill-current" />
            </a>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-gray-500">
            <p>Join the future of GTM</p>
            <Link 
              href="https://app.floqer.com/signup"
              className="bg-[#ff4f12] text-white px-4 py-1.5 rounded font-medium hover:bg-[#e04510] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
