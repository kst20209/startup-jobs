import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// 환경에 따른 base URL 설정
const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://startup-jobs.vercel.app'
  : 'http://localhost:3001'

export const metadata: Metadata = {
  title: 'IT 대기업 채용공고 검색기',
  description: '가장 빠르게 네카라쿠배당토 채용 정보를 확인하세요',
  keywords: ['네카라쿠배당토', 'IT 대기업 채용', '카카오 채용', '네이버 채용', '라인 채용', '쿠팡 채용', '배민 채용', '당근마켓 채용', '토스 채용', '대기업 채용공고', 'IT 채용정보', '신입 채용', '경력 채용', '개발자 채용', '프로그래머 채용', '소프트웨어 엔지니어 채용', 'IT 취업', '대기업 취업', '네카라쿠배 취업', '채용 알림', '채용 정보', '구인 정보'],
  authors: [{ name: 'Startup Jobs' }],
  creator: 'Startup Jobs',
  publisher: 'Startup Jobs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'IT 대기업 채용공고 검색기',
    description: '가장 빠르게 네카라쿠배당토 채용 정보를 확인하세요',
    siteName: 'IT 대기업 채용공고 검색기',
    locale: 'ko_KR',
    type: 'website',
    url: 'https://startup-jobs-pi.vercel.app',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IT 대기업 채용공고 검색기 - 네카라쿠배당토 채용 정보',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IT 대기업 채용공고 검색기',
    description: '가장 빠르게 네카라쿠배당토 채용 정보를 확인하세요',
    images: ['/og-image.png']
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