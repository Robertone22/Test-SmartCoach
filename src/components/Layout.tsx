import React from 'react';
import { Navbar } from './Navbar';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-1 md:ml-[240px] p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full fade-in">
        {children}
      </main>
    </div>
  );
}
