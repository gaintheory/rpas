import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/nav/Navbar';
import Footer from '@/components/footer/Footer';

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: 'Right Price Auto Sales | Used Cars Murfreesboro TN',
  description:
    'Buy Here Pay Here dealership serving Murfreesboro and Middle Tennessee since 1993. Browse our inventory of quality used cars, trucks, and SUVs with in-house financing available.',
  openGraph: {
    title: 'Right Price Auto Sales | Used Cars Murfreesboro TN',
    description:
      'Quality used cars with in-house financing. Serving Middle Tennessee since 1993.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-secondary">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
