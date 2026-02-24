'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import PageTransition from './PageTransition';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <>
      <Navbar />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
