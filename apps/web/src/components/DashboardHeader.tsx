'use client';

import { Bell, Search, User } from "lucide-react";
import { WalletConnect } from "@/src/components/WalletConnect";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export const DashboardHeader = () => {
  return (
    <header className="z-10 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      <div className="flex-1">
        <form className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search datasets, CIDs, transactions..."
            className="pl-10 bg-card/50 border-border focus-visible:ring-primary"
          />
        </form>
      </div>
      <div className="flex items-center gap-4">
        <WalletConnect />
        <Button variant="ghost" className="relative w-10 h-10 p-0">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
        </Button>
        <Button variant="ghost" className="w-10 h-10 p-0">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
