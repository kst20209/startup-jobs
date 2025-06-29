'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// 기업별 색상 하드코딩
const COMPANY_COLORS: { [key: string]: { bg: string; overlay1: string; overlay2: string; overlay3: string } } = {
  '네이버': {
    bg: 'linear-gradient(135deg, rgba(3, 199, 90, 0.08) 0%, rgba(3, 199, 90, 0.15) 100%)',
    overlay1: 'rgba(3, 199, 90, 0.25)',
    overlay2: 'rgba(3, 199, 90, 0.20)',
    overlay3: 'rgba(3, 199, 90, 0.15)'
  },
  '카카오': {
    bg: 'linear-gradient(135deg, rgba(255, 220, 0, 0.08) 0%, rgba(255, 220, 0, 0.15) 100%)',
    overlay1: 'rgba(255, 220, 0, 0.25)',
    overlay2: 'rgba(255, 220, 0, 0.20)',
    overlay3: 'rgba(255, 220, 0, 0.15)'
  },
  '쿠팡': {
    bg: 'linear-gradient(135deg, rgba(247, 85, 47, 0.08) 0%, rgba(247, 85, 47, 0.15) 100%)',
    overlay1: 'rgba(247, 85, 47, 0.25)',
    overlay2: 'rgba(247, 85, 47, 0.20)',
    overlay3: 'rgba(247, 85, 47, 0.15)'
  },
  '라인': {
    bg: 'linear-gradient(135deg, rgba(58, 205, 1, 0.08) 0%, rgba(58, 205, 1, 0.15) 100%)',
    overlay1: 'rgba(58, 205, 1, 0.25)',
    overlay2: 'rgba(58, 205, 1, 0.20)',
    overlay3: 'rgba(58, 205, 1, 0.15)'
  },
  '배민': {
    bg: 'linear-gradient(135deg, rgba(64, 191, 185, 0.08) 0%, rgba(64, 191, 185, 0.15) 100%)',
    overlay1: 'rgba(64, 191, 185, 0.25)',
    overlay2: 'rgba(64, 191, 185, 0.20)',
    overlay3: 'rgba(64, 191, 185, 0.15)'
  },
  '당근': {
    bg: 'linear-gradient(135deg, rgba(255, 111, 15, 0.08) 0%, rgba(255, 111, 15, 0.15) 100%)',
    overlay1: 'rgba(255, 111, 15, 0.25)',
    overlay2: 'rgba(255, 111, 15, 0.20)',
    overlay3: 'rgba(255, 111, 15, 0.15)'
  },
  '토스': {
    bg: 'linear-gradient(135deg, rgba(0, 100, 255, 0.08) 0%, rgba(0, 100, 255, 0.15) 100%)',
    overlay1: 'rgba(0, 100, 255, 0.25)',
    overlay2: 'rgba(0, 100, 255, 0.20)',
    overlay3: 'rgba(0, 100, 255, 0.15)'
  },
  // 기본 테마
  '전체': {
    bg: 'linear-gradient(135deg, rgba(93, 93, 246, 0.08) 0%, rgba(93, 93, 246, 0.15) 100%)',
    overlay1: 'rgba(93, 93, 246, 0.25)',
    overlay2: 'rgba(93, 93, 246, 0.20)',
    overlay3: 'rgba(93, 93, 246, 0.15)'
  }
}

export default function DynamicBackground() {
  const searchParams = useSearchParams()
  const selectedCompany = searchParams.get('company') || '전체'
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null // 서버 사이드에서는 아무것도 렌더링하지 않음
  }

  const colors = COMPANY_COLORS[selectedCompany] || COMPANY_COLORS['전체']

  return (
    <div 
      className="fixed inset-0 transition-all duration-700 ease-in-out -z-10"
      style={{
        background: colors.bg,
      }}
    >
      <div 
        className="absolute inset-0 opacity-50 transition-all duration-700"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, ${colors.overlay1} 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${colors.overlay2} 0%, transparent 50%),
            radial-gradient(circle at 50% 10%, ${colors.overlay3} 0%, transparent 70%)
          `
        }}
      />
    </div>
  )
} 