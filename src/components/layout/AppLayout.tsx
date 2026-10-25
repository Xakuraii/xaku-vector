import React from 'react';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';

interface AppLayoutProps {
  children: React.ReactNode;
  targetKB?: number;
  onSelectSample?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, targetKB, onSelectSample }) => {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <AppHeader targetKB={targetKB} onSelectSample={onSelectSample} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-12">
        {children}
      </main>
      <AppFooter />
    </div>
  );
};
