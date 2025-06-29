'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { JobPost } from '@/types/database'
import ThemeBackground from '@/components/ThemeBackground'
import Image from 'next/image'

// 서버 컴포넌트에서 초기 데이터 가져오기
async function getInitialJobPosts(): Promise<JobPost[]> {
  const { data: jobPosts, error } = await supabase
    .from('JobPost')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching job posts:', error)
    return []
  }

  return jobPosts || []
}

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
  // #RRGGBB 형태의 색상을 rgba로 변환
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 색상을 중간 톤으로 만드는 함수 (hover용)
const mediumColor = (color: string, alpha: number = 0.6): string => {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default async function HomePage() {
  const initialJobPosts = await getInitialJobPosts()

  return (
    <div className="min-h-screen relative">
      {/* 헤더 - 고정 색상 (#5D5DF6) */}
      <header className="w-full border-b backdrop-blur-md bg-white/80 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <Image src="/globe.svg" alt="logo" width={32} height={32} />
            <span className="font-extrabold text-xl tracking-tight text-gray-800">LETS CAREER</span>
            <nav className="ml-8 flex gap-6 text-gray-700 text-base font-medium">
              
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="font-medium transition-colors duration-200 text-[#5D5DF6] hover:text-[#4c4cf5]"
            >
              로그인
            </button>
            <button 
              className="text-white px-4 py-1.5 rounded-lg font-semibold shadow hover:shadow-lg transition-all duration-200 bg-[#5D5DF6] hover:bg-[#4c4cf5]"
              style={{ 
                boxShadow: '0 4px 14px 0 rgba(93, 93, 246, 0.4)'
              }}
            >
              회원가입
            </button>
          </div>
        </div>
      </header>

      {/* 동적 테마 배경과 메인 컨텐츠 */}
      <ThemeBackground initialJobPosts={initialJobPosts} />
    </div>
  )
}