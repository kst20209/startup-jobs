'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { JobPost } from '@/types/database'
import Image from 'next/image'

// 기업별 색상 매핑 (실제 DB company_name에 맞춤)
const COMPANY_COLORS: { [key: string]: string } = {
  '네이버 (Naver)': '#03C75A',
  '카카오 (Kakao)': '#FFDC00', 
  '쿠팡 (Coupang)': '#F7552F',
  '라인 (LINE)': '#3ACD01',
  '우아한형제들 (Woowahan)': '#40BFB9',
  '당근 (Carrot)': '#FF6F0F',
  '토스 (Toss)': '#0064FF',
  // 단순 이름도 지원 (fallback)
  '네이버': '#03C75A',
  '카카오': '#FFDC00', 
  '쿠팡': '#F7552F',
  '라인': '#3ACD01',
  '배민': '#40BFB9',
  '당근': '#FF6F0F',
  '토스': '#0064FF'
}

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

interface JobPostListProps {
  initialJobPosts: JobPost[]
}

export default function JobPostList({ initialJobPosts }: JobPostListProps) {
  const searchParams = useSearchParams()
  const selectedCompany = searchParams.get('company') || '전체'
  
  const [jobPosts, setJobPosts] = useState<JobPost[]>(initialJobPosts)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const observerRef = useRef<HTMLDivElement>(null)

  // URL 변경 시 초기 데이터 재설정
  useEffect(() => {
    console.log(`🔄 URL 변경됨: ${selectedCompany}, 초기 데이터: ${initialJobPosts.length}개`)
    setJobPosts(initialJobPosts)
    setHasMore(initialJobPosts.length >= 20)
    setError(null)
  }, [selectedCompany, initialJobPosts])

  // 무한 스크롤로 추가 데이터 로드 (정확한 회사명 매칭)
  const loadMoreJobPosts = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setError(null)

    try {
      console.log(`📡 추가 데이터 로드 시작 (${selectedCompany}), 현재: ${jobPosts.length}개`)
      
      let query = supabase
        .from('JobPost')
        .select('*')
        .order('created_at', { ascending: false })
        .range(jobPosts.length, jobPosts.length + 19)

      // 선택된 기업이 있으면 정확히 매칭
      if (selectedCompany && selectedCompany !== '전체') {
        query = query.eq('company_name', selectedCompany)
        console.log(`🔍 무한스크롤에서 ${selectedCompany} 정확 매칭`)
      }

      const { data: newJobPosts, error } = await query

      if (error) {
        console.error('무한스크롤 에러:', error)
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
        return
      }

      console.log(`📊 추가로 가져온 데이터: ${newJobPosts?.length || 0}개`)

      if (newJobPosts && newJobPosts.length > 0) {
        setJobPosts(prev => [...prev, ...newJobPosts])
        setHasMore(newJobPosts.length === 20)
      } else {
        setHasMore(false)
        console.log('✅ 더 이상 불러올 데이터가 없습니다')
      }
    } catch (error) {
      console.error('로드 중 에러:', error)
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [jobPosts.length, selectedCompany, loading, hasMore])

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMoreJobPosts()
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [loadMoreJobPosts, loading, hasMore])

  const getThemeColor = (companyName: string) => {
    return COMPANY_COLORS[companyName] || '#5D5DF6'
  }

  const getCompanyLogo = (companyName: string) => {
    return COMPANY_LOGOS[companyName] || null
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">⚠️ {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          새로고침
        </button>
      </div>
    )
  }

  if (jobPosts.length === 0 && !loading) {
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
        {loading && (
          <div className="text-sm text-blue-600">
            📡 로딩 중...
          </div>
        )}
      </div>

      {/* 채용공고 목록 */}
      <div className="space-y-6">
        {jobPosts.map((post, index) => {
          const themeColor = getThemeColor(post.company_name)
          const logoPath = getCompanyLogo(post.company_name)
          
          return (
            <div
              key={`${post.id}-${index}`}
              className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {logoPath ? (
                    <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-white/30 flex items-center justify-center p-2">
                      <Image 
                        src={logoPath} 
                        alt={`${post.company_name} 로고`} 
                        width={32} 
                        height={32} 
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
                      style={{ backgroundColor: themeColor }}
                    >
                      {post.company_name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-medium text-white shadow-sm"
                      style={{ backgroundColor: themeColor }}
                    >
                      {post.company_name}
                    </span>
                    {post.employment_type && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {post.employment_type}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {post.job_title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <span>💼</span>
                      <span>{post.position}</span>
                    </div>
                    {post.employment_type && (
                      <div className="flex items-center gap-1">
                        <span>📄</span>
                        <span>{post.employment_type}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {post.created_at ? new Date(post.created_at).toLocaleDateString('ko-KR') : '날짜 미상'}
                    </span>
                    {post.job_url && (
                      <a
                        href={post.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md text-white hover:opacity-90"
                        style={{ backgroundColor: themeColor }}
                      >
                        지원하기 →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 무한 스크롤 트리거 */}
      {hasMore && (
        <div ref={observerRef} className="py-8 text-center">
          {loading ? (
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              추가 채용공고를 불러오는 중...
            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              스크롤하여 더 많은 채용공고 보기
            </div>
          )}
        </div>
      )}

      {/* 마지막 메시지 */}
      {!hasMore && jobPosts.length > 0 && (
        <div className="py-8 text-center text-gray-500 text-sm">
          {selectedCompany === '전체' 
            ? '🎉 모든 채용공고를 확인했습니다!' 
            : `🎉 ${selectedCompany}의 모든 채용공고를 확인했습니다!`
          }
        </div>
      )}
    </div>
  )
} 