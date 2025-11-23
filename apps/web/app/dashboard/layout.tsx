'use client';

import { Sidebar } from '../../src/components/Sidebar';
import { MobileSidebar } from '../../src/components/MobileSidebar';
import { DashboardHeader } from '../../src/components/DashboardHeader';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <h1 className="text-2xl font-bold neon-text">DATAVA</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-sidebar-foreground hover:text-foreground"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <MobileSidebar onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-border bg-card px-4 shadow-sm sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            type="button"
            className="text-foreground lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Header content */}
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-x-4">
              <h2 className="text-lg font-semibold text-foreground lg:hidden">
                DATAVA
              </h2>
            </div>
            <DashboardHeader />
          </div>
        </div>

        {/* Page content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
