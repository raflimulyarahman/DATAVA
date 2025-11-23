'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ConnectButton } from '@mysten/dapp-kit';
import { Card } from '../../../src/components/ui/card';
import { Button } from '../../../src/components/ui/button';
import { Badge } from '../../../src/components/ui/badge';
import { 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ExternalLink,
  Calendar,
  Database
} from 'lucide-react';
import { format } from 'date-fns';

// Mock data - nanti diganti dengan data dari API blockchain
const mockRewardsData = [
  {
    id: 1,
    datasetTitle: "Financial Transactions 2024",
    amount: "0.25 SUI",
    date: new Date(2024, 10, 15),
    type: "inference", // inference, access, stake
    status: "completed" // completed, pending
  },
  {
    id: 2,
    datasetTitle: "Healthcare Records Sample",
    amount: "0.18 SUI",
    date: new Date(2024, 10, 14),
    type: "access",
    status: "completed"
  },
  {
    id: 3,
    datasetTitle: "Social Media Sentiment",
    amount: "0.32 SUI",
    date: new Date(2024, 10, 12),
    type: "inference",
    status: "completed"
  },
  {
    id: 4,
    datasetTitle: "IoT Sensor Data",
    amount: "0.15 SUI",
    date: new Date(2024, 10, 10),
    type: "access",
    status: "pending"
  }
];

const mockEarnings = {
  total: "2.45 SUI",
  monthly: "1.20 SUI",
  weekly: "0.55 SUI"
};

const mockTopPerforming = [
  { id: 1, title: "Financial Transactions 2024", earnings: "0.85 SUI", accesses: 124 },
  { id: 2, title: "Healthcare Records Sample", earnings: "0.68 SUI", accesses: 89 },
  { id: 3, title: "Social Media Sentiment", earnings: "0.45 SUI", accesses: 210 }
];

export default function RewardsPage() {
  const account = useCurrentAccount();
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, completed, pending

  useEffect(() => {
    // In real app, fetch from API or blockchain
    setTimeout(() => {
      setRewards(mockRewardsData);
      setLoading(false);
    }, 800);
  }, []);

  const filteredRewards = filter === 'all' 
    ? rewards 
    : rewards.filter(reward => reward.status === filter);

  if (!account) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="p-8 text-center bg-gray-900 max-w-md w-full rounded-lg">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-amber-900/30 flex items-center justify-center">
              <Coins className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">
            Please connect your Sui wallet to view your rewards
          </p>
          <ConnectButton>
            <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all">
              Connect Wallet
            </button>
          </ConnectButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Simple header */}
      <header className="z-10 flex h-16 items-center justify-between gap-4 border-b border-gray-800 px-4 lg:px-6">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Rewards</h1>
        <ConnectButton>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-500 transition-all">
            {account ? 'Connected' : 'Connect Wallet'}
          </button>
        </ConnectButton>
      </header>

      <main className="p-4 lg:p-6">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Rewards Dashboard</h1>
          <p className="text-gray-400">
            Track your earnings from dataset usage
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card className="bg-gray-900/50 p-4 text-center border border-gray-800">
            <div className="text-2xl text-amber-400 mb-1">💰</div>
            <h3 className="font-bold text-lg">{mockEarnings.total}</h3>
            <p className="text-sm text-gray-400">Total Earned</p>
          </Card>
          <Card className="bg-gray-900/50 p-4 text-center border border-gray-800">
            <div className="text-2xl text-green-400 mb-1">📈</div>
            <h3 className="font-bold text-lg">{mockEarnings.monthly}</h3>
            <p className="text-sm text-gray-400">Monthly</p>
          </Card>
          <Card className="bg-gray-900/50 p-4 text-center border border-gray-800">
            <div className="text-2xl text-indigo-400 mb-1">📅</div>
            <h3 className="font-bold text-lg">{mockEarnings.weekly}</h3>
            <p className="text-sm text-gray-400">Weekly</p>
          </Card>
        </div>

        {/* Top Performing Datasets */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-amber-400 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Top Performing Datasets
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {mockTopPerforming.map((dataset) => (
              <Card key={dataset.id} className="bg-gray-900/50 p-4 border border-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold flex items-center gap-1">
                    <Database className="w-4 h-4 text-cyan-400" /> {dataset.title}
                  </h3>
                  <Badge variant="secondary" className="bg-amber-900/30 text-amber-400 border-amber-700">
                    {dataset.accesses} accesses
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-green-400">{dataset.earnings}</div>
                <p className="text-sm text-gray-400">Earned to date</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Rewards History */}
        <div>
          <div className="flex flex-wrap justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-amber-400">Rewards History</h2>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              <Button
                variant={filter === 'all' ? 'secondary' : 'ghost'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-amber-900/30 border border-amber-700' : 'border border-gray-700'}
              >
                All
              </Button>
              <Button
                variant={filter === 'completed' ? 'secondary' : 'ghost'}
                onClick={() => setFilter('completed')}
                className={filter === 'completed' ? 'bg-green-900/30 border border-green-700' : 'border border-gray-700'}
              >
                Completed
              </Button>
              <Button
                variant={filter === 'pending' ? 'secondary' : 'ghost'}
                onClick={() => setFilter('pending')}
                className={filter === 'pending' ? 'bg-yellow-900/30 border border-yellow-700' : 'border border-gray-700'}
              >
                Pending
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : filteredRewards.length === 0 ? (
            <Card className="bg-gray-900/50 p-12 text-center border border-gray-800">
              <div className="flex justify-center mb-6">
                <Coins className="w-16 h-16 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">No rewards yet</h3>
              <p className="text-gray-400 mb-4">
                Your rewards will appear here once your datasets are used.
              </p>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                Upload Dataset
              </Button>
            </Card>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-800">
              <table className="w-full text-sm">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="p-3 text-left text-gray-400 font-medium">Dataset</th>
                    <th className="p-3 text-left text-gray-400 font-medium">Amount</th>
                    <th className="p-3 text-left text-gray-400 font-medium">Type</th>
                    <th className="p-3 text-left text-gray-400 font-medium">Date</th>
                    <th className="p-3 text-left text-gray-400 font-medium">Status</th>
                    <th className="p-3 text-left text-gray-400 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRewards.map((reward) => (
                    <tr key={reward.id} className="border-b border-gray-800/50 hover:bg-gray-900/30">
                      <td className="p-3">
                        <div className="font-medium">{reward.datasetTitle}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-green-400">{reward.amount}</div>
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary" className="text-xs">
                          {reward.type.charAt(0).toUpperCase() + reward.type.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {format(reward.date, 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge 
                          className={`text-xs ${
                            reward.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                          }`}
                        >
                          {reward.status.charAt(0).toUpperCase() + reward.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button size="sm" variant="ghost" className="text-amber-400 hover:text-amber-300">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}