'use client'

import { useState, useEffect, useMemo } from 'react'
import { JobPost } from '@/types/database'
import Image from 'next/image'

// NEW 표시 여부를 확인하는 함수 (당일 또는 전날에 생성된 경우)
const isNewJobPost = (createdAt: string): boolean => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  
  const postDate = new Date(createdAt)
  const postDay = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate())
  
  return postDay >= yesterday
}

// NEW 배지 컴포넌트
const NewBadge = () => (
  <div className="absolute -top-2 -right-2 md:-right-2 right-2 z-10">
    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
      NEW
    </div>
  </div>
)

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

// URL에 UTM 파라미터를 안전하게 추가하는 메서드
const addUtmParams = (url: string, utmParams: { [key: string]: string }): string => {
  try {
    const urlObj = new URL(url)
    
    // 기존 UTM 파라미터가 있다면 덮어쓰기
    Object.entries(utmParams).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value)
    })
    
    return urlObj.toString()
  } catch {
    // URL이 유효하지 않은 경우, 단순 문자열 조작으로 처리
    const separator = url.includes('?') ? '&' : '?'
    const utmString = Object.entries(utmParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')
    
    return `${url}${separator}${utmString}`
  }
}

// 글로벌 상태 (간단한 상태 관리)
let selectedCompanyGlobal = '전체'
let liberalFilterGlobal: 'liberal' | 'science' | 'all' = 'liberal' // 문과가 기본값
let employmentFilterGlobal: 'permanent' | 'contract' | 'all' = 'contract' // 계약직이 기본값
let searchTermGlobal = '' // 검색어 상태 추가
const listeners: Set<() => void> = new Set()

// 유사어/동의어 딕셔너리 (핵심 개발 용어들)
const SYNONYMS: { [key: string]: string[] } = {
  '프론트엔드': ['프론트', 'FE', 'frontend', 'Front-end', '웹개발', '클라이언트'],
  '백엔드': ['백', 'BE', 'backend', 'Back-end', '서버', '서버개발'],
  '풀스택': ['풀스텍', 'full stack', 'fullstack', 'Full-stack', '전체개발'],
  '개발': ['dev', 'development', '개발자', 'developer', '엔지니어', 'engineer'],
  '디자인': ['디자이너', 'design', 'designer', 'UI', 'UX'],
  '기획': ['기획자', 'PM', 'PO', 'product', '상품기획'],
  '마케팅': ['마케터', 'marketing', '마케팅팀'],
  '데이터': ['data', 'analyst', '분석', '데이터분석'],
  'AI': ['인공지능', 'artificial intelligence', '머신러닝', 'ML', 'machine learning'],
  '모바일': ['mobile', 'app', '앱', '안드로이드', 'android', 'iOS'],
  '게임': ['game', '게임개발', '게임기획'],
  '보안': ['security', '정보보안', '사이버보안'],
  'QA': ['테스트', 'test', '품질관리', 'quality'],
  'DevOps': ['데브옵스', '인프라', 'infrastructure', '운영'],
  'CTO': ['기술이사', '기술임원'],
  'HR': ['인사', '인사팀', 'human resources'],
  'CS': ['고객지원', '고객상담', 'customer service'],
  '영업': ['세일즈', 'sales', '비즈니스'],
  '인턴': ['intern', '인턴십', 'internship'],
  '신입': ['junior', '주니어', '신입사원'],
  '경력': ['senior', '시니어', '경력직']
}

// 초성 추출 함수
const getInitials = (text: string): string => {
  const initials = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
  return text.split('').map(char => {
    const code = char.charCodeAt(0) - 44032
    if (code >= 0 && code <= 11171) {
      return initials[Math.floor(code / 588)]
    }
    return char
  }).join('')
}

// 검색어 확장 함수 (유사어 포함)
const expandSearchTerm = (searchTerm: string): string[] => {
  const terms = [searchTerm.toLowerCase()]
  
  // 유사어 추가
  Object.entries(SYNONYMS).forEach(([key, synonyms]) => {
    if (key.toLowerCase().includes(searchTerm.toLowerCase()) || 
        synonyms.some(synonym => synonym.toLowerCase().includes(searchTerm.toLowerCase()))) {
      terms.push(key.toLowerCase())
      terms.push(...synonyms.map(s => s.toLowerCase()))
    }
  })
  
  return [...new Set(terms)] // 중복 제거
}

