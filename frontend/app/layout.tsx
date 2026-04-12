import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = { title: 'LandApp Nigeria', description: 'Find land for sale across Nigeria' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-textPrimary">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
