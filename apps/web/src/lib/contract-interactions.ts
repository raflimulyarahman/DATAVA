// contract-interactions.ts - Helper functions for interacting with Sui contracts
import { Transaction } from '@mysten/sui/transactions';
// Lightweight BCS `string` serializer to avoid importing the full @mysten/sui.js/bcs
// on the client (which can cause bundler/module resolution issues). Move
// `string` in BCS is encoded as a LEB128 length followed by UTF-8 bytes.
const bcsSerializeString = (s: string): Uint8Array => {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(s);

  // LEB128 unsigned encoding for length
  let len = bytes.length;
  const lenBytes: number[] = [];
  while (len >= 0x80) {
    lenBytes.push((len & 0x7f) | 0x80);
    len = len >> 7;
  }
  lenBytes.push(len & 0x7f);

  const out = new Uint8Array(lenBytes.length + bytes.length);
  out.set(new Uint8Array(lenBytes), 0);
  out.set(bytes, lenBytes.length);
  return out;
};

export interface ContributionData {
  blobCid: string;
  license: string;
  size: number;
  weight: number;
  sealHash: string;
  truthScore: number;
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

  // Validate and sanitize string inputs to ensure they're properly encoded for Sui transactions
  const sanitizedCid = typeof contribution.blobCid === 'string' ? contribution.blobCid.trim().substring(0, 256) : undefined;
  const sanitizedLicense = typeof contribution.license === 'string' ? contribution.license.trim().substring(0, 128) : undefined;
  const sanitizedSealHash = typeof contribution.sealHash === 'string' ? contribution.sealHash.trim().substring(0, 255) : undefined;

  // Validate that required fields are not empty after sanitization
  if (!sanitizedCid || !sanitizedLicense || !sanitizedSealHash) {
    throw new Error('Invalid contribution data: CID, license, and seal hash are required');
  }

  // Validate truth score is within valid u8 range (0-255)
  if (contribution.truthScore < 0 || contribution.truthScore > 255) {
    throw new Error('Truth score must be between 0 and 255');
  }

  // Extra validation: ensure sanitizedCid is a normal short string before encoding
  if (typeof sanitizedCid !== 'string') {
    throw new Error('Invalid contribution data: CID must be a string');
  }

  // Further normalize CID: remove protocol prefixes (ipfs://, https://),
  // strip any non-printable or non-ASCII characters, and limit to safe charset.
  const normalizeCid = (c: string) => {
    // Remove protocol (e.g. ipfs://) and any leading slashes
    let s = c.replace(/^[a-zA-Z0-9]+:\/\//, '').replace(/^\/+/, '');
    // Keep only common CID characters (alphanumeric and - _ .)
    s = s.normalize('NFKC').replace(/[^a-zA-Z0-9._-]/g, '');
    // Final truncate to 128 chars to be extra-safe for the Sui encoder
    return s.substring(0, 128);
  };

  const normalizedCid = normalizeCid(sanitizedCid);
  if (!normalizedCid) {
    throw new Error('Invalid contribution data: CID is empty after normalization');
  }

  // Debug: log sanitized values to help diagnose encoding/length issues
  try {
  // Log minimal identifying information (avoid logging full CID in prod)
  // This helps catch cases where the string is unexpectedly huge or not a string
  // eslint-disable-next-line no-console
  console.debug('createContributeTx: normalizedCid length=', (normalizedCid as string).length);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.debug('createContributeTx: unable to read sanitizedCid length', e);
  }

  // Wrap moveCall to surface RangeError with additional context
  try {
    // Serialize all string arguments using BCS as Move `string` bytes.
    // This bypasses the SDK's `pure.string` path which previously hit the
    // BCS ulebEncode error in some environments. We pass the raw serialized
    // bytes into `tx.pure(...)` which avoids the internal string-path.
    const cidBcs = bcsSerializeString(normalizedCid);
    const licenseBcs = bcsSerializeString(sanitizedLicense as string);
    const sealBcs = bcsSerializeString(sanitizedSealHash as string);

    // Detailed per-argument serialization logging to pinpoint where BCS fails
    let cidArg: any;
    let licenseArg: any;
    let sealArg: any;

    try {
      // eslint-disable-next-line no-console
      console.debug('createContributeTx: preparing cidArg', { type: typeof cidBcs, byteLength: cidBcs.length });
      cidArg = tx.pure(cidBcs);
      // eslint-disable-next-line no-console
      console.debug('createContributeTx: cidArg ok');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('createContributeTx: tx.pure(cidBcs) failed', { err: e, cidPreview: normalizedCid.substring(0, 64), cidLen: normalizedCid.length });
      throw e;
    }

    try {
      // eslint-disable-next-line no-console
      console.debug('createContributeTx: preparing licenseArg', { licenseLen: (sanitizedLicense as string).length });
      licenseArg = tx.pure(licenseBcs);
      // eslint-disable-next-line no-console
      console.debug('createContributeTx: licenseArg ok');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('createContributeTx: tx.pure(licenseBcs) failed', { err: e, licensePreview: (sanitizedLicense as string).substring(0, 64) });
      throw e;
    }

    try {
      // eslint-disable-next-line no-console
      console.debug('createContributeTx: preparing sealArg', { type: typeof sealBcs, byteLength: sealBcs.length });
      sealArg = tx.pure(sealBcs);
      // eslint-disable-next-line no-console
      console.debug('createContributeTx: sealArg ok');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('createContributeTx: tx.pure(sealBcs) failed', { err: e, sealPreview: (sanitizedSealHash as string).substring(0, 64) });
      throw e;
    }

    tx.moveCall({
      target: `${packageId}::core::contribute`,
      arguments: [
        tx.object(poolId), // mutable reference to the pool object
        cidArg,
        licenseArg,
        tx.pure.u64(contribution.size),
        tx.pure.u64(contribution.weight),
        sealArg,
        tx.pure.u8(contribution.truthScore),
      ],
    });
  } catch (err: any) {
    // Capture error details explicitly (console.error doesn't serialize Error well in browser)
    const errorDetails = {
      type: err?.constructor?.name || 'Unknown',
      message: err instanceof Error ? err.message : String(err),
      toString: String(err),
      normalizedCidPreview: normalizedCid.substring(0, 64),
      normalizedCidLength: normalizedCid.length,
    };

    // Log to console for debugging
    // eslint-disable-next-line no-console
    console.error('createContributeTx: moveCall failed', errorDetails);
    // Also try to log the full stack
    if (err instanceof Error && err.stack) {
      // eslint-disable-next-line no-console
      console.error('createContributeTx error stack:', err.stack);
    }

    // If the Sui SDK throws a RangeError (e.g. invalid array length), add context
    if (err instanceof RangeError) {
      const len = normalizedCid.length;
      const orig = err.message || String(err);
      throw new RangeError(
        `RangeError in createContributeTx when encoding CID (length=${len}): ${orig}`
      );
    }
    throw err;
  }

  return tx;
};

/**
 * Create a transaction to verify a contribution using SEAL
 */
export const createVerifyContributionTx = (
  packageId: string,
  poolId: string,
  contributionId: string,
  newSealHash: string,
  newTruthScore: number
): Transaction => {
  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::core::verify_contribution`,
    arguments: [
      tx.object(contributionId),
      tx.pure.string(newSealHash),
      tx.pure.u8(newTruthScore),
      tx.object(poolId),  // mutable reference to the pool object
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