// blockchain-events.ts - Service for listening to blockchain events
import { SuiClient, SuiEvent } from '@mysten/sui/client';

const SUI_TESTNET_RPC = 'https://fullnode.testnet.sui.io:443';

export interface ContributionEvent {
  contributionId: string;
  blobCid: string;
  contributor: string;
  poolId: string;
  timestamp: number;
  sealHash: string;
  truthScore: number;
}

export interface UsageEvent {
  poolId: string;
  version: number;
  tokens: number;
  fee: number;
  requester: string;
  timestamp: number;
}

export interface RewardTransaction {
  id: string;
  type: 'contribution' | 'usage';
  contributor: string;
  amount: string;
  timestamp: Date;
  datasetTitle?: string;
  tokens?: number;
  txDigest?: string;
}

/**
 * Create a Sui client for blockchain interactions
 */
export const createSuiClient = (): SuiClient => {
  return new SuiClient({ url: SUI_TESTNET_RPC });
};

/**
 * Fetch contribution events from the blockchain
 */
export const fetchContributionEvents = async (
  packageId: string,
  limit: number = 50
): Promise<ContributionEvent[]> => {
  const client = createSuiClient();
  
  try {
    const events = await client.queryEvents({
      query: {
        MoveEventType: `${packageId}::core::EContributed`
      },
      limit,
      order: 'descending'
    });

    return events.data.map((event: SuiEvent) => {
      const parsedJson = event.parsedJson as any;
      return {
        contributionId: parsedJson.contribution_id || '',
        blobCid: parsedJson.blob_cid || '',
        contributor: parsedJson.contributor || '',
        poolId: parsedJson.pool_id || '',
        timestamp: parsedJson.timestamp || 0,
        sealHash: parsedJson.seal_hash || '',
        truthScore: parsedJson.truth_score || 0,
      };
    });
  } catch (error) {
    console.error('Error fetching contribution events:', error);
    return [];
  }
};

/**
 * Fetch usage events from the blockchain
 */
export const fetchUsageEvents = async (
  packageId: string,
  limit: number = 50
): Promise<UsageEvent[]> => {
  const client = createSuiClient();
  
  try {
    const events = await client.queryEvents({
      query: {
        MoveEventType: `${packageId}::core::EUsageRecorded`
      },
      limit,
      order: 'descending'
    });

    return events.data.map((event: SuiEvent) => {
      const parsedJson = event.parsedJson as any;
      return {
        poolId: parsedJson.pool_id || '',
        version: parsedJson.version || 0,
        tokens: parsedJson.tokens || 0,
        fee: parsedJson.fee || 0,
        requester: parsedJson.requester || '',
        timestamp: parsedJson.timestamp || 0,
      };
    });
  } catch (error) {
    console.error('Error fetching usage events:', error);
    return [];
  }
};

/**
 * Combine contribution and usage events into reward transactions
 */
export const fetchRewardTransactions = async (
  packageId: string,
  userAddress?: string
): Promise<RewardTransaction[]> => {
  const [contributions, usages] = await Promise.all([
    fetchContributionEvents(packageId, 100),
    fetchUsageEvents(packageId, 100)
  ]);

  const transactions: RewardTransaction[] = [];

  // Process contributions
  contributions.forEach((contrib, index) => {
    if (!userAddress || contrib.contributor === userAddress) {
      transactions.push({
        id: `contrib-${contrib.contributionId}-${index}`,
        type: 'contribution',
        contributor: contrib.contributor,
        amount: '0.1', // Base contribution reward
        timestamp: new Date(contrib.timestamp * 1000),
        datasetTitle: `Dataset ${contrib.blobCid.substring(0, 8)}...`,
        txDigest: contrib.contributionId
      });
    }
  });

  // Process usage events (rewards distributed to contributors)
  usages.forEach((usage, index) => {
    // Calculate reward based on tokens used (simplified)
    const rewardAmount = (usage.tokens * 0.0001).toFixed(4);
    
    if (!userAddress || usage.requester === userAddress) {
      transactions.push({
        id: `usage-${usage.poolId}-${index}`,
        type: 'usage',
        contributor: usage.requester,
        amount: rewardAmount,
        timestamp: new Date(usage.timestamp * 1000),
        tokens: usage.tokens,
        txDigest: usage.poolId
      });
    }
  });

  // Sort by timestamp descending
  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

/**
 * Calculate total earnings from transactions
 */
export const calculateEarnings = (transactions: RewardTransaction[]) => {
  const total = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const weekly = transactions
    .filter(tx => tx.timestamp >= weekAgo)
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const monthly = transactions
    .filter(tx => tx.timestamp >= monthAgo)
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  return {
    total: total.toFixed(4),
    monthly: monthly.toFixed(4),
    weekly: weekly.toFixed(4)
  };
};

/**
 * Get earnings chart data for the last 30 days
 */
export const getEarningsChartData = (transactions: RewardTransaction[]) => {
  const now = new Date();
  const chartData: { date: string; earnings: number }[] = [];

  // Generate last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayEarnings = transactions
      .filter(tx => {
        const txDate = tx.timestamp.toISOString().split('T')[0];
        return txDate === dateStr;
      })
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    chartData.push({
      date: dateStr,
      earnings: parseFloat(dayEarnings.toFixed(4))
    });
  }

  return chartData;
};

/**
 * Fetch SUI to USD price from CoinGecko
 */
export const fetchSuiPrice = async (): Promise<number> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd');
    const data = await response.json();
    return data.sui?.usd || 0;
  } catch (error) {
    console.error('Error fetching SUI price:', error);
    return 0;
  }
};

/**
 * Subscribe to real-time events (using polling for now, can be upgraded to WebSocket)
 */
export const subscribeToEvents = (
  packageId: string,
  callback: (transactions: RewardTransaction[]) => void,
  intervalMs: number = 10000 // Poll every 10 seconds
) => {
  const poll = async () => {
    const transactions = await fetchRewardTransactions(packageId);
    callback(transactions);
  };

  // Initial fetch
  poll();

  // Set up polling
  const intervalId = setInterval(poll, intervalMs);

  // Return cleanup function
  return () => clearInterval(intervalId);
};
