'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
