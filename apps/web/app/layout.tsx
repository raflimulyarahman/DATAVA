import '@mysten/dapp-kit/dist/index.css';
import '@radix-ui/themes/styles.css';
import '@suiware/kit/main.css';
import type { Metadata } from 'next';
import './styles/globals.css';
import clsx from 'clsx';
import ThemeProvider from '../src/providers/ThemeProvider';
import { getThemeSettings } from '../src/helpers/theme';
import SuiProvider from '@suiware/kit/SuiProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const themeSettings = getThemeSettings();
const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <SuiProvider
              defaultNetwork="testnet"
              walletAutoConnect={false}
              walletStashedName="DATAVA"
              themeSettings={themeSettings}
            >
              {children}
              <Toaster position="bottom-right" />
            </SuiProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}