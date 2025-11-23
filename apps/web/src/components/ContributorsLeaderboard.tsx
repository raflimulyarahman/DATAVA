'use client';

import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { RewardTransaction } from '../lib/blockchain-events';

interface Contributor {
  address: string;
  totalEarnings: number;
  contributionCount: number;
  rank: number;
}

interface ContributorsLeaderboardProps {
  transactions: RewardTransaction[];
  limit?: number;
  currentUserAddress?: string;
}

export default function ContributorsLeaderboard({ 
  transactions, 
  limit = 10,
  currentUserAddress 
}: ContributorsLeaderboardProps) {
  // Aggregate transactions by contributor
  const contributorMap = new Map<string, Contributor>();

  transactions.forEach(tx => {
    const existing = contributorMap.get(tx.contributor);
    if (existing) {
      existing.totalEarnings += parseFloat(tx.amount);
      existing.contributionCount += 1;
    } else {
      contributorMap.set(tx.contributor, {
        address: tx.contributor,
        totalEarnings: parseFloat(tx.amount),
        contributionCount: 1,
        rank: 0
      });
    }
  });

  // Sort by total earnings and assign ranks
  const contributors = Array.from(contributorMap.values())
    .sort((a, b) => b.totalEarnings - a.totalEarnings)
    .slice(0, limit)
    .map((contributor, index) => ({
      ...contributor,
      rank: index + 1
    }));

  const truncateAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-400" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-gray-500 font-bold text-sm">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 2:
        return 'bg-gray-400/20 text-gray-300 border-gray-400/50';
      case 3:
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default:
        return 'bg-gray-700/20 text-gray-400 border-gray-700/50';
    }
  };

  return (
    <Card className="bg-gray-900/50 p-6 border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> Top Contributors
        </h2>
        <Badge className="bg-amber-900/30 text-amber-400 border-amber-700">
          Top {limit}
        </Badge>
      </div>

      <div className="space-y-3">
        {contributors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No contributors yet. Be the first!</p>
          </div>
        ) : (
          contributors.map((contributor) => {
            const isCurrentUser = currentUserAddress && contributor.address === currentUserAddress;
            
            return (
              <div
                key={contributor.address}
                className={`p-4 rounded-lg border transition-all ${
                  isCurrentUser 
                    ? 'bg-amber-900/20 border-amber-500/50 shadow-lg shadow-amber-500/10' 
                    : 'bg-gray-800/50 border-gray-700 hover:border-amber-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0">
                      {getRankIcon(contributor.rank)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-gray-300 truncate">
                          {truncateAddress(contributor.address)}
                        </span>
                        {isCurrentUser && (
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {contributor.contributionCount} contribution{contributor.contributionCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">
                        {contributor.totalEarnings.toFixed(4)}
                      </div>
                      <div className="text-xs text-gray-500">SUI</div>
                    </div>
                    
                    <Badge className={`${getRankBadgeColor(contributor.rank)} text-xs px-2 py-1`}>
                      #{contributor.rank}
                    </Badge>
                  </div>
                </div>

                {/* Progress bar showing relative performance */}
                {contributor.rank !== 1 && contributors[0] && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${(contributor.totalEarnings / contributors[0].totalEarnings) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {contributors.length >= limit && (
        <div className="mt-4 text-center">
          <button className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
            View Full Leaderboard →
          </button>
        </div>
      )}
    </Card>
  );
}
