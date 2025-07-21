'use client'

import { useEffect, useState } from 'react'
import { companyStore } from './JobPostList'

// 기업별 색상 매핑 (실제 DB company_name에 맞춤)
const COMPANY_COLORS: { [key: string]: { bg: string; overlay1: string; overlay2: string; overlay3: string } } = {
  // 실제 DB company_name 형태
  '네이버 (Naver)': {
    bg: 'linear-gradient(135deg, rgba(3, 199, 90, 0.08) 0%, rgba(3, 199, 90, 0.15) 100%)',
    overlay1: 'rgba(3, 199, 90, 0.25)',
    overlay2: 'rgba(3, 199, 90, 0.20)',
    overlay3: 'rgba(3, 199, 90, 0.15)'
  },
  '카카오 (Kakao)': {
    bg: 'linear-gradient(135deg, rgba(255, 220, 0, 0.08) 0%, rgba(255, 220, 0, 0.15) 100%)',
    overlay1: 'rgba(255, 220, 0, 0.25)',
    overlay2: 'rgba(255, 220, 0, 0.20)',
    overlay3: 'rgba(255, 220, 0, 0.15)'
  },
  '쿠팡 (Coupang)': {
    bg: 'linear-gradient(135deg, rgba(247, 85, 47, 0.08) 0%, rgba(247, 85, 47, 0.15) 100%)',
    overlay1: 'rgba(247, 85, 47, 0.25)',
    overlay2: 'rgba(247, 85, 47, 0.20)',
    overlay3: 'rgba(247, 85, 47, 0.15)'
  },
  '라인 (LINE)': {
    bg: 'linear-gradient(135deg, rgba(58, 205, 1, 0.08) 0%, rgba(58, 205, 1, 0.15) 100%)',
    overlay1: 'rgba(58, 205, 1, 0.25)',
    overlay2: 'rgba(58, 205, 1, 0.20)',
    overlay3: 'rgba(58, 205, 1, 0.15)'
  },
  '우아한형제들 (Woowahan)': {
    bg: 'linear-gradient(135deg, rgba(64, 191, 185, 0.08) 0%, rgba(64, 191, 185, 0.15) 100%)',
    overlay1: 'rgba(64, 191, 185, 0.25)',
    overlay2: 'rgba(64, 191, 185, 0.20)',
    overlay3: 'rgba(64, 191, 185, 0.15)'
  },
  '당근 (Carrot)': {
    bg: 'linear-gradient(135deg, rgba(255, 111, 15, 0.08) 0%, rgba(255, 111, 15, 0.15) 100%)',
    overlay1: 'rgba(255, 111, 15, 0.25)',
    overlay2: 'rgba(255, 111, 15, 0.20)',
    overlay3: 'rgba(255, 111, 15, 0.15)'
  },
  '토스 (Toss)': {
    bg: 'linear-gradient(135deg, rgba(0, 100, 255, 0.08) 0%, rgba(0, 100, 255, 0.15) 100%)',
    overlay1: 'rgba(0, 100, 255, 0.25)',
    overlay2: 'rgba(0, 100, 255, 0.20)',
    overlay3: 'rgba(0, 100, 255, 0.15)'
  },
  // Fallback 단순 이름들 (호환성을 위해)
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
  const [selectedCompany, setSelectedCompany] = useState('전체')
  const [isClient, setIsClient] = useState(false)

  // 글로벌 상태 구독
  useEffect(() => {
    setIsClient(true)
    setSelectedCompany(companyStore.getSelectedCompany())
    
    const unsubscribe = companyStore.subscribe(() => {
      const newCompany = companyStore.getSelectedCompany()
      setSelectedCompany(newCompany)
      console.log(`🎨 배경 색상 변경: ${newCompany}`)
    })
    
    return unsubscribe
  }, [])

  if (!isClient) {
    return null // 서버 사이드에서는 아무것도 렌더링하지 않음
  }

  // 선택된 회사에 맞는 색상 가져오기 (fallback 포함)
  const colors = COMPANY_COLORS[selectedCompany] || COMPANY_COLORS['전체']

  return (
    <>
      <div 
        className="fixed inset-0 transition-all duration-700 ease-in-out -z-10"
        style={{
          background: colors.bg,
        }}
      >
        <div 
          className="absolute inset-0 transition-all duration-700"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, ${colors.overlay1} 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, ${colors.overlay2} 0%, transparent 50%),
              radial-gradient(circle at 50% 10%, ${colors.overlay3} 0%, transparent 70%)
            `
          }}
        />
      </div>
      <style jsx global>{`
        @media (max-width: 600px) {
          .absolute.inset-0.transition-all.duration-700 {
            background-image:
              radial-gradient(circle at 25% 25%, ${colors.overlay1} 0%, transparent 30%),
              radial-gradient(circle at 75% 75%, ${colors.overlay2} 0%, transparent 30%),
              radial-gradient(circle at 50% 10%, ${colors.overlay3} 0%, transparent 40%);
          }
        }
      `}</style>
    </>
  )
} 