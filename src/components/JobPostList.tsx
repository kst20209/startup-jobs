'use client'

import { useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { JobPost } from '@/types/database'
import Image from 'next/image'

const ITEMS_PER_PAGE = 10

// 회사 로고 매핑 함수
const getCompanyLogo = (companyName: string): string | null => {
  const logoMap: { [key: string]: string } = {
    '네이버': '/logos/naver.svg',
    'NAVER': '/logos/naver.svg',
    '카카오': '/logos/kakao.svg',
    'Kakao': '/logos/kakao.svg',
    'KAKAO': '/logos/kakao.svg',
    '쿠팡': '/logos/coupang.svg',
    'Coupang': '/logos/coupang.svg',
    '라인': '/logos/line.svg',
    'LINE': '/logos/line.svg',
    'Line': '/logos/line.svg',
    '배달의민족': '/logos/baemin.svg',
    '배민': '/logos/baemin.svg',
    'Baemin': '/logos/baemin.svg',
    '우아한형제들': '/logos/baemin.svg',
    '당근마켓': '/logos/daangn.svg',
    '당근': '/logos/daangn.svg',
    'Daangn': '/logos/daangn.svg',
    '토스': '/logos/toss.svg',
    'Toss': '/logos/toss.svg',
  }
  
  // 정확한 매치 확인
  if (logoMap[companyName]) {
    return logoMap[companyName]
  }
  
  // 부분 매치 확인 (회사명에 키워드가 포함된 경우)
  for (const [key, value] of Object.entries(logoMap)) {
    if (companyName.includes(key) || key.includes(companyName)) {
      return value
    }
  }
  
  return null
}

interface JobPostListProps {
  initialJobPosts: JobPost[]
  themeColor?: string
  selectedCompany?: string | null
}

export default function JobPostList({ initialJobPosts, themeColor = '#5D5DF6', selectedCompany }: JobPostListProps) {
  const [jobPosts, setJobPosts] = useState<JobPost[]>(initialJobPosts)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1) // 초기 데이터가 이미 있으므로 1부터 시작
  const observer = useRef<IntersectionObserver | undefined>(undefined)

  // 데이터 가져오기 함수
  const fetchJobPosts = useCallback(async (pageNum: number) => {
    setLoading(true)
    try {
      const from = pageNum * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      const { data: newJobPosts, error } = await supabase
        .from('JobPost')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        console.error('Error fetching job posts:', error)
        return
      }

      if (newJobPosts && newJobPosts.length > 0) {
        setJobPosts(prev => {
          // 기존 데이터와 새 데이터를 합친 후 중복 제거
          const combined = [...prev, ...newJobPosts]
          const uniqueJobPosts = combined.filter((post, index, array) => 
            array.findIndex(p => p.id === post.id) === index
          )
          return uniqueJobPosts
        })
        setHasMore(newJobPosts.length === ITEMS_PER_PAGE)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error fetching job posts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 무한 스크롤 관찰자 설정
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        const nextPage = page
        setPage(prev => prev + 1)
        fetchJobPosts(nextPage)
      }
    })
    
    if (node) observer.current.observe(node)
  }, [loading, hasMore, page, fetchJobPosts])

  // 색상을 연하게 만드는 함수
  const lightenColor = (color: string, alpha: number = 0.1): string => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // 필터링된 채용공고 계산
  const filteredJobPosts = selectedCompany 
    ? jobPosts.filter(post => 
        post.company_name.includes(selectedCompany) || 
        selectedCompany.includes(post.company_name)
      )
    : jobPosts

  return (
    <>
      {/* 채용공고 카드 목록 */}
      <div className="space-y-4">
        {filteredJobPosts.length === 0 && !loading ? (
          <div className="backdrop-blur-xl bg-white/90 rounded-xl shadow-sm border border-white/20 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedCompany ? `${selectedCompany} 채용공고가 없습니다` : '채용공고가 없습니다'}
            </h3>
            <p className="text-gray-500">새로운 채용공고가 등록되면 여기에 표시됩니다.</p>
          </div>
        ) : (
          filteredJobPosts.map((jobPost, index) => (
            <div
              key={jobPost.id}
              ref={index === filteredJobPosts.length - 1 ? lastElementRef : undefined}
            >
              <a
                href={jobPost.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block backdrop-blur-xl bg-white/90 rounded-xl shadow-sm border border-white/20 hover:shadow-xl hover:border-white/40 transition-all duration-300 group relative overflow-hidden"
                style={{
                  '--hover-bg': lightenColor(themeColor, 0.03)
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = lightenColor(themeColor, 0.03)
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = ''
                }}
              >
                {/* 카드 내부 glassmorph 효과 */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at 80% 20%, ${themeColor} 0%, transparent 70%)`
                  }}
                />
                
                <div className="p-6 relative z-10">
                  <div className="flex items-start space-x-4">
                    {/* 회사 로고 */}
                    <div className="flex-shrink-0">
                      {(() => {
                        const logoPath = getCompanyLogo(jobPost.company_name)
                        return logoPath ? (
                          <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-white/30 flex items-center justify-center p-2">
                            <Image 
                              src={logoPath} 
                              alt={`${jobPost.company_name} 로고`} 
                              width={32} 
                              height={32} 
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg"
                            style={{
                              background: `linear-gradient(135deg, ${themeColor} 0%, ${lightenColor(themeColor, 0.8)} 100%)`
                            }}
                          >
                            {jobPost.company_name.charAt(0).toUpperCase()}
                          </div>
                        )
                      })()}
                    </div>

                    {/* 채용공고 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* 회사 정보 */}
                          <div className="mb-2">
                            <h3 
                              className="text-sm font-medium text-gray-900 group-hover:transition-colors transition-colors duration-200"
                              style={{
                                '--hover-color': themeColor
                              } as React.CSSProperties}
                              onMouseEnter={(e) => {
                                if (e.currentTarget.closest('a:hover')) {
                                  e.currentTarget.style.color = themeColor
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = ''
                              }}
                            >
                              {jobPost.company_name}
                            </h3>
                            {jobPost.company_name_detail && (
                              <p className="text-xs text-gray-500 mt-1">
                                {jobPost.company_name_detail}
                              </p>
                            )}
                          </div>

                          {/* 채용공고 제목 */}
                          <h2 
                            className="text-lg font-semibold text-gray-900 mb-3 transition-colors duration-200 line-clamp-2"
                            style={{
                              '--hover-color': themeColor
                            } as React.CSSProperties}
                            onMouseEnter={(e) => {
                              if (e.currentTarget.closest('a:hover')) {
                                e.currentTarget.style.color = themeColor
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = ''
                            }}
                          >
                            {jobPost.job_title}
                          </h2>

                          {/* 태그들 */}
                          <div className="flex flex-wrap gap-2">
                            <span 
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border transition-all duration-200"
                              style={{
                                backgroundColor: lightenColor('#10B981', 0.1),
                                borderColor: lightenColor('#10B981', 0.2),
                                color: '#047857'
                              }}
                            >
                              {jobPost.position}
                            </span>
                            <span 
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border transition-all duration-200"
                              style={{
                                backgroundColor: lightenColor(themeColor, 0.1),
                                borderColor: lightenColor(themeColor, 0.2),
                                color: themeColor
                              }}
                            >
                              {jobPost.employment_type}
                            </span>
                          </div>
                        </div>

                        {/* 화살표 아이콘 */}
                        <div className="flex-shrink-0 ml-4">
                          <svg 
                            className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-all duration-200" 
                            style={{
                              '--hover-color': themeColor
                            } as React.CSSProperties}
                            onMouseEnter={(e) => {
                              if (e.currentTarget.closest('a:hover')) {
                                e.currentTarget.style.color = themeColor
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = ''
                            }}
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
      </div>

      {/* 로딩 스피너 */}
      {loading && (
        <div className="flex justify-center py-8">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: themeColor }}
          ></div>
        </div>
      )}

      {/* 더 이상 데이터가 없을 때 */}
      {!hasMore && filteredJobPosts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">모든 채용공고를 확인했습니다.</p>
        </div>
      )}
    </>
  )
} 