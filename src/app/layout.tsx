import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '스타트업 채용공고 검색기',
  description: '최신 스타트업 채용 정보를 한눈에 확인하세요. 카카오, 네이버, 토스, 쿠팡 등 유명 스타트업의 채용 정보를 실시간으로 검색하고 지원하세요.',
  keywords: ['스타트업', '채용', '구인', '취업', '카카오', '네이버', '토스', '쿠팡', '배민', '당근마켓'],
  authors: [{ name: 'Startup Jobs' }],
  creator: 'Startup Jobs',
  publisher: 'Startup Jobs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://startup-jobs.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '스타트업 채용공고 검색기',
    description: '최신 스타트업 채용 정보를 한눈에 확인하세요',
    url: 'https://startup-jobs.vercel.app',
    siteName: '스타트업 채용공고 검색기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '스타트업 채용공고 검색기',
    description: '최신 스타트업 채용 정보를 한눈에 확인하세요',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "sh7v69vb9u");
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}