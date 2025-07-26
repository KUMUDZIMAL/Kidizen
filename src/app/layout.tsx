// app/layout.tsx
'use client';

import './globals.css';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster as RadixToaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { GameProvider } from '@/context/GameContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Providers } from './providers'; // Correct import path

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap everything with SessionProvider */}
 
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <GameProvider>
                <RadixToaster />
                <SonnerToaster />
                {children}
              </GameProvider>
            </TooltipProvider>
          </QueryClientProvider>
   
      </body>
    </html>
  );
}