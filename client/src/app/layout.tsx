import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Providers } from '@/components/providers/Providers';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: "Vite & Gourmand - Traiteur d'exception a Bordeaux",
  description:
    "Vite & Gourmand, votre traiteur d'exception a Bordeaux. Menus raffines pour tous vos evenements.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.svg',
  },
  manifest: '/site.webmanifest',
  themeColor: '#E67E22',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
