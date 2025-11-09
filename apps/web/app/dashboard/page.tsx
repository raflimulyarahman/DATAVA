'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { ConnectButton, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Box, Card, Flex, Heading, Text, TextField, TextArea, Button } from '@radix-ui/themes';
import { UploadDropzone } from '../../src/components/UploadDropzone';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { uploadFile, runInference } from '../../src/lib/api';
import { createContributeTx } from '../../src/lib/contract-interactions';

export default function Dashboard() {
  const account = useCurrentAccount();
  const [cid, setCid] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // For transaction signing
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  // Handle file upload to backend service
  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      toast.loading('Uploading file to Walrus...');
      
      const result = await uploadFile(file);
      
      setCid(result.cid);
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
      const tx = createContributeTx(
        process.env.NEXT_PUBLIC_PACKAGE_ID,
        process.env.NEXT_PUBLIC_POOL_ID,
        {
          blobCid: 'usage-record', // Placeholder CID for usage record
          license: 'MIT',
          size: 0, // Size not applicable for usage
          weight: tokens // Use tokens as weight for this example
        }
      );

      // In a real implementation, we'd record usage specifically
      // rather than using contribute for this purpose
      console.log('Usage would be recorded on-chain with', tokens, 'tokens');
    } catch (error) {
      console.error('Error preparing usage recording:', error);
      // Note: We don't show an error to user as this is background operation
    }
  };

  // Handle contribution to the blockchain
  const handleContribute = async () => {
    if (!cid.trim()) {
      toast.error('Please provide a CID');
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
      toast.loading('Preparing to contribute dataset...');

      // Create the transaction to contribute the dataset
      const tx = createContributeTx(
        process.env.NEXT_PUBLIC_PACKAGE_ID,
        process.env.NEXT_PUBLIC_POOL_ID,
        {
          blobCid: cid,
          license: 'MIT', // Default license, should be user-configurable in real app
          size: 0, // Size should come from the upload result in real app
          weight: 1 // Default weight, should be user-configurable in real app
        }
      );

      // Execute the transaction
      signAndExecuteTransaction({
        transaction: tx,
        chain: 'sui:testnet', // Use testnet as default
      }, {
        onSuccess: (result) => {
          toast.dismiss();
          toast.success('Dataset contribution successful!');
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
      <Flex className="min-h-screen w-full items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Card className="p-8 text-center">
          <Heading size="6" className="mb-4">Connect Your Wallet</Heading>
          <Text className="text-gray-400 mb-6">
            Please connect your Sui wallet to access the DATAVA marketplace
          </Text>
          <ConnectButton />
        </Card>
      </Flex>
    );
  }

  return (
    <Flex 
      className="min-h-screen w-full p-4 bg-gradient-to-br from-gray-900 via-black to-gray-900"
    >
      <Box className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <Flex justify="between" align="center" className="mb-10">
          <Heading size="8" className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            DATAVA Dashboard
          </Heading>
          <Box>
            <ConnectButton />
          </Box>
        </Flex>

        {/* Main Grid */}
        <Flex direction="column" gap="6">
          {/* Upload Card */}
          <Card className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/30 p-6">
            <Heading size="6" className="text-cyan-400 mb-4">Upload Dataset</Heading>
            <Text className="text-gray-300 mb-4">
              Upload your dataset to decentralized storage (Walrus) and get a unique content identifier (CID)
            </Text>
            
            <UploadDropzone 
              onFileUpload={handleFileUpload} 
              onUploadSuccess={setCid}
              onUploadError={(error) => toast.error(error)}
              disabled={isLoading} 
            />
            
            {cid && (
              <Box className="mt-4 p-3 bg-gray-800/50 rounded border border-cyan-500/30">
                <Text className="text-cyan-300 break-all">
                  CID: <span className="font-mono">{cid}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(cid)}
                    className="ml-2 text-xs bg-cyan-900/50 px-2 py-1 rounded hover:bg-cyan-800/50"
                  >
                    Copy
                  </button>
                </Text>
              </Box>
            )}
          </Card>

          {/* Contribute Card */}
          <Card className="bg-gray-900/50 backdrop-blur-sm border border-pink-500/30 p-6">
            <Heading size="6" className="text-pink-400 mb-4">Contribute Dataset</Heading>
            <Text className="text-gray-300 mb-4">
              Register your dataset on the Sui blockchain to earn rewards when it's used for AI inference
            </Text>
            
            <Flex gap="4" align="center">
              <TextField.Root 
                placeholder="Enter CID from upload" 
                value={cid} 
                onChange={(e) => setCid(e.target.value)}
                className="flex-grow"
                disabled={isLoading}
              />
              <Button 
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                disabled={isLoading || !cid}
                onClick={handleContribute}
              >
                {isLoading ? 'Processing...' : 'Contribute'}
              </Button>
            </Flex>
          </Card>

          {/* Inference Card */}
          <Card className="bg-gray-900/50 backdrop-blur-sm border border-indigo-500/30 p-6">
            <Heading size="6" className="text-indigo-400 mb-4">AI Inference</Heading>
            <Text className="text-gray-300 mb-4">
              Run GPT-4.1 inference on your data. The usage will be recorded on-chain for reward distribution.
            </Text>
            
            <TextArea 
              placeholder="Enter your prompt for AI inference..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mb-4 min-h-[120px]"
              disabled={isLoading}
            />
            
            <Flex gap="4" justify="between">
              <Button 
                onClick={handleInference}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? 'Processing...' : 'Run Inference'}
              </Button>
              
              {response && (
                <Box className="flex-grow p-4 bg-gray-800/50 rounded border border-indigo-500/30">
                  <Heading size="4" className="text-indigo-300 mb-2">Response:</Heading>
                  <Text className="text-gray-200 whitespace-pre-line">{response}</Text>
                </Box>
              )}
            </Flex>
          </Card>
        </Flex>
      </Box>
    </Flex>
  );
}