// 텍스트 검색 함수 (초성 + 유사어 지원)
const searchInText = (text: string | null, searchTerms: string[]): boolean => {
  if (!text) return false
  
  const lowerText = text.toLowerCase()
  const initials = getInitials(text)
  
  return searchTerms.some(term => {
    // 일반 텍스트 검색
    if (lowerText.includes(term)) return true
    
    // 초성 검색 (검색어가 모두 초성인 경우)
    if (/^[ㄱ-ㅎ]+$/.test(term)) {
      return initials.includes(term)
    }
    
    return false
  })
}

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
  getEmploymentFilter: () => employmentFilterGlobal,
  setEmploymentFilter: (filter: 'permanent' | 'contract' | 'all') => {
    employmentFilterGlobal = filter
    listeners.forEach(listener => listener())
  },
  getSearchTerm: () => searchTermGlobal,
  setSearchTerm: (term: string) => {
    searchTermGlobal = term
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
  const [employmentFilter, setEmploymentFilter] = useState<'permanent' | 'contract' | 'all'>('contract')
  const [searchTerm, setSearchTerm] = useState('')
  const [displayCount, setDisplayCount] = useState(20)

  // 글로벌 상태 구독
  useEffect(() => {
    const unsubscribe = companyStore.subscribe(() => {
      setSelectedCompany(companyStore.getSelectedCompany())
      setLiberalFilter(companyStore.getLiberalFilter())
      setEmploymentFilter(companyStore.getEmploymentFilter())
      setSearchTerm(companyStore.getSearchTerm())
      setDisplayCount(20) // 필터 변경 시 표시 개수 초기화
    })
    return () => unsubscribe()
  }, [])

  // 고용형태 필터링 함수
  const getEmploymentCategory = (employmentType: string | null): 'permanent' | 'contract' | 'unknown' => {
    if (!employmentType || employmentType.trim() === '') {
      return 'unknown'
    }
    
    const type = employmentType.trim()
    
    // 정규직 그룹
    if (type === '정규직' || type === '정규' || type === '임원') {
      return 'permanent'
    }
    
    // 계약직 그룹
    if (['계약직', '단기계약직', '인턴', '기간제', '어시스턴트', '계약', '프리랜서'].includes(type)) {
      return 'contract'
    }
    
    return 'unknown'
  }

  // 필터링된 채용공고 (즉시 계산)
  const filteredJobPosts = useMemo(() => {
    console.log(`🔍 클라이언트에서 필터링: ${selectedCompany}, 문과/이과: ${liberalFilter}, 고용형태: ${employmentFilter}, 검색어: "${searchTerm}"`)
    
    let filtered = allJobPosts

    // 0. 활성 상태 필터링 (is_active가 true인 것만)
    const activeCount = filtered.filter(post => post.is_active === true).length
    const inactiveCount = filtered.filter(post => post.is_active === false).length
    console.log(`📊 활성 상태 필터링: 활성 ${activeCount}개, 비활성 ${inactiveCount}개`)
    filtered = filtered.filter(post => post.is_active === true)

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

    // 3. 고용형태 필터링
    if (employmentFilter === 'permanent') {
      filtered = filtered.filter(post => getEmploymentCategory(post.employment_type) === 'permanent')
    } else if (employmentFilter === 'contract') {
      filtered = filtered.filter(post => getEmploymentCategory(post.employment_type) === 'contract')
    }
    // 'all'인 경우는 모든 결과 표시 (추가 필터링 없음)

    // 4. 검색어 필터링 (스마트 검색)
    if (searchTerm.trim()) {
      const expandedTerms = expandSearchTerm(searchTerm.trim())
      filtered = filtered.filter(post => {
        return searchInText(post.job_title, expandedTerms) || 
               searchInText(post.company_name, expandedTerms) ||
               searchInText(post.job_category_main, expandedTerms) ||
               searchInText(post.job_category_sub, expandedTerms)
      })
    }
    
    console.log(`📊 필터링 결과: ${filtered.length}개 (전체: ${allJobPosts.length}개)`)
    return filtered
  }, [allJobPosts, selectedCompany, liberalFilter, employmentFilter, searchTerm])

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

  // 직무 카테고리 표시 함수 (스마트 처리)
  const formatJobCategory = (main: string | null, sub: string | null): string => {
    if (!main) return '' // main이 없으면 빈 문자열
    
    // sub가 없거나 빈 문자열이거나 main과 같으면 main만 표시
    if (!sub || sub.trim() === '' || main === sub) {
      return main
    }
    
    // main과 sub가 다르면 점으로 연결해서 표시
    return `${main} · ${sub}`
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
            <div key={jobPost.id} className="relative">
              {/* NEW 배지 */}
              {isNewJobPost(jobPost.created_at) && <NewBadge />}
              
              <a
                href={addUtmParams(jobPost.job_url, { utm_source: 'letscareer', utm_medium: 'letscareer_mvp' })}
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
                          <div className="w-14 h-14 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center p-2">
                            <Image 
                              src={logoPath} 
                              alt={`${jobPost.company_name} 로고`} 
                              width={48} 
                              height={48} 
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
                              <span>{formatJobCategory(jobPost.job_category_main, jobPost.job_category_sub)}</span>
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