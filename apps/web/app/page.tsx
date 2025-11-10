'use client';

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import Link from 'next/link';

export default function Home() {
  const currentAccount = useCurrentAccount();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-gray-800 px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">DATAVA</h1>
        </div>
        <ConnectButton>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 transition-all">
            {currentAccount ? 'Connected' : 'Connect Wallet'}
          </button>
        </ConnectButton>
      </header>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">Decentralized AI </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Data Marketplace</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10">
            Upload datasets to decentralized storage, register them on Sui blockchain, run AI inference, and earn rewards when your data powers AI models.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={currentAccount ? "/dashboard" : "#"} passHref>
              <button 
                className={`px-8 py-4 rounded-lg font-bold text-lg ${
                  currentAccount 
                    ? 'bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 transform hover:scale-105' 
                    : 'bg-gray-700 cursor-not-allowed opacity-50'
                } transition-all`}
                disabled={!currentAccount}
              >
                {currentAccount ? 'Go to Dashboard' : 'Connect Wallet to Start'}
              </button>
            </Link>
            
            {!currentAccount && (
              <ConnectButton>
                <button 
                  className="px-8 py-4 rounded-lg font-bold text-lg border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                >
                  Learn More
                </button>
              </ConnectButton>
            )}
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900/50 p-6 rounded-lg text-center">
            <div className="w-12 h-12 rounded-full bg-cyan-900/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-cyan-400 text-2xl">📁</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-cyan-400">Upload Data</h3>
            <p className="text-gray-400">
              Store your datasets on Walrus decentralized storage for secure, permanent access.
            </p>
          </div>
          
          <div className="bg-gray-900/50 p-6 rounded-lg text-center">
            <div className="w-12 h-12 rounded-full bg-pink-900/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-pink-500 text-2xl">⛓️</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-pink-400">On-chain Registration</h3>
            <p className="text-gray-400">
              Register your datasets on Sui blockchain to establish ownership and earn rewards.
            </p>
          </div>
          
          <div className="bg-gray-900/50 p-6 rounded-lg text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-indigo-400 text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-indigo-400">AI Inference</h3>
            <p className="text-gray-400">
              Run GPT-4.1 inference on your datasets and track usage on-chain for payments.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>Powered by Sui Blockchain & Walrus Decentralized Storage</p>
        </div>
      </footer>
    </div>
  );
}