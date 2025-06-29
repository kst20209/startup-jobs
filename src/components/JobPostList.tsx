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
}

export default function JobPostList({ initialJobPosts }: JobPostListProps) {
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

  return (
    <>
      {/* 채용공고 카드 목록 */}
      <div className="space-y-4">
        {jobPosts.length === 0 && !loading ? (
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
          jobPosts.map((jobPost, index) => (
            <div
              key={jobPost.id}
              ref={index === jobPosts.length - 1 ? lastElementRef : undefined}
            >
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
                          {/* 회사 정보 */}
                          <div className="mb-2">
                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {jobPost.company_name}
                            </h3>
                            {jobPost.company_name_detail && (
                              <p className="text-xs text-gray-500 mt-1">
                                {jobPost.company_name_detail}
                              </p>
                            )}
                          </div>

                          {/* 채용공고 제목 */}
                          <h2 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {jobPost.job_title}
                          </h2>

                          {/* 태그들 */}
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {jobPost.position}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {jobPost.employment_type}
                            </span>
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

        {/* 로딩 인디케이터 */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">채용공고를 불러오는 중...</span>
            </div>
          </div>
        )}

        {/* 더 이상 데이터가 없을 때 */}
        {!hasMore && jobPosts.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">모든 채용공고를 불러왔습니다</p>
          </div>
        )}
      </div>

      {/* 하단 통계 */}
      {jobPosts.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              총 <span className="font-semibold text-gray-900">{jobPosts.length}개</span>의 채용공고가 있습니다
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>카드를 클릭하면 채용공고 페이지로 이동합니다</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 