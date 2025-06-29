import { supabase } from '@/lib/supabase'
import { JobPost } from '@/types/database'
import JobPostList from '@/components/JobPostList'
import Image from 'next/image'

// 서버 컴포넌트에서 초기 데이터 가져오기
async function getInitialJobPosts(): Promise<JobPost[]> {
  const { data: jobPosts, error } = await supabase
    .from('JobPost')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10) // 초기 10개만 가져오기

  if (error) {
    console.error('Error fetching job posts:', error)
    return []
  }

  return jobPosts || []
}

export default async function HomePage() {
  const initialJobPosts = await getInitialJobPosts()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="w-full border-b bg-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <Image src="/globe.svg" alt="logo" width={32} height={32} />
            <span className="font-extrabold text-xl tracking-tight text-gray-800">LETS CAREER</span>
            <nav className="ml-8 flex gap-6 text-gray-700 text-base font-medium">
              
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-blue-600 hover:underline font-medium">로그인</button>
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold shadow hover:bg-blue-700 transition">회원가입</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 메인 타이틀 및 검색창 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
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
              className="w-full max-w-lg px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-base bg-white placeholder-gray-400"
              disabled
            />
          </div>
        </div>

        {/* 기업 버튼 리스트 */}
        <div className="mb-6">
          <div className="flex gap-3 justify-center flex-wrap">
            {[
              { 
                name: '네이버', 
                color: '#03C75A', 
                logo: '/logos/naver.svg',
                logoStyle: 'no-bg', // 흰색 배경 없음
                logoSize: { width: 48, height: 48 }, // 대폭 증가
                objectFit: 'contain'
              },
              { 
                name: '카카오', 
                color: '#FFDC00', 
                logo: '/logos/kakao.svg',
                logoStyle: 'no-bg', // 흰색 배경 없음
                logoSize: { width: 48, height: 48 }, // 대폭 증가
                objectFit: 'contain'
              },
              { 
                name: '쿠팡', 
                color: '#F7552F', 
                logo: '/logos/coupang.svg',
                logoStyle: 'with-bg', // 정사각형 흰색 배경 (이전 형태)
                logoSize: { width: 36, height: 20 }, // 이전 크기로 복원
                objectFit: 'contain' // 이전 방식으로 복원
              },
              { 
                name: '라인', 
                color: '#3ACD01', 
                logo: '/logos/line.svg',
                logoStyle: 'no-bg', // 흰색 배경 없음
                logoSize: { width: 48, height: 48 }, // 대폭 증가
                objectFit: 'contain'
              },
              { 
                name: '배민', 
                color: '#40BFB9', 
                logo: '/logos/baemin.svg',
                logoStyle: 'no-bg', // 흰색 배경 없음 (유지)
                logoSize: { width: 40, height: 24 }, // 이전 크기로 복원
                objectFit: 'contain' // 이전 방식으로 복원
              },
              { 
                name: '당근', 
                color: '#FF6F0F', 
                logo: '/logos/daangn.svg',
                logoStyle: 'with-bg-circle', // 동그라미 흰색 배경
                logoSize: { width: 40, height: 40 }, // 중앙 크롭용 크기
                objectFit: 'cover'
              },
              { 
                name: '토스', 
                color: '#0064FF', 
                logo: '/logos/toss.svg',
                logoStyle: 'with-bg-circle', // 동그라미 흰색 배경
                logoSize: { width: 48, height: 48 }, // SVG만 더 크게 (컨테이너는 그대로)
                objectFit: 'cover'
              },
            ].map((corp) => (
              <button
                key={corp.name}
                className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none backdrop-blur-sm`}
                style={{
                  backgroundColor: corp.color,
                  opacity: 0.9
                }}
                tabIndex={-1}
                disabled
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
        <JobPostList initialJobPosts={initialJobPosts} />
      </main>
    </div>
  )
}