import { Home, TrendingUp, Upload, Database, Sparkles, Coins } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar border-r border-sidebar-border">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold neon-text">DATAVA</h1>
        </div>
        <nav className="flex flex-1 flex-col px-4">
          <ul role="list" className="flex flex-1 flex-col gap-y-1">
            <li>
              <Link
                href="/dashboard"
                className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent hover:neon-text ${
                  isActive('/dashboard') ? 'bg-sidebar-accent neon-text shadow-sm' : ''
                }`}
              >
                <Home className="h-5 w-5 shrink-0" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/marketplace"
                className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent hover:neon-text ${
                  isActive('/dashboard/marketplace') ? 'bg-sidebar-accent neon-text shadow-sm' : ''
                }`}
              >
                <Database className="h-5 w-5 shrink-0" />
                Marketplace
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/upload"
                className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent hover:neon-text ${
                  isActive('/dashboard/upload') ? 'bg-sidebar-accent neon-text shadow-sm' : ''
                }`}
              >
                <Upload className="h-5 w-5 shrink-0" />
                Upload Dataset
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/inference"
                className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent hover:neon-text ${
                  isActive('/dashboard/inference') ? 'bg-sidebar-accent neon-text shadow-sm' : ''
                }`}
              >
                <Sparkles className="h-5 w-5 shrink-0" />
                AI Inference
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/rewards"
                className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent hover:neon-text ${
                  isActive('/dashboard/rewards') ? 'bg-sidebar-accent neon-text shadow-sm' : ''
                }`}
              >
                <Coins className="h-5 w-5 shrink-0" />
                Rewards
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/my-datasets"
                className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent hover:neon-text ${
                  isActive('/dashboard/my-datasets') ? 'bg-sidebar-accent neon-text shadow-sm' : ''
                }`}
              >
                <TrendingUp className="h-5 w-5 shrink-0" />
                My Datasets
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
