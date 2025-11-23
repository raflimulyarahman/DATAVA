'use client';

import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, TrendingUp, Database } from 'lucide-react';
import { RewardTransaction } from '../lib/blockchain-events';
import { formatDistanceToNow } from 'date-fns';

interface TransactionFeedProps {
  transactions: RewardTransaction[];
  limit?: number;
  showLiveIndicator?: boolean;
}

export default function TransactionFeed({ 
  transactions, 
  limit = 10,
  showLiveIndicator = true 
}: TransactionFeedProps) {
  const [animate, setAnimate] = useState<string | null>(null);
  const displayTransactions = transactions.slice(0, limit);

  // Animate new transactions
  useEffect(() => {
    if (transactions.length > 0) {
      const latestId = transactions[0].id;
      setAnimate(latestId);
      const timer = setTimeout(() => setAnimate(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [transactions]);

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    return num.toFixed(4);
  };

  const truncateAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Card className="bg-gray-900/50 p-6 border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> Live Transaction Feed
        </h2>
        {showLiveIndicator && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">Live</span>
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
        {displayTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No transactions yet. Upload a dataset to start earning!</p>
          </div>
        ) : (
          displayTransactions.map((tx) => (
            <div
              key={tx.id}
              className={`p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-amber-500/50 transition-all ${
                animate === tx.id ? 'animate-slideInRight border-green-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {tx.type === 'contribution' ? (
                    <Database className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  )}
                  <span className="font-medium text-gray-200">
                    {tx.type === 'contribution' ? 'Contribution' : 'Usage Reward'}
                  </span>
                </div>
                <Badge
                  className={`text-xs ${
                    tx.type === 'contribution'
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                      : 'bg-green-500/20 text-green-400 border-green-500/50'
                  }`}
                >
                  +{formatAmount(tx.amount)} SUI
                </Badge>
              </div>

              <div className="space-y-1 text-sm">
                {tx.datasetTitle && (
                  <div className="text-gray-400 truncate">
                    Dataset: <span className="text-gray-300">{tx.datasetTitle}</span>
                  </div>
                )}
                {tx.tokens && (
                  <div className="text-gray-400">
                    Tokens: <span className="text-gray-300">{tx.tokens}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs">
                    {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                  </span>
                  {tx.txDigest && (
                    <a
                      href={`https://testnet.suivision.xyz/txblock/${tx.txDigest}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.5);
        }
      `}</style>
    </Card>
  );
}
