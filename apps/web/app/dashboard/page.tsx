'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { ConnectButton, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { uploadFile, runInference } from '../../src/lib/api';
import { createContributeTx, createRecordUsageTx } from '../../src/lib/contract-interactions';
import { createTruthAnchor, verifyTruthAnchor, TruthScore } from '../../src/lib/seal';
import { UploadDropzone } from '../../src/components/UploadDropzone';

export default function DashboardPage() {
  const account = useCurrentAccount();
  const [cid, setCid] = useState('');
  const [sealHash, setSealHash] = useState('');
  const [truthScore, setTruthScore] = useState<number | null>(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // For transaction signing
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  // Handle file upload to backend service
  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      toast.loading('Uploading file to Walrus...');

      const result = await uploadFile(file);

      setCid(result.cid);
      setSealHash(''); // Reset SEAL info for new upload
      setTruthScore(null); // Reset truth score for new upload
      toast.dismiss();
      toast.success('File uploaded successfully!');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error instanceof Error ? error.message : 'Upload failed. Please try again.');
      console.error('Upload error:', error);
    }
  };

  // Handle AI inference via backend service
  const handleInference = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    try {
      setIsLoading(true);
      toast.loading('Running AI inference...');

      const result = await runInference(prompt, process.env.NEXT_PUBLIC_POOL_ID);

      setResponse(result.text);

      // Record usage on-chain after successful inference
      recordUsageOnChain(result.tokens || 100);

      toast.dismiss();
      toast.success('Inference completed!');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error instanceof Error ? error.message : 'Inference failed. Please try again.');
      console.error('Inference error:', error);
    }
  };

  // Record usage on-chain after inference
  const recordUsageOnChain = async (tokens: number) => {
    if (!process.env.NEXT_PUBLIC_PACKAGE_ID || !process.env.NEXT_PUBLIC_POOL_ID) {
      console.error('Package ID or Pool ID not configured');
      return;
    }

    try {
      // Create proper usage recording transaction
      const usageData = {
        version: 1, // Default version
        tokens: tokens,
        fee: 0 // For now, no fee is charged, could be calculated based on tokens used
      };

      const tx = createRecordUsageTx(
        process.env.NEXT_PUBLIC_PACKAGE_ID,
        process.env.NEXT_PUBLIC_POOL_ID,
        usageData
      );

      // Execute the transaction to record usage
      signAndExecuteTransaction({
        transaction: tx,
        chain: 'sui:testnet', // Use testnet as default
      }, {
        onSuccess: (result) => {
          console.log('Usage recorded successfully:', result);
        },
        onError: (error) => {
          console.error('Usage recording failed:', error);
          // Note: We don't show an error to user as this is background operation
          // The main functionality (inference) still worked
        }
      });
    } catch (error) {
      console.error('Error preparing usage recording:', error);
      // Note: We don't show an error to user as this is background operation
    }
  };

  // Handle contribution to the blockchain
  const handleContribute = async () => {
    // Validate CID format and length
    if (!cid?.trim()) {
      toast.error('Please provide a valid CID');
      return;
    }

    // Basic CID validation (IPFS/Walrus CIDs typically start with 'bafy' or 'Qm')
    if (!cid.startsWith('bafy') && !cid.startsWith('Qm')) {
      toast.error('Invalid CID format. CID should start with "bafy" or "Qm"');
      return;
    }

    // Check for potentially problematic characters and lengths
    if (cid.length > 1000) {
      toast.error('CID is too long. Please use a shorter CID.');
      return;
    }

    // Additional validation: make sure CID doesn't contain invalid characters
    const validCidRegex = /^[a-zA-Z0-9]+$/;
    if (!validCidRegex.test(cid.replace(/^[\w]+:/, ''))) {  // Allow for protocol prefixes like "ipfs://"
      toast.error('CID contains invalid characters.');
      return;
    }

    if (!account) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!process.env.NEXT_PUBLIC_PACKAGE_ID || !process.env.NEXT_PUBLIC_POOL_ID) {
      toast.error('Contract configuration not available');
      return;
    }

    try {
      setIsLoading(true);
      toast.loading('Preparing to contribute dataset with SEAL verification...');

      // Create truth anchor using SEAL protocol
      const sealProof = await createTruthAnchor(cid.trim(), {
        title: title,
        description: description,
        uploader: account.address,
        timestamp: Date.now(),
      });

      // Verify the truth anchor
      const truthScore: TruthScore = await verifyTruthAnchor(sealProof);

      // Create the transaction to contribute the dataset with SEAL data
      const tx = createContributeTx(
        process.env.NEXT_PUBLIC_PACKAGE_ID,
        process.env.NEXT_PUBLIC_POOL_ID,
        {
          blobCid: cid.trim(),
          license: 'MIT', // Default license, should be user-configurable in real app
          size: 0, // Size should come from the upload result in real app
          weight: 1, // Default weight, should be user-configurable in real app
          sealHash: sealProof.hash,
          truthScore: truthScore.score
        }
      );

      // Execute the transaction
      signAndExecuteTransaction({
        transaction: tx,
        chain: 'sui:testnet', // Use testnet as default
      }, {
        onSuccess: (result) => {
          toast.dismiss();
          toast.success(`Dataset contribution successful! Truth Score: ${truthScore.score}/100`);
          // Set the SEAL information so it displays in the UI
          setSealHash(sealProof.hash);
          setTruthScore(truthScore.score);
          console.log('Transaction result:', result);
          setIsLoading(false);
        },
        onError: (error) => {
          console.error('Transaction error:', error);
          toast.dismiss();
          toast.error('Contribution failed. Please try again.');
          setIsLoading(false);
        }
      });
    } catch (error) {
      setIsLoading(false);
      toast.error('Contribution failed. Please try again.');
      console.error('Contribution error:', error);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="p-8 text-center bg-gray-900 max-w-md w-full rounded-lg">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-cyan-900/30 flex items-center justify-center">
              <span className="text-cyan-400 text-2xl">📁</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">
            Please connect your Sui wallet to access the DATAVA marketplace
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
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">DATAVA Dashboard</h1>
        <ConnectButton>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 transition-all">
            {account ? 'Connected' : 'Connect Wallet'}
          </button>
        </ConnectButton>
      </header>

      <main className="p-4 lg:p-6">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Dashboard</h1>
          <p className="text-gray-400">
            Manage your datasets and interact with the DATAVA ecosystem
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload Section */}
          <div className="bg-gray-900/50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">📁 Upload Dataset</h2>
            <p className="text-gray-400 mb-4">
              Upload your dataset to decentralized storage (Walrus) and get a unique content identifier (CID)
            </p>

            <div className="space-y-4">
              <UploadDropzone
                onFileUpload={handleFileUpload}
                onUploadSuccess={setCid}
                onUploadError={(error) => toast.error(error)}
                disabled={isLoading}
              />

              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">Dataset Title</label>
                <input 
                  id="title" 
                  type="text"
                  placeholder="E.g., Financial Transactions 2024" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">Description</label>
                <textarea 
                  id="description" 
                  placeholder="Describe your dataset..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white min-h-[100px]"
                />
              </div>

              {cid && (
                <div className="p-4 mt-4 bg-blue-900/30 border border-blue-700 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400">✓</span>
                    <span className="font-medium">Upload Successful!</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-400">Content Identifier (CID)</p>
                    <p className="font-mono break-all text-cyan-400">{cid}</p>
                  </div>

                  {sealHash && truthScore !== null && (
                    <div className="mt-3 pt-3 border-t border-blue-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-400">🔒</span>
                        <span className="font-medium">SEAL Verification</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-400">Truth Score</p>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${truthScore >= 70 ? 'text-green-400' : truthScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {truthScore}/100
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              truthScore >= 70 ? 'bg-green-900/50 text-green-300' :
                              truthScore >= 50 ? 'bg-yellow-900/50 text-yellow-300' :
                              'bg-red-900/50 text-red-300'
                            }`}>
                              {truthScore >= 70 ? 'Trustworthy' :
                               truthScore >= 50 ? 'Moderate' : 'Low Trust'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-400">Verification Hash</p>
                          <p className="font-mono break-all text-xs text-purple-400 truncate">{sealHash}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleContribute}
                disabled={isLoading || !cid}
                className={`w-full px-4 py-2 rounded-lg font-bold ${
                  isLoading || !cid 
                    ? 'bg-gray-700 cursor-not-allowed opacity-50' 
                    : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700'
                }`}
              >
                {isLoading ? 'Processing...' : 'Register on Blockchain'}
              </button>
            </div>
          </div>

          {/* AI Inference Section */}
          <div className="bg-gray-900/50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-indigo-400">🤖 AI Inference</h2>
            <p className="text-gray-400 mb-4">
              Run GPT-4.1 inference on your data. The usage will be recorded on-chain for reward distribution.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="prompt" className="block text-sm font-medium">Inference Prompt</label>
                <textarea
                  id="prompt"
                  placeholder="Enter your prompt for AI inference..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white min-h-[120px]"
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={handleInference}
                disabled={isLoading || !prompt.trim()}
                className={`w-full px-4 py-2 rounded-lg font-bold ${
                  isLoading || !prompt.trim()
                    ? 'bg-gray-700 cursor-not-allowed opacity-50' 
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
                }`}
              >
                {isLoading ? 'Processing...' : 'Run Inference'}
              </button>

              {response && (
                <div className="p-4 mt-4 bg-gray-800/50 border border-indigo-700 rounded">
                  <h3 className="font-bold text-indigo-300 mb-2">Response:</h3>
                  <p className="text-gray-300 whitespace-pre-line">{response}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
          <div className="bg-gray-900/50 p-4 text-center rounded-lg">
            <div className="text-2xl text-cyan-400 mb-1">💰</div>
            <h3 className="font-bold text-lg">0.00</h3>
            <p className="text-sm text-gray-400">SUI Earned</p>
          </div>
          <div className="bg-gray-900/50 p-4 text-center rounded-lg">
            <div className="text-2xl text-pink-400 mb-1">📊</div>
            <h3 className="font-bold text-lg">1</h3>
            <p className="text-sm text-gray-400">Datasets</p>
          </div>
          <div className="bg-gray-900/50 p-4 text-center rounded-lg">
            <div className="text-2xl text-indigo-400 mb-1">⚡</div>
            <h3 className="font-bold text-lg">3</h3>
            <p className="text-sm text-gray-400">Inferences</p>
          </div>
          <div className="bg-gray-900/50 p-4 text-center rounded-lg">
            <div className="text-2xl text-purple-400 mb-1">📤</div>
            <h3 className="font-bold text-lg">1</h3>
            <p className="text-sm text-gray-400">Uploads</p>
          </div>
        </div>
      </main>
    </div>
  );
}