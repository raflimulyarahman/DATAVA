'use client';

import { ConnectButton } from '@mysten/dapp-kit';
import { Box, Card, Flex, Heading, Text } from '@radix-ui/themes';
import clsx from 'clsx';
import Link from 'next/link';

export default function Home() {
  return (
    <Flex 
      className={clsx(
        'min-h-screen w-full items-center justify-center p-4',
        'bg-gradient-to-br from-gray-900 via-black to-gray-900'
      )}
    >
      <Box className="w-full max-w-6xl">
        {/* Header */}
        <Flex justify="between" align="center" className="mb-12">
          <Heading size="8" className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            DATAVA
          </Heading>
          <ConnectButton />
        </Flex>

        {/* Main Content */}
        <Flex direction="column" gap="6" align="center" className="text-center">
          <Box>
            <Heading size="9" className="text-white mb-4">
              Decentralized AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Data Marketplace</span>
            </Heading>
            <Text size="5" className="text-gray-300 max-w-2xl">
              Upload datasets to decentralized storage, register them on Sui blockchain, run AI inference, and earn rewards when your data powers AI models.
            </Text>
          </Box>

          {/* Feature Cards */}
          <Flex gap="6" wrap="wrap" justify="center" className="mt-12">
            <Card className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 p-6 w-80">
              <Heading size="5" className="text-cyan-400 mb-3">Upload Data</Heading>
              <Text className="text-gray-300">
                Store your datasets on Walrus decentralized storage for secure, permanent access.
              </Text>
            </Card>
            
            <Card className="bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 p-6 w-80">
              <Heading size="5" className="text-pink-400 mb-3">On-chain Registration</Heading>
              <Text className="text-gray-300">
                Register your datasets on Sui blockchain to establish ownership and earn rewards.
              </Text>
            </Card>
            
            <Card className="bg-gray-900/50 backdrop-blur-sm border border-indigo-500/20 p-6 w-80">
              <Heading size="5" className="text-indigo-400 mb-3">AI Inference</Heading>
              <Text className="text-gray-300">
                Run GPT-4.1 inference on your datasets and track usage on-chain for payments.
              </Text>
            </Card>
          </Flex>

          {/* Action Button */}
          <Link href="/dashboard" className="mt-12">
            <button className={clsx(
              'px-8 py-4 rounded-lg font-bold text-lg',
              'bg-gradient-to-r from-cyan-500 to-pink-500',
              'hover:from-cyan-600 hover:to-pink-600',
              'transition-all duration-300',
              'transform hover:scale-105'
            )}>
              Get Started
            </button>
          </Link>
        </Flex>

        {/* Footer */}
        <Flex justify="center" className="mt-16 text-gray-500 text-sm">
          <Text>Powered by Sui Blockchain & Walrus Storage</Text>
        </Flex>
      </Box>
    </Flex>
  );
}