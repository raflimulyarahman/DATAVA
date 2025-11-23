'use client';

import { Home, TrendingUp, Upload, Database, Sparkles, Coins } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileSidebarProps {
  onClose: () => void;
}

export const MobileSidebar = ({ onClose }: MobileSidebarProps) => {
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
    <nav className="flex flex-1 flex-col px-4 py-4">
      <ul role="list" className="flex flex-1 flex-col gap-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
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
  );
};
