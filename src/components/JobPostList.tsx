'use client'

import { useState, useEffect, useMemo } from 'react'
import { JobPost } from '@/types/database'
import Image from 'next/image'

// 기업 로고 매핑 (실제 DB company_name에 맞춤)
const COMPANY_LOGOS: { [key: string]: string } = {
  '네이버 (Naver)': '/logos/naver.svg',
  '카카오 (Kakao)': '/logos/kakao.svg',
  '쿠팡 (Coupang)': '/logos/coupang.svg',
  '라인 (LINE)': '/logos/line.svg',
  '우아한형제들 (Woowahan)': '/logos/baemin.svg',
  '당근 (Carrot)': '/logos/daangn.svg',
  '토스 (Toss)': '/logos/toss.svg',
  // 단순 이름도 지원 (fallback)
  '네이버': '/logos/naver.svg',
  '카카오': '/logos/kakao.svg',
  '쿠팡': '/logos/coupang.svg',
  '라인': '/logos/line.svg',
  '배민': '/logos/baemin.svg',
  '당근': '/logos/daangn.svg',
  '토스': '/logos/toss.svg'
}

// 버튼 이름 → 실제 DB company_name 매핑
const COMPANY_NAME_MAPPING: { [key: string]: string } = {
  '네이버': '네이버 (Naver)',
  '카카오': '카카오 (Kakao)',
  '쿠팡': '쿠팡 (Coupang)', 
  '라인': '라인 (LINE)',
  '배민': '우아한형제들 (Woowahan)',
  '당근': '당근 (Carrot)',
  '토스': '토스 (Toss)'
}

interface JobPostListProps {
  allJobPosts: JobPost[]
}

// 글로벌 상태 (간단한 상태 관리)
let selectedCompanyGlobal = '전체'
const listeners: Set<() => void> = new Set()

export const companyStore = {
  getSelectedCompany: () => selectedCompanyGlobal,
  setSelectedCompany: (company: string) => {
    selectedCompanyGlobal = company
    listeners.forEach(listener => listener())
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }
}

export default function JobPostList({ allJobPosts }: JobPostListProps) {
  const [selectedCompany, setSelectedCompany] = useState('전체')
  const [displayCount, setDisplayCount] = useState(20)

  // 글로벌 상태 구독
  useEffect(() => {
    const unsubscribe = companyStore.subscribe(() => {
      setSelectedCompany(companyStore.getSelectedCompany())
      setDisplayCount(20) // 필터 변경 시 표시 개수 초기화
    })
    return () => unsubscribe()
  }, [])

  // 필터링된 채용공고 (즉시 계산)
  const filteredJobPosts = useMemo(() => {
    console.log(`🔍 클라이언트에서 필터링: ${selectedCompany}`)
    
    if (selectedCompany === '전체') {
      return allJobPosts
    }

    // 실제 DB company_name으로 매핑
    const actualCompanyName = COMPANY_NAME_MAPPING[selectedCompany] || selectedCompany
    const filtered = allJobPosts.filter(post => post.company_name === actualCompanyName)
    
    console.log(`📊 필터링 결과: ${filtered.length}개 (전체: ${allJobPosts.length}개)`)
    return filtered
  }, [allJobPosts, selectedCompany])

  // 현재 표시할 채용공고 (무한 스크롤용)
  const displayedJobPosts = useMemo(() => {
    return filteredJobPosts.slice(0, displayCount)
  }, [filteredJobPosts, displayCount])

  // 무한 스크롤 - 더 보기
  const loadMore = () => {
    setDisplayCount(prev => prev + 20)
  }

  // 더 볼 데이터가 있는지 확인
  const hasMore = displayCount < filteredJobPosts.length

  const getCompanyLogo = (companyName: string) => {
    return COMPANY_LOGOS[companyName] || null
  }

  if (filteredJobPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">
          {selectedCompany === '전체' 
            ? '😴 채용공고가 없습니다' 
            : `😴 ${selectedCompany}의 채용공고가 없습니다`
          }
        </div>
        {selectedCompany !== '전체' && (
          <p className="text-gray-400 text-sm">
            다른 기업을 선택하거나 전체 보기를 시도해보세요
          </p>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* 현재 상태 표시 */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {selectedCompany === '전체' 
            ? `📊 전체 ${filteredJobPosts.length}개의 채용공고` 
            : `📊 ${selectedCompany} ${filteredJobPosts.length}개의 채용공고`
          }
          {displayCount < filteredJobPosts.length && (
            <span className="text-blue-600 ml-2">
              (현재 {displayCount}개 표시 중)
            </span>
          )}
        </div>
      </div>

      {/* 채용공고 카드 목록 */}
      <div className="space-y-4">
        {displayedJobPosts.map((jobPost) => (
          <div key={jobPost.id}>
            <a
              href={jobPost.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {/* 회사 로고 */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {getCompanyLogo(jobPost.company_name) ? (
                      <Image
                        src={getCompanyLogo(jobPost.company_name)!}
                        alt={`${jobPost.company_name} 로고`}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    ) : (
                      <div className="text-2xl">🏢</div>
                    )}
                  </div>

                  {/* 채용공고 정보 */}
                  <div className="flex-1 min-w-0">
                    {/* 회사명 */}
                    <div className="text-sm text-gray-500 mb-1 truncate">
                      {jobPost.company_name}
                    </div>

                    {/* 채용공고 제목 */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {jobPost.job_title}
                    </h3>

                    {/* 포지션 및 고용형태 */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {jobPost.position && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {jobPost.position}
                        </span>
                      )}
                      {jobPost.employment_type && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {jobPost.employment_type}
                        </span>
                      )}
                    </div>

                    {/* 등록일 */}
                    <div className="text-xs text-gray-400">
                      {new Date(jobPost.created_at).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} 등록
                    </div>
                  </div>

                  {/* 화살표 아이콘 */}
                  <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}

        {/* 더 보기 버튼 */}
        {hasMore && (
          <div className="text-center py-6">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-[#5D5DF6] text-white rounded-lg hover:bg-[#4c4cf5] transition-colors duration-200 font-medium shadow-lg"
            >
              더 보기 ({filteredJobPosts.length - displayCount}개 더)
            </button>
          </div>
        )}

        {/* 모든 데이터 표시 완료 */}
        {!hasMore && displayedJobPosts.length > 0 && (
          <div className="text-center py-6 text-gray-500 text-sm">
            ✅ 모든 채용공고를 표시했습니다
          </div>
        )}
      </div>
    </div>
  )
} 