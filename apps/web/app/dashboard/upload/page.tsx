'use client';

import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ConnectButton } from '@mysten/dapp-kit';
import { UploadDropzone } from '../../../src/components/UploadDropzone';
import { toast } from 'react-hot-toast';
import { uploadFile } from '../../../src/lib/api';
import { Card } from '../../../src/components/ui/card';
import { createTruthAnchor } from '../../../src/lib/seal';

export default function UploadPage() {
  const account = useCurrentAccount();
  const [cid, setCid] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!title.trim()) {
      toast.error('Please enter a title for your dataset');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description for your dataset');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      toast.loading('Uploading file to decentralized storage...');

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadFile(file);

      clearInterval(interval);
      setUploadProgress(100);
      
      setCid(result.cid);
      toast.dismiss();
      toast.success('File uploaded successfully!');
      
      setTimeout(() => setUploadProgress(0), 2000);
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      toast.error(error instanceof Error ? error.message : 'Upload failed. Please try again.');
      console.error('Upload error:', error);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="p-8 text-center bg-gray-900 max-w-md w-full rounded-lg">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-cyan-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" x2="12" y1="3" y2="15"></line>
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">
            Please connect your Sui wallet to upload datasets
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
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Upload Dataset</h1>
        <ConnectButton>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 transition-all">
            {account ? 'Connected' : 'Connect Wallet'}
          </button>
        </ConnectButton>
      </header>

      <main className="p-4 lg:p-6">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Upload Dataset</h1>
          <p className="text-gray-400">
            Upload your dataset to decentralized storage (Walrus) and register on Sui blockchain
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-gray-900/50 p-6 border border-gray-800">
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">Dataset Title</label>
                <input
                  id="title"
                  type="text"
                  placeholder="E.g., Financial Transactions 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isUploading}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  id="description"
                  placeholder="Describe your dataset, its purpose, and content..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isUploading}
                  rows={4}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Upload File</label>
                <UploadDropzone
                  onFileUpload={handleFileUpload}
                  onUploadSuccess={setCid}
                  onUploadError={(error) => toast.error(error)}
                  disabled={isUploading}
                />
                
                {isUploading && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-cyan-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-cyan-400 mt-1">{uploadProgress}%</div>
                  </div>
                )}
              </div>

              {cid && (
                <div className="p-4 mt-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="font-medium">Upload Successful!</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-400">Content Identifier (CID)</p>
                    <p className="font-mono break-all text-cyan-400">{cid}</p>
                    <p className="text-sm text-gray-500 mt-2">This CID is your unique reference to the file on decentralized storage. You can use it to access your file anywhere.</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}