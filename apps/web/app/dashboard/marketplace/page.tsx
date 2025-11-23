'use client';

import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Search, Filter, Database, Coins, Sparkles } from "lucide-react";
import { DatasetCard } from "@/src/components/DatasetCard";

const MarketplacePage = () => {
  // Mock data for marketplace
  const datasets = [
    {
      id: 1,
      title: "Financial Transactions 2024",
      description: "Comprehensive dataset of financial transactions for 2024 with metadata",
      owner: "0x1234...5678",
      price: "0.25 SUI",
      inferenceCount: 124,
      category: "Finance",
      size: "2.4 GB",
      license: "MIT"
    },
    {
      id: 2,
      title: "Healthcare Records Sample",
      description: "Anonymized healthcare records for research and AI training purposes",
      owner: "0x9876...5432",
      price: "0.50 SUI",
      inferenceCount: 89,
      category: "Healthcare",
      size: "1.8 GB",
      license: "CC BY-NC"
    },
    {
      id: 3,
      title: "Social Media Sentiment",
      description: "Social media posts with sentiment analysis data",
      owner: "0xabcd...efgh",
      price: "0.15 SUI",
      inferenceCount: 210,
      category: "Social Media",
      size: "5.2 GB",
      license: "MIT"
    },
    {
      id: 4,
      title: "IoT Sensor Data",
      description: "Time-series data from various IoT sensors in smart city infrastructure",
      owner: "0xijkl...mnop",
      price: "0.35 SUI",
      inferenceCount: 67,
      category: "Technology",
      size: "3.1 GB",
      license: "Apache 2.0"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold neon-text">Marketplace</h1>
        <p className="text-muted-foreground">
          Browse and purchase datasets for your AI projects
        </p>
      </div>

      {/* Search and Filter Bar */}
      <Card className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search datasets..."
              className="w-full pl-10 p-2 rounded-lg bg-background/50 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <Button variant="outline" className="neon-border">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 neon-border">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Datasets</p>
              <p className="text-xl font-bold">1,245</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/20 neon-border-purple">
              <Coins className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Volume Traded</p>
              <p className="text-xl font-bold">24.5K SUI</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 neon-border">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Inferences</p>
              <p className="text-xl font-bold">12.8K</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Dataset Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Available Datasets</h2>
          <Badge variant="secondary" className="neon-text">
            {datasets.length} datasets
          </Badge>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {datasets.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
