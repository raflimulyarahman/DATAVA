import '@mysten/dapp-kit/dist/index.css';
import '@radix-ui/themes/styles.css';
import '@suiware/kit/main.css';
import type { Metadata } from 'next';
import '../styles/globals.css';
import clsx from 'clsx';
import ClientProviders from './providers';

export const metadata: Metadata = {
  title: 'DATAVA - Decentralized AI Data Marketplace',
  description: 'A decentralized AI data marketplace where users can upload datasets, register them on-chain, and earn rewards when their data powers AI inference.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={clsx('min-h-screen bg-black')}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}