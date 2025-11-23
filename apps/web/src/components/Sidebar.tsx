'use client';

import { Home, TrendingUp, Upload, Database, Sparkles, Coins } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/marketplace', label: 'Marketplace', icon: Database },
    { href: '/dashboard/upload', label: 'Upload Dataset', icon: Upload },
    { href: '/dashboard/inference', label: 'AI Inference', icon: Sparkles },
    { href: '/dashboard/my-datasets', label: 'My Datasets', icon: TrendingUp },
    { href: '/dashboard/rewards', label: 'Rewards', icon: Coins },
  ];
  
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar border-r border-sidebar-border">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold neon-text">DATAVA</h1>
        </div>
        <nav className="flex flex-1 flex-col px-4 py-4">
          <ul role="list" className="flex flex-1 flex-col gap-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent hover:neon-text ${
                      isActive(item.href) ? 'bg-sidebar-accent neon-text shadow-sm' : ''
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};
