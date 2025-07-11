import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { JobPost } from '@/types/database'
import DynamicBackground from '@/components/DynamicBackground'
import CompanyButton, { AllCompaniesButton } from '@/components/CompanyButton'
import JobPostList from '@/components/JobPostList'
import Header from '@/components/Header'
import LiberalToggle from '@/components/LiberalToggle'

// 24시간마다 revalidate (하루 한 번 데이터 업데이트)
export const revalidate = 86400

// 기업 정보 (서버에서 정의)
const corporations = [
  { 
    name: '네이버', 
    color: '#03C75A', 
    logo: '/logos/naver.svg',
    logoStyle: 'no-bg' as const,
    logoSize: { width: 48, height: 48 },
    objectFit: 'contain' as const,
    scale: 1.2 // 기본 크기
  },
  { 
    name: '카카오', 
    color: '#FFDC00', 
    logo: '/logos/kakao.svg',
    logoStyle: 'no-bg' as const,
    logoSize: { width: 48, height: 48 },
    objectFit: 'contain' as const,
    scale: 1.0 // 기본 크기
  },
  { 
    name: '쿠팡', 
    color: '#F7552F', 
    logo: '/logos/coupang.svg',
    logoStyle: 'with-bg' as const,
    logoSize: { width: 36, height: 20 },
    objectFit: 'contain' as const,
    scale: 1.5 // 좀 더 크게
  },
  { 
    name: '라인', 
    color: '#3ACD01', 
    logo: '/logos/line.svg',
    logoStyle: 'no-bg' as const,
    logoSize: { width: 48, height: 48 },
    objectFit: 'contain' as const,
    scale: 1.5 // 기본 크기
  },
  { 
    name: '배민', 
    color: '#40BFB9', 
    logo: '/logos/baemin.svg',
    logoStyle: 'no-bg' as const,
    logoSize: { width: 40, height: 24 },
    objectFit: 'contain' as const,
    scale: 1.0 // 더 크게 (가로로 긴 로고)
  },
  { 
    name: '당근', 
    color: '#FF6F0F', 
    logo: '/logos/daangn.svg',
    logoStyle: 'with-bg-circle' as const,
    logoSize: { width: 40, height: 40 },
    objectFit: 'cover' as const,
    scale: 1.3 // 좀 더 작게 (원형 배경에 맞춤)
  },
  { 
    name: '토스', 
    color: '#0064FF', 
    logo: '/logos/toss.svg',
    logoStyle: 'with-bg-circle' as const,
    logoSize: { width: 48, height: 48 },
    objectFit: 'cover' as const,
    scale: 0.9 // 좀 더 작게 (원형 배경에 맞춤)
  },
]

export default async function HomePage() {
  // 빌드 시점에 모든 채용공고 데이터 가져오기
  const allJobPosts = await getAllJobPosts()

  return (
    <div className="min-h-screen relative">
      {/* 동적 배경 - 클라이언트 컴포넌트 */}
      <Suspense fallback={null}>
        <DynamicBackground />
      </Suspense>

      {/* 헤더 - 클라이언트 컴포넌트 (피드백 모달 포함) */}
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* 메인 타이틀 및 검색창 카드 - 서버 컴포넌트 */}
        <div className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-xl border border-white/20 p-8 mb-8 text-center relative overflow-hidden">
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
                className="w-full max-w-lg px-4 py-3 rounded-xl border border-gray-200/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5D5DF6] focus:border-transparent transition text-base bg-white/70 backdrop-blur-sm placeholder-gray-400"
                disabled
              />
            </div>
            {/* 문과/이과 토글 버튼 */}
        <Suspense fallback={
          <div className="flex justify-center mb-6">
            <div className="w-24 h-12 rounded-xl bg-gray-300 animate-pulse" />
          </div>
        }>
          <LiberalToggle />
        </Suspense>
          </div>
        </div>

        {/* 기업 버튼 리스트 - 클라이언트 컴포넌트 */}
        <div className="mb-6">
          <div className="flex gap-3 justify-center flex-wrap">
            {/* 전체 보기 버튼 */}
            <Suspense fallback={
              <div className="w-20 h-20 rounded-2xl bg-gray-300 animate-pulse" />
            }>
              <AllCompaniesButton />
            </Suspense>

            {/* 기업 버튼들 */}
            {corporations.map((corp) => (
              <Suspense 
                key={corp.name}
                fallback={
                  <div className="w-20 h-20 rounded-2xl bg-gray-300 animate-pulse" />
                }
              >
                <CompanyButton company={corp} />
              </Suspense>
            ))}
          </div>
        </div>

        {/* 채용공고 목록 컴포넌트 - 클라이언트 컴포넌트 */}
        <Suspense fallback={
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white/90 rounded-xl p-6 animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/4" />
                    <div className="h-6 bg-gray-300 rounded w-3/4" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-300 rounded w-16" />
                      <div className="h-6 bg-gray-300 rounded w-20" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }>
          <JobPostList allJobPosts={allJobPosts} />
        </Suspense>
      </main>
    </div>
  )
}

// 빌드 시점에 모든 채용공고 데이터 가져오기 (SSG)
async function getAllJobPosts(): Promise<JobPost[]> {
  try {
    console.log('🚀 빌드 시점에 모든 채용공고 데이터 가져오는 중...')
    
    const { data: jobPosts, error } = await supabase
      .from('JobPost')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all job posts:', error)
      return []
    }

    console.log(`✅ 총 ${jobPosts?.length || 0}개의 채용공고를 빌드 시점에 가져왔습니다`)
    
    // 디버깅: 실제 데이터베이스의 모든 company_name 출력
    if (jobPosts && jobPosts.length > 0) {
      const uniqueCompanies = [...new Set(jobPosts.map(post => post.company_name))].sort()
      console.log('🏢 DB에 있는 모든 company_name들:', uniqueCompanies)
    }

    return jobPosts || []
  } catch (error) {
    console.error('Build time fetch error:', error)
    return []
  }
}