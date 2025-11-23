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
  Wallet, 
  DollarSign,
  Zap,
  RefreshCw
} from 'lucide-react';
import TransactionFeed from '../../../src/components/TransactionFeed';
import EarningsChart from '../../../src/components/EarningsChart';
import ContributorsLeaderboard from '../../../src/components/ContributorsLeaderboard';
import { 
  fetchRewardTransactions, 
  calculateEarnings, 
  getEarningsChartData,
  fetchSuiPrice,
  subscribeToEvents,
  RewardTransaction
} from '../../../src/lib/blockchain-events';
import { toast } from 'react-hot-toast';

export default function RewardsPage() {
  const account = useCurrentAccount();
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [suiPrice, setSuiPrice] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID || '';
  
  // Calculate earnings from transactions
  const earnings = calculateEarnings(transactions);
  const chartData = getEarningsChartData(transactions);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      if (!packageId) {
        console.error('Package ID not configured');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [txs, price] = await Promise.all([
          fetchRewardTransactions(packageId, account?.address),
          fetchSuiPrice()
        ]);
        
        setTransactions(txs);
        setSuiPrice(price);
      } catch (error) {
        console.error('Error loading rewards data:', error);
        toast.error('Failed to load rewards data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [packageId, account?.address]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!packageId) return;

    const unsubscribe = subscribeToEvents(
      packageId,
      (newTransactions) => {
        setTransactions(newTransactions);
      },
      15000 // Poll every 15 seconds
    );

    return unsubscribe;
  }, [packageId]);

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [txs, price] = await Promise.all([
        fetchRewardTransactions(packageId, account?.address),
        fetchSuiPrice()
      ]);
      setTransactions(txs);
      setSuiPrice(price);
      toast.success('Data refreshed!');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const formatUSD = (suiAmount: string) => {
    const sui = parseFloat(suiAmount);
    const usd = sui * suiPrice;
    return usd > 0 ? `$${usd.toFixed(2)}` : '$0.00';
  };

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
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Real-Time Rewards Dashboard
            </h1>
            <p className="text-gray-400">
              Track your earnings from dataset usage on-chain
            </p>
          </div>
          
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
            <p className="text-gray-400">Loading blockchain data...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards with USD Conversion */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 p-6 border border-amber-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <Wallet className="w-8 h-8 text-amber-400" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Total Earned</p>
                    <h3 className="font-bold text-2xl text-amber-400">{earnings.total} SUI</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">{formatUSD(earnings.total)}</span>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6 border border-green-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Monthly</p>
                    <h3 className="font-bold text-2xl text-green-400">{earnings.monthly} SUI</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 font-medium">{formatUSD(earnings.monthly)}</span>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 p-6 border border-cyan-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <Coins className="w-8 h-8 text-cyan-400" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Weekly</p>
                    <h3 className="font-bold text-2xl text-cyan-400">{earnings.weekly} SUI</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-medium">{formatUSD(earnings.weekly)}</span>
                </div>
              </Card>
            </div>

            {/* Earnings Chart */}
            <div className="mb-6">
              <EarningsChart data={chartData} type="area" />
            </div>

            {/* Two Column Layout: Transaction Feed + Leaderboard */}
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              <TransactionFeed transactions={transactions} limit={10} />
              <ContributorsLeaderboard 
                transactions={transactions} 
                limit={10}
                currentUserAddress={account?.address}
              />
            </div>

            {/* Empty State */}
            {transactions.length === 0 && (
              <Card className="bg-gray-900/50 p-12 text-center border border-gray-800">
                <div className="flex justify-center mb-6">
                  <Coins className="w-16 h-16 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">No rewards yet</h3>
                <p className="text-gray-400 mb-6">
                  Your rewards will appear here once your datasets are used for AI inference.
                </p>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  Upload Your First Dataset
                </Button>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}