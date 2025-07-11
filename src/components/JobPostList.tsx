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
let liberalFilterGlobal: 'liberal' | 'science' | 'all' = 'liberal' // 문과가 기본값
const listeners: Set<() => void> = new Set()

export const companyStore = {
  getSelectedCompany: () => selectedCompanyGlobal,
  setSelectedCompany: (company: string) => {
    selectedCompanyGlobal = company
    listeners.forEach(listener => listener())
  },
  getLiberalFilter: () => liberalFilterGlobal,
  setLiberalFilter: (filter: 'liberal' | 'science' | 'all') => {
    liberalFilterGlobal = filter
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
  const [liberalFilter, setLiberalFilter] = useState<'liberal' | 'science' | 'all'>('liberal')
  const [displayCount, setDisplayCount] = useState(20)

  // 글로벌 상태 구독
  useEffect(() => {
    const unsubscribe = companyStore.subscribe(() => {
      setSelectedCompany(companyStore.getSelectedCompany())
      setLiberalFilter(companyStore.getLiberalFilter())
      setDisplayCount(20) // 필터 변경 시 표시 개수 초기화
    })
    return () => unsubscribe()
  }, [])

  // 필터링된 채용공고 (즉시 계산)
  const filteredJobPosts = useMemo(() => {
    console.log(`🔍 클라이언트에서 필터링: ${selectedCompany}, 문과/이과: ${liberalFilter}`)
    
    let filtered = allJobPosts

    // 1. 회사 필터링
    if (selectedCompany !== '전체') {
      const actualCompanyName = COMPANY_NAME_MAPPING[selectedCompany] || selectedCompany
      filtered = filtered.filter(post => post.company_name === actualCompanyName)
    }

    // 2. 문과/이과 필터링
    if (liberalFilter === 'liberal') {
      filtered = filtered.filter(post => post.is_liberal === true)
    } else if (liberalFilter === 'science') {
      filtered = filtered.filter(post => post.is_liberal === false)
    }
    // 'all'인 경우는 모든 결과 표시 (추가 필터링 없음)
    
    console.log(`📊 필터링 결과: ${filtered.length}개 (전체: ${allJobPosts.length}개)`)
    return filtered
  }, [allJobPosts, selectedCompany, liberalFilter])

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
        </div>
      </div>

      {/* 채용공고 카드 목록 */}
      <div className="space-y-4">
        {displayedJobPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">채용공고가 없습니다</h3>
            <p className="text-gray-500">새로운 채용공고가 등록되면 여기에 표시됩니다.</p>
          </div>
        ) : (
          displayedJobPosts.map((jobPost) => (
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
                    <div className="flex-shrink-0">
                      {(() => {
                        const logoPath = getCompanyLogo(jobPost.company_name)
                        return logoPath ? (
                          <div className="w-12 h-12 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center p-2">
                            <Image 
                              src={logoPath} 
                              alt={`${jobPost.company_name} 로고`} 
                              width={32} 
                              height={32} 
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {jobPost.company_name.charAt(0).toUpperCase()}
                          </div>
                        )
                      })()}
                    </div>

                    {/* 채용공고 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* 회사명 */}
                          <div className="text-sm text-gray-500 mb-1 truncate">
                            {jobPost.company_name} · {jobPost.company_name_detail || jobPost.company_name}
                          </div>

                          {/* 채용공고 제목 */}
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {jobPost.job_title}
                          </h3>

                          {/* 직무 카테고리 및 고용형태 */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <span>💼</span>
                              <span>{jobPost.job_category_main}</span>
                            </div>
                            {jobPost.employment_type && (
                              <div className="flex items-center gap-1">
                                <span>📄</span>
                                <span>{jobPost.employment_type}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 화살표 아이콘 */}
                        <div className="flex-shrink-0 ml-4">
                          <svg 
                            className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))
        )}

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