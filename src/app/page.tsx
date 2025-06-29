import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { JobPost } from '@/types/database'
import DynamicBackground from '@/components/DynamicBackground'
import CompanyButton, { AllCompaniesButton } from '@/components/CompanyButton'
import JobPostList from '@/components/JobPostList'
import Image from 'next/image'

// 기업 정보 (서버에서 정의)
const corporations = [
  { 
    name: '네이버', 
    color: '#03C75A', 
    logo: '/logos/naver.svg',
    logoStyle: 'no-bg' as const,
    logoSize: { width: 48, height: 48 },
    objectFit: 'contain' as const
  },
  { 
    name: '카카오', 
    color: '#FFDC00', 
    logo: '/logos/kakao.svg',
    logoStyle: 'no-bg' as const,
    logoSize: { width: 48, height: 48 },
    objectFit: 'contain' as const
  },
  { 
    name: '쿠팡', 
    color: '#F7552F', 
    logo: '/logos/coupang.svg',
    logoStyle: 'with-bg' as const,
    logoSize: { width: 36, height: 20 },
    objectFit: 'contain' as const
  },
  { 
    name: '라인', 
    color: '#3ACD01', 
    logo: '/logos/line.svg',
    logoStyle: 'no-bg' as const,
    logoSize: { width: 48, height: 48 },
    objectFit: 'contain' as const
  },
  { 
    name: '배민', 
    color: '#40BFB9', 
    logo: '/logos/baemin.svg',
    logoStyle: 'no-bg' as const,
    logoSize: { width: 40, height: 24 },
    objectFit: 'contain' as const
  },
  { 
    name: '당근', 
    color: '#FF6F0F', 
    logo: '/logos/daangn.svg',
    logoStyle: 'with-bg-circle' as const,
    logoSize: { width: 40, height: 40 },
    objectFit: 'cover' as const
  },
  { 
    name: '토스', 
    color: '#0064FF', 
    logo: '/logos/toss.svg',
    logoStyle: 'with-bg-circle' as const,
    logoSize: { width: 48, height: 48 },
    objectFit: 'cover' as const
  },
]

interface HomePageProps {
  searchParams: { company?: string }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const selectedCompany = searchParams.company || '전체'
  const initialJobPosts = await getInitialJobPosts(selectedCompany)

  return (
    <div className="min-h-screen relative">
      {/* 동적 배경 - 클라이언트 컴포넌트 */}
      <Suspense fallback={null}>
        <DynamicBackground />
      </Suspense>

      {/* 헤더 - 서버 컴포넌트 (고정 색상 #5D5DF6) */}
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* 메인 타이틀 및 검색창 카드 - 서버 컴포넌트 */}
        <div className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-xl border border-white/20 p-8 mb-8 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              스타트업 채용공고 검색기
            </h1>
            <p className="text-gray-600 mb-6">
              최신 스타트업 채용 정보를 한눈에 확인하세요
              {selectedCompany !== '전체' && (
                <span className="block mt-1 text-sm text-blue-600">
                  현재 "{selectedCompany}" 채용공고만 표시 중
                </span>
              )}
            </p>
            <div className="flex justify-center">
              <input
                type="text"
                placeholder="검색어를 입력하세요 (예: 프론트엔드, 네이버)"
                className="w-full max-w-lg px-4 py-3 rounded-xl border border-gray-200/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5D5DF6] focus:border-transparent transition text-base bg-white/70 backdrop-blur-sm placeholder-gray-400"
                disabled
              />
            </div>
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

        {/* 선택된 기업 정보 표시 */}
        {selectedCompany !== '전체' && (
          <div className="mb-4 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 border border-blue-200 text-blue-800">
              <span className="mr-2">🏢</span>
              "{selectedCompany}" 채용공고 {initialJobPosts.length}개 (서버에서 필터링됨)
            </div>
          </div>
        )}

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
          <JobPostList initialJobPosts={initialJobPosts} />
        </Suspense>
      </main>
    </div>
  )
}

// 서버 컴포넌트에서 필터링된 초기 데이터 가져오기
async function getInitialJobPosts(selectedCompany?: string): Promise<JobPost[]> {
  try {
    let query = supabase
      .from('JobPost')
      .select('*')
      .order('created_at', { ascending: false })

    // 선택된 기업이 있으면 서버에서 정확히 매칭
    if (selectedCompany && selectedCompany !== '전체') {
      query = query.eq('company_name', selectedCompany)
      console.log(`🔍 서버에서 ${selectedCompany} 정확 매칭 필터링`)
    }

    const { data: jobPosts, error } = await query.limit(20)

    if (error) {
      console.error('Error fetching job posts:', error)
      return []
    }

    // 디버깅: 실제 데이터베이스의 모든 company_name 출력
    if (jobPosts && jobPosts.length > 0) {
      const uniqueCompanies = [...new Set(jobPosts.map(post => post.company_name))].sort()
      console.log('🏢 실제 DB에 있는 company_name들:', uniqueCompanies)
    }

    console.log(`📊 서버에서 가져온 데이터: ${jobPosts?.length || 0}개`)
    return jobPosts || []
  } catch (error) {
    console.error('Server fetch error:', error)
    return []
  }
}