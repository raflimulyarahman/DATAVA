// api.ts - API service for interacting with backend services
import axios from 'axios';

// Get backend service URLs from environment variables
const WALRUS_RELAY = process.env.NEXT_PUBLIC_WALRUS_RELAY || 'http://localhost:5051';
const INFERENCE_URL = process.env.NEXT_PUBLIC_INFERENCE_URL || 'http://localhost:5052';

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