'use client'

import { useEffect, useState } from 'react'
import { companyStore } from './JobPostList'

// 기업별 색상 매핑 (alpha 1인 RGB로 변환하여 모바일 호환성 개선)
const COMPANY_COLORS: { [key: string]: { bg: string; overlay1: string; overlay2: string; overlay3: string } } = {
  // 실제 DB company_name 형태
  '네이버 (Naver)': {
    bg: 'linear-gradient(135deg, rgb(235, 251, 242) 0%, rgb(217, 247, 230) 100%)',
    overlay1: 'rgb(192, 239, 213)',
    overlay2: 'rgb(204, 243, 222)',
    overlay3: 'rgb(217, 247, 230)'
  },
  '카카오 (Kakao)': {
    bg: 'linear-gradient(135deg, rgb(255, 252, 235) 0%, rgb(255, 250, 217) 100%)',
    overlay1: 'rgb(255, 247, 192)',
    overlay2: 'rgb(255, 249, 204)',
    overlay3: 'rgb(255, 250, 217)'
  },
  '쿠팡 (Coupang)': {
    bg: 'linear-gradient(135deg, rgb(254, 239, 234) 0%, rgb(252, 228, 217) 100%)',
    overlay1: 'rgb(248, 204, 185)',
    overlay2: 'rgb(250, 216, 201)',
    overlay3: 'rgb(252, 228, 217)'
  },
  '라인 (LINE)': {
    bg: 'linear-gradient(135deg, rgb(238, 252, 234) 0%, rgb(221, 248, 217) 100%)',
    overlay1: 'rgb(188, 240, 177)',
    overlay2: 'rgb(204, 244, 196)',
    overlay3: 'rgb(221, 248, 217)'
  },
  '우아한형제들 (Woowahan)': {
    bg: 'linear-gradient(135deg, rgb(239, 251, 250) 0%, rgb(223, 246, 244) 100%)',
    overlay1: 'rgb(191, 237, 233)',
    overlay2: 'rgb(207, 241, 238)',
    overlay3: 'rgb(223, 246, 244)'
  },
  '당근 (Carrot)': {
    bg: 'linear-gradient(135deg, rgb(255, 243, 235) 0%, rgb(255, 235, 217) 100%)',
    overlay1: 'rgb(255, 220, 192)',
    overlay2: 'rgb(255, 227, 204)',
    overlay3: 'rgb(255, 235, 217)'
  },
  '토스 (Toss)': {
    bg: 'linear-gradient(135deg, rgb(234, 242, 255) 0%, rgb(217, 232, 255) 100%)',
    overlay1: 'rgb(191, 216, 255)',
    overlay2: 'rgb(204, 224, 255)',
    overlay3: 'rgb(217, 232, 255)'
  },
  // Fallback 단순 이름들 (호환성을 위해)
  '네이버': {
    bg: 'linear-gradient(135deg, rgb(235, 251, 242) 0%, rgb(217, 247, 230) 100%)',
    overlay1: 'rgb(192, 239, 213)',
    overlay2: 'rgb(204, 243, 222)',
    overlay3: 'rgb(217, 247, 230)'
  },
  '카카오': {
    bg: 'linear-gradient(135deg, rgb(255, 252, 235) 0%, rgb(255, 250, 217) 100%)',
    overlay1: 'rgb(255, 247, 192)',
    overlay2: 'rgb(255, 249, 204)',
    overlay3: 'rgb(255, 250, 217)'
  },
  '쿠팡': {
    bg: 'linear-gradient(135deg, rgb(254, 239, 234) 0%, rgb(252, 228, 217) 100%)',
    overlay1: 'rgb(248, 204, 185)',
    overlay2: 'rgb(250, 216, 201)',
    overlay3: 'rgb(252, 228, 217)'
  },
  '라인': {
    bg: 'linear-gradient(135deg, rgb(238, 252, 234) 0%, rgb(221, 248, 217) 100%)',
    overlay1: 'rgb(188, 240, 177)',
    overlay2: 'rgb(204, 244, 196)',
    overlay3: 'rgb(221, 248, 217)'
  },
  '배민': {
    bg: 'linear-gradient(135deg, rgb(239, 251, 250) 0%, rgb(223, 246, 244) 100%)',
    overlay1: 'rgb(191, 237, 233)',
    overlay2: 'rgb(207, 241, 238)',
    overlay3: 'rgb(223, 246, 244)'
  },
  '당근': {
    bg: 'linear-gradient(135deg, rgb(255, 243, 235) 0%, rgb(255, 235, 217) 100%)',
    overlay1: 'rgb(255, 220, 192)',
    overlay2: 'rgb(255, 227, 204)',
    overlay3: 'rgb(255, 235, 217)'
  },
  '토스': {
    bg: 'linear-gradient(135deg, rgb(234, 242, 255) 0%, rgb(217, 232, 255) 100%)',
    overlay1: 'rgb(191, 216, 255)',
    overlay2: 'rgb(204, 224, 255)',
    overlay3: 'rgb(217, 232, 255)'
  },
  // 기본 테마
  '전체': {
    bg: 'linear-gradient(135deg, rgb(240, 240, 253) 0%, rgb(225, 225, 251) 100%)',
    overlay1: 'rgb(196, 196, 247)',
    overlay2: 'rgb(211, 211, 249)',
    overlay3: 'rgb(225, 225, 251)'
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