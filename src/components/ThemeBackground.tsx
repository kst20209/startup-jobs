'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import JobPostList from './JobPostList'
import { JobPost } from '@/types/database'

// 기업 정보 타입
interface Corp {
  name: string
  color: string
  logo: string
  logoStyle: 'no-bg' | 'with-bg' | 'with-bg-circle'
  logoSize: { width: number; height: number }
  objectFit: 'contain' | 'cover'
}

// 기업 목록
const corporations: Corp[] = [
  { 
    name: '네이버', 
    color: '#03C75A', 
    logo: '/logos/naver.svg',
    logoStyle: 'no-bg',
    logoSize: { width: 48, height: 48 },
    objectFit: 'contain'
  },
  { 
    name: '카카오', 
    color: '#FFDC00', 
    logo: '/logos/kakao.svg',
    logoStyle: 'no-bg',
    logoSize: { width: 48, height: 48 },
    objectFit: 'contain'
  },
  { 
    name: '쿠팡', 
    color: '#F7552F', 
    logo: '/logos/coupang.svg',
    logoStyle: 'with-bg',
    logoSize: { width: 36, height: 20 },
    objectFit: 'contain'
  },
  { 
    name: '라인', 
    color: '#3ACD01', 
    logo: '/logos/line.svg',
    logoStyle: 'no-bg',
    logoSize: { width: 48, height: 48 },
    objectFit: 'contain'
  },
  { 
    name: '배민', 
    color: '#40BFB9', 
    logo: '/logos/baemin.svg',
    logoStyle: 'no-bg',
    logoSize: { width: 40, height: 24 },
    objectFit: 'contain'
  },
  { 
    name: '당근', 
    color: '#FF6F0F', 
    logo: '/logos/daangn.svg',
    logoStyle: 'with-bg-circle',
    logoSize: { width: 40, height: 40 },
    objectFit: 'cover'
  },
  { 
    name: '토스', 
    color: '#0064FF', 
    logo: '/logos/toss.svg',
    logoStyle: 'with-bg-circle',
    logoSize: { width: 48, height: 48 },
    objectFit: 'cover'
  },
]

// 색상을 연하게 만드는 함수
const lightenColor = (color: string, alpha: number = 0.1): string => {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

interface ThemeBackgroundProps {
  initialJobPosts: JobPost[]
}

export default function ThemeBackground({ initialJobPosts }: ThemeBackgroundProps) {
  const [selectedCorp, setSelectedCorp] = useState<Corp | null>(null)

  // 기본 테마 색상
  const defaultTheme = '#5D5DF6'
  const currentTheme = selectedCorp?.color || defaultTheme

  return (
    <>
      {/* 동적 배경 */}
      <div 
        className="fixed inset-0 transition-all duration-500 ease-in-out -z-10"
        style={{
          background: `linear-gradient(135deg, ${lightenColor(currentTheme, 0.03)} 0%, ${lightenColor(currentTheme, 0.08)} 100%)`,
        }}
      >
        {/* Glassmorph 배경 오버레이 */}
        <div 
          className="absolute inset-0 opacity-30 transition-all duration-500"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, ${lightenColor(currentTheme, 0.15)} 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, ${lightenColor(currentTheme, 0.1)} 0%, transparent 50%),
              radial-gradient(circle at 50% 10%, ${lightenColor(currentTheme, 0.08)} 0%, transparent 70%)
            `
          }}
        />
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* 메인 타이틀 및 검색창 카드 */}
        <div className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-xl border border-white/20 p-8 mb-8 text-center relative overflow-hidden">
          {/* 카드 내부 glassmorph 효과 */}
          <div 
            className="absolute inset-0 opacity-5 transition-all duration-500"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${currentTheme} 0%, transparent 70%)`
            }}
          />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              스타트업 채용공고 검색기
            </h1>
            <p className="text-gray-600 mb-6">
              최신 스타트업 채용 정보를 한눈에 확인하세요
            </p>
            <div className="flex justify-center">
              <input
                type="text"
                placeholder="검색어를 입력하세요 (예: 프론트엔드, 네이버)"
                className="w-full max-w-lg px-4 py-3 rounded-xl border border-gray-200/50 shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition text-base bg-white/70 backdrop-blur-sm placeholder-gray-400"
                style={{
                  '--tw-ring-color': lightenColor(currentTheme, 0.5)
                } as React.CSSProperties}
                disabled
              />
            </div>
          </div>
        </div>

        {/* 기업 버튼 리스트 */}
        <div className="mb-6">
          <div className="flex gap-3 justify-center flex-wrap">
            {/* 전체 보기 버튼 */}
            <button
              onClick={() => setSelectedCorp(null)}
              className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none backdrop-blur-sm ${
                !selectedCorp ? 'ring-2 ring-white ring-opacity-60' : ''
              }`}
              style={{
                backgroundColor: !selectedCorp ? defaultTheme : '#6B7280',
                opacity: 0.9
              }}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-white drop-shadow-md">전체</span>
            </button>

            {corporations.map((corp) => (
              <button
                key={corp.name}
                onClick={() => setSelectedCorp(corp)}
                className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none backdrop-blur-sm ${
                  selectedCorp?.name === corp.name ? 'ring-2 ring-white ring-opacity-60 scale-105' : ''
                }`}
                style={{
                  backgroundColor: corp.color,
                  opacity: 0.9
                }}
              >
                {/* 맞춤형 로고 스타일링 */}
                <div className={`flex items-center justify-center mb-1 overflow-hidden ${
                  corp.logoStyle === 'with-bg' 
                    ? 'w-11 h-11 bg-white bg-opacity-95 backdrop-blur-md rounded-lg border border-white border-opacity-40 shadow-inner p-1.5' 
                    : corp.logoStyle === 'with-bg-circle'
                    ? 'w-11 h-11 bg-white bg-opacity-95 backdrop-blur-md rounded-full border border-white border-opacity-40 shadow-inner'
                    : 'w-12 h-12'
                }`}>
                  <Image 
                    src={corp.logo} 
                    alt={`${corp.name} 로고`} 
                    width={corp.logoSize.width} 
                    height={corp.logoSize.height} 
                    className={corp.objectFit === 'cover' ? 'object-cover' : 'object-contain'}
                    style={{ 
                      width: corp.logoStyle === 'no-bg' ? corp.logoSize.width : 'auto',
                      height: corp.logoStyle === 'no-bg' ? corp.logoSize.height : 'auto',
                      maxWidth: corp.logoStyle !== 'no-bg' ? '100%' : 'none',
                      maxHeight: corp.logoStyle !== 'no-bg' ? '100%' : 'none',
                      transform: corp.name === '토스' ? 'scale(0.8)' : 
                                corp.name === '배민' ? 'scale(1.5)' : 
                                corp.name === '쿠팡' ? 'scale(1.25)' : 'none'
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-white drop-shadow-md">{corp.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 채용공고 목록 컴포넌트 */}
        <JobPostList 
          initialJobPosts={initialJobPosts} 
          themeColor={currentTheme}
          selectedCompany={selectedCorp?.name || null}
        />
      </main>
    </>
  )
} 