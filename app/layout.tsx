// @ts-nocheck
import type { Metadata, Viewport } from 'next'
import { Nunito, DM_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import PWARegister from '@/components/PWARegister'
import './globals.css'

const nunito = Nunito({ subsets: ['latin'], weight: ['400','600','700','800','900'], variable: '--font-nunito' })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-dm' })

export const metadata: Metadata = {
  title: 'EnglishUp — Programme anglais 6–16 ans',
  description: 'Votre enfant parle anglais en 60 jours. 20 min par jour, suivi parent complet, résultats mesurables.',
  manifest: '/manifest.json',
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-512.png' },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'EnglishUp' },
  openGraph: { title: 'EnglishUp', description: 'Programme anglais 6–16 ans. 60 sessions. Résultats garantis.', type: 'website' },
}

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 1, userScalable: false, themeColor: '#040D1A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${nunito.variable} ${dmSans.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="EnglishUp" />
      </head>
      <body className="bg-[#040D1A] text-white antialiased">
        <PWARegister />
        {children}
        <Toaster position="top-center" toastOptions={{
          style: { background: '#1B3A6B', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-nunito)', fontWeight: 600 },
          success: { iconTheme: { primary: '#06D6A0', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }} />
      </body>
    </html>
  )
}
