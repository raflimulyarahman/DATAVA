// storage.ts - Client-side storage for uploaded datasets
// Uses localStorage for persistence across sessions

export interface Dataset {
  id: string;
  title: string;
  description: string;
  cid: string;
  filename: string;
  size: number;
  uploadDate: string;
  owner: string;
  status: 'verified' | 'pending' | 'rejected';
  category?: string;
  license?: string;
  truthScore?: number;
  accessCount: number;
  earnings: string;
}

const STORAGE_KEY = 'datava_datasets';

/**
 * Get all datasets from localStorage
 */
export const getStoredDatasets = (): Dataset[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading datasets from storage:', error);
    return [];
  }
};

/**
 * Save a new dataset to localStorage
 */
export const saveDataset = (dataset: Omit<Dataset, 'id' | 'uploadDate' | 'accessCount' | 'earnings' | 'status'>): Dataset => {
  const datasets = getStoredDatasets();
  
  const newDataset: Dataset = {
    ...dataset,
    id: `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    uploadDate: new Date().toISOString(),
    status: 'pending',
    accessCount: 0,
    earnings: '0.00 SUI',
  };
  
  datasets.push(newDataset);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datasets));
    return newDataset;
  } catch (error) {
    console.error('Error saving dataset to storage:', error);
    throw new Error('Failed to save dataset');
  }
};

/**
 * Get datasets for a specific owner (wallet address)
 */
export const getDatasetsByOwner = (owner: string): Dataset[] => {
  const datasets = getStoredDatasets();
  return datasets.filter(ds => ds.owner === owner);
};

/**
 * Get a single dataset by ID
 */
export const getDatasetById = (id: string): Dataset | undefined => {
  const datasets = getStoredDatasets();
  return datasets.find(ds => ds.id === id);
};

/**
 * Update a dataset
 */
export const updateDataset = (id: string, updates: Partial<Dataset>): Dataset | null => {
  const datasets = getStoredDatasets();
  const index = datasets.findIndex(ds => ds.id === id);
  
  if (index === -1) return null;
  
  datasets[index] = { ...datasets[index], ...updates };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datasets));
    return datasets[index];
  } catch (error) {
    console.error('Error updating dataset:', error);
    return null;
  }
};

/**
 * Delete a dataset
 */
export const deleteDataset = (id: string): boolean => {
  const datasets = getStoredDatasets();
  const filtered = datasets.filter(ds => ds.id !== id);
  
  if (filtered.length === datasets.length) return false;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting dataset:', error);
    return false;
  }
};

/**
 * Get summary statistics for user's datasets
 */
export const getDatasetStats = (owner: string) => {
  const datasets = getDatasetsByOwner(owner);
  
  const totalEarnings = datasets.reduce((sum, ds) => {
    const earnings = parseFloat(ds.earnings.replace(' SUI', '')) || 0;
    return sum + earnings;
  }, 0);
  
  const totalAccess = datasets.reduce((sum, ds) => sum + ds.accessCount, 0);
  
  return {
    totalDatasets: datasets.length,
    verifiedDatasets: datasets.filter(ds => ds.status === 'verified').length,
    pendingDatasets: datasets.filter(ds => ds.status === 'pending').length,
    totalEarnings: `${totalEarnings.toFixed(2)} SUI`,
    totalAccessCount: totalAccess,
  };
};
