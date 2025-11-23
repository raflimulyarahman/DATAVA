'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ConnectButton } from '@mysten/dapp-kit';
import { Card } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { 
  Database, 
  Eye, 
  Download, 
  EyeOff, 
  ExternalLink,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

// Mock data - nanti diganti dengan data dari API blockchain
const mockUserDatasets = [
  {
    id: 1,
    title: "Financial Transactions 2024",
    description: "Comprehensive dataset of financial transactions for 2024 with metadata",
    cid: "bafybeidsken34jfi34uifsdkfnslk34nfd",
    uploadDate: new Date(2024, 10, 15),
    size: "2.4 GB",
    license: "MIT",
    truthScore: 85,
    status: "verified", // verified, pending, rejected
    accessCount: 124,
    earnings: "2.35 SUI",
    category: "Finance"
  },
  {
    id: 2,
    title: "Healthcare Records Sample",
    description: "Anonymized healthcare records for research and AI training purposes",
    cid: "bafybeigkjerh34jk5h3jkhgkjfdhgkjh34",
    uploadDate: new Date(2024, 10, 12),
    size: "1.8 GB",
    license: "CC BY-NC",
    truthScore: 72,
    status: "verified",
    accessCount: 89,
    earnings: "1.80 SUI",
    category: "Healthcare"
  },
  {
    id: 3,
    title: "Social Media Sentiment",
    description: "Social media posts with sentiment analysis data",
    cid: "bafybeihdfjghd843hjdg8hjd8ghd8ghd8g",
    uploadDate: new Date(2024, 10, 10),
    size: "5.2 GB",
    license: "MIT",
    truthScore: 68,
    status: "pending",
    accessCount: 210,
    earnings: "0.95 SUI",
    category: "Social Media"
  }
];

export default function MyDatasetsPage() {
  const account = useCurrentAccount();
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, verified, pending, rejected

  useEffect(() => {
    // In real app, fetch from API or blockchain
    setTimeout(() => {
      setDatasets(mockUserDatasets);
      setLoading(false);
    }, 800);
  }, []);

  const filteredDatasets = filter === 'all' 
    ? datasets 
    : datasets.filter(dataset => dataset.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'verified': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="p-8 text-center bg-gray-900 max-w-md w-full rounded-lg">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-cyan-900/30 flex items-center justify-center">
              <Database className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">
            Please connect your Sui wallet to view your datasets
          </p>
          <ConnectButton>
            <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 transition-all">
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
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">My Datasets</h1>
        <ConnectButton>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 transition-all">
            {account ? 'Connected' : 'Connect Wallet'}
          </button>
        </ConnectButton>
      </header>

      <main className="p-4 lg:p-6">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">My Datasets</h1>
          <p className="text-gray-400">
            Manage and track your uploaded datasets
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card className="bg-gray-900/50 p-4 text-center border border-gray-800">
            <div className="text-2xl text-cyan-400 mb-1">📊</div>
            <h3 className="font-bold text-lg">{datasets.length}</h3>
            <p className="text-sm text-gray-400">Total Datasets</p>
          </Card>
          <Card className="bg-gray-900/50 p-4 text-center border border-gray-800">
            <div className="text-2xl text-green-400 mb-1">💰</div>
            <h3 className="font-bold text-lg">5.10 SUI</h3>
            <p className="text-sm text-gray-400">Total Earnings</p>
          </Card>
          <Card className="bg-gray-900/50 p-4 text-center border border-gray-800">
            <div className="text-2xl text-indigo-400 mb-1">⚡</div>
            <h3 className="font-bold text-lg">423</h3>
            <p className="text-sm text-gray-400">Total Accesses</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'secondary' : 'ghost'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-cyan-900/30 border border-cyan-700' : 'border border-gray-700'}
          >
            All Datasets
          </Button>
          <Button
            variant={filter === 'verified' ? 'secondary' : 'ghost'}
            onClick={() => setFilter('verified')}
            className={filter === 'verified' ? 'bg-green-900/30 border border-green-700' : 'border border-gray-700'}
          >
            Verified
          </Button>
          <Button
            variant={filter === 'pending' ? 'secondary' : 'ghost'}
            onClick={() => setFilter('pending')}
            className={filter === 'pending' ? 'bg-yellow-900/30 border border-yellow-700' : 'border border-gray-700'}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'rejected' ? 'secondary' : 'ghost'}
            onClick={() => setFilter('rejected')}
            className={filter === 'rejected' ? 'bg-red-900/30 border border-red-700' : 'border border-gray-700'}
          >
            Rejected
          </Button>
        </div>

        {/* Datasets List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : filteredDatasets.length === 0 ? (
          <Card className="bg-gray-900/50 p-12 text-center border border-gray-800">
            <div className="flex justify-center mb-6">
              <Database className="w-16 h-16 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">No datasets found</h3>
            <p className="text-gray-400 mb-4">
              You haven't uploaded any datasets yet.
            </p>
            <Button className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600">
              Upload Dataset
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDatasets.map((dataset) => (
              <Card key={dataset.id} className="bg-gray-900/50 border border-gray-800 overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-cyan-400" /> {dataset.title}
                      </h3>
                      <span className="text-sm text-gray-400">{dataset.category}</span>
                    </div>
                    <Badge className={`${getStatusColor(dataset.status)} flex items-center gap-1`}>
                      {getStatusIcon(dataset.status)} {dataset.status.charAt(0).toUpperCase() + dataset.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{dataset.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Size</span>
                      <span>{dataset.size}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">License</span>
                      <span>{dataset.license}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Access Count</span>
                      <span>{dataset.accessCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Truth Score</span>
                      <span className={`font-bold ${dataset.truthScore >= 70 ? 'text-green-400' : dataset.truthScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {dataset.truthScore}/100
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Upload Date</span>
                      <span>{format(dataset.uploadDate, 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-400">{dataset.earnings}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-cyan-700 text-cyan-400 hover:bg-cyan-900/30">
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                        <Button size="sm" variant="outline" className="border-purple-700 text-purple-400 hover:bg-purple-900/30">
                          <ExternalLink className="w-4 h-4 mr-1" /> CID
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}