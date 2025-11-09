// datava-sdk.ts - A basic SDK for interacting with the DATAVA contracts
import { Transaction } from '@mysten/sui/transactions';

export class DatavaSDK {
  private packageId: string;
  private poolId: string;

  constructor(packageId: string, poolId: string) {
    this.packageId = packageId;
    this.poolId = poolId;
  }

  /**
   * Creates a transaction to contribute a dataset to the pool
   */
  contributeTx(blobCid: string, license: string, size: number, weight: number) {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${this.packageId}::core::contribute`,
      arguments: [
        tx.object(this.poolId),  // mutable reference to the pool object
        tx.pure.string(blobCid),
        tx.pure.string(license),
        tx.pure.u64(size),
        tx.pure.u64(weight),
      ],
    });

    return tx;
  }

  /**
   * Creates a transaction to record usage of the marketplace
   */
  recordUsageTx(version: number, tokens: number, fee: number) {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${this.packageId}::core::record_usage`,
      arguments: [
        tx.object(this.poolId),  // mutable reference to the pool object
        tx.pure.u64(version),
        tx.pure.u64(tokens),
        tx.pure.u64(fee),
      ],
    });

    return tx;
  }

  /**
   * Creates a transaction to publish a model
   */
  publishModelTx(name: string, description: string) {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${this.packageId}::core::publish_model`,
      arguments: [
        tx.object(this.poolId),  // mutable reference to the pool object
        tx.pure.string(name),
        tx.pure.string(description),
      ],
    });

    return tx;
  }

  /**
   * Creates a transaction to create a new pool
   */
  createPoolTx() {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${this.packageId}::core::create_pool`,
    });

    return tx;
  }
}