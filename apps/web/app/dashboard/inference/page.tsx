'use client';

import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ConnectButton } from '@mysten/dapp-kit';
import { Card } from '../../../src/components/ui/card';
import { Button } from '../../../src/components/ui/button';
import { toast } from 'react-hot-toast';
import { runInference } from '../../../src/lib/api';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { createRecordUsageTx } from '../../../src/lib/contract-interactions';

export default function InferencePage() {
  const account = useCurrentAccount();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4.1');
  const [history, setHistory] = useState([
    { id: 1, prompt: "Analyze this financial dataset", response: "The dataset shows interesting patterns in Q3...", timestamp: new Date(Date.now() - 3600000) },
    { id: 2, prompt: "Summarize the healthcare records", response: "The records show significant trends in patient recovery...", timestamp: new Date(Date.now() - 86400000) }
  ]);

  // For transaction signing
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleInference = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    try {
      setIsLoading(true);
      setResponse('');
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

  if (!account) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="p-8 text-center bg-gray-900 max-w-md w-full rounded-lg">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">
            Please connect your Sui wallet to use AI inference
          </p>
          <ConnectButton>
            <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all">
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
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">AI Inference</h1>
        <ConnectButton>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-500 transition-all">
            {account ? 'Connected' : 'Connect Wallet'}
          </button>
        </ConnectButton>
      </header>

      <main className="p-4 lg:p-6">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">AI Inference</h1>
          <p className="text-gray-400">
            Run advanced AI models on your datasets
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Inference Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-900/50 p-6 border border-gray-800">
              <div className="space-y-4">
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">AI Model</label>
                  <select
                    id="model"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
                  >
                    <option value="gpt-4.1">GPT-4.1 (Advanced)</option>
                    <option value="gpt-3.5">GPT-3.5 (Standard)</option>
                    <option value="claude">Claude (Specialized)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Your Prompt</label>
                  <textarea
                    id="prompt"
                    placeholder="Enter your prompt for AI inference..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  onClick={handleInference}
                  disabled={isLoading || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {isLoading ? 'Processing...' : 'Run Inference'}
                </Button>

                {response && (
                  <div className="p-4 mt-4 bg-gray-800/50 border border-indigo-700 rounded-lg">
                    <h3 className="font-bold text-indigo-300 mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      Response:
                    </h3>
                    <div className="text-gray-300 whitespace-pre-line">
                      {response}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* History Panel */}
          <div>
            <Card className="bg-gray-900/50 p-6 border border-gray-800 h-full">
              <h2 className="text-xl font-bold mb-4 text-indigo-400">Recent Inferences</h2>
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="text-sm text-gray-400 mb-1">
                      {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="font-medium text-gray-200 truncate">{item.prompt}</div>
                    <div className="text-sm text-gray-500 truncate mt-1">{item.response}</div>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No inference history yet</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}