import { supabase } from '@/lib/supabase'
import { JobPost } from '@/types/database'
import JobPostList from '@/components/JobPostList'

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            스타트업 채용공고 검색기
          </h1>
          <p className="text-gray-600">
            최신 스타트업 채용 정보를 한눈에 확인하세요
          </p>
        </div>

        {/* 채용공고 목록 컴포넌트 */}
        <JobPostList initialJobPosts={initialJobPosts} />
      </div>
    </div>
  )
}