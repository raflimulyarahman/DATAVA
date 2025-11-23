// api.ts - API service for interacting with backend services
import axios from 'axios';

// Get backend service URLs from environment variables with production fallbacks
const getWalrusRelayUrl = () => {
  // In production, use Vercel-deployed service or public relay
  if (process.env.NEXT_PUBLIC_WALRUS_RELAY) {
    return process.env.NEXT_PUBLIC_WALRUS_RELAY;
  }
  
  // Fallback for development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5051';
  }
  
  // Production fallback: direct to Walrus testnet aggregator
  return 'https://aggregator.walrus-testnet.walrus.space';
};

const getInferenceUrl = () => {
  // In production, use Vercel-deployed service
  if (process.env.NEXT_PUBLIC_INFERENCE_URL) {
    return process.env.NEXT_PUBLIC_INFERENCE_URL;
  }
  
  // Fallback for development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5052';
  }
  
  // Production fallback: needs to be deployed or use mock
  return ''; // Will be set when backend is deployed
};

const WALRUS_RELAY = getWalrusRelayUrl();
const INFERENCE_URL = getInferenceUrl();

// Create axios instances for each service
const ingestionApi = axios.create({
  baseURL: WALRUS_RELAY,
  timeout: 30000, // 30 second timeout
});

const inferenceApi = axios.create({
  baseURL: INFERENCE_URL,
  timeout: 60000, // 60 second timeout for inference
});

/**
 * Upload a file to the ingestion service
 */
export const uploadFile = async (file: File): Promise<{ cid: string; filename: string; size: number }> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Check if we're using direct Walrus aggregator (production fallback)
    if (WALRUS_RELAY.includes('walrus-testnet.walrus.space')) {
      // Direct upload to Walrus aggregator
      const response = await axios.put(`${WALRUS_RELAY}/v1/store`, file, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        timeout: 60000,
      });

      // Walrus returns blob ID in different format
      const blobId = response.data?.newlyCreated?.blobObject?.blobId || 
                     response.data?.alreadyCertified?.blobId;
      
      if (!blobId) {
        throw new Error('Failed to get blob ID from Walrus');
      }

      return {
        cid: blobId,
        filename: file.name,
        size: file.size,
      };
    }

    // Use custom ingestion service
    const response = await ingestionApi.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Run inference using the AI service
 */
export const runInference = async (
  input: string,
  poolId?: string,
  metadata?: Record<string, any>
): Promise<{ text: string; tokens: number; model?: string; poolId?: string }> => {
  // Check if inference service is available
  if (!INFERENCE_URL) {
    throw new Error('Inference service not available in production yet. Please set NEXT_PUBLIC_INFERENCE_URL environment variable.');
  }

  try {
    const response = await inferenceApi.post('/infer', {
      input,
      poolId,
      metadata,
    });

    return response.data;
  } catch (error) {
    console.error('Inference error:', error);
    throw new Error(`Inference failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Export API URLs for debugging
export const getApiUrls = () => ({
  walrusRelay: WALRUS_RELAY,
  inferenceUrl: INFERENCE_URL,
});
