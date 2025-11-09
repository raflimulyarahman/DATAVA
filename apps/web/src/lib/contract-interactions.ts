// contract-interactions.ts - Helper functions for interacting with Sui contracts
import { Transaction } from '@mysten/sui/transactions';

export interface ContributionData {
  blobCid: string;
  license: string;
  size: number;
  weight: number;
}

export interface UsageData {
  version: number;
  tokens: number;
  fee: number;
}

export interface ModelData {
  name: string;
  description: string;
}

/**
 * Create a transaction to contribute a dataset to the pool
 */
export const createContributeTx = (
  packageId: string,
  poolId: string,
  contribution: ContributionData
): Transaction => {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${packageId}::core::contribute`,
    arguments: [
      tx.object(poolId),  // mutable reference to the pool object
      tx.pure.string(contribution.blobCid),
      tx.pure.string(contribution.license),
      tx.pure.u64(contribution.size),
      tx.pure.u64(contribution.weight),
    ],
  });

  return tx;
};

/**
 * Create a transaction to record usage
 */
export const createRecordUsageTx = (
  packageId: string,
  poolId: string,
  usage: UsageData
): Transaction => {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${packageId}::core::record_usage`,
    arguments: [
      tx.object(poolId),  // mutable reference to the pool object
      tx.pure.u64(usage.version),
      tx.pure.u64(usage.tokens),
      tx.pure.u64(usage.fee),
    ],
  });

  return tx;
};

/**
 * Create a transaction to publish a model
 */
export const createPublishModelTx = (
  packageId: string,
  poolId: string,
  model: ModelData
): Transaction => {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${packageId}::core::publish_model`,
    arguments: [
      tx.object(poolId),  // mutable reference to the pool object
      tx.pure.string(model.name),
      tx.pure.string(model.description),
    ],
  });

  return tx;
};