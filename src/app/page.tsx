import { supabase } from '@/lib/supabase'
import { JobPost } from '@/types/database'

// 서버 컴포넌트에서 데이터 가져오기
async function getJobPosts(): Promise<JobPost[]> {
  const { data: jobPosts, error } = await supabase
    .from('JobPost')  // 테이블 이름 변경
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching job posts:', error)
    return []
  }

  return jobPosts || []
}

export default async function HomePage() {
  const jobPosts = await getJobPosts()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              스타트업 채용공고 검색기
            </h1>
            <p className="text-gray-600 mt-1">
              최신 스타트업 채용 정보를 한눈에 확인하세요
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    회사명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    그룹
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    채용공고
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    직무
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    근무형태
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobPosts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      채용공고가 없습니다.
                    </td>
                  </tr>
                ) : (
                  jobPosts.map((jobPost) => (
                    <tr key={jobPost.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {jobPost.company_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {jobPost.company_name_detail}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={jobPost.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-sm"
                        >
                          {jobPost.job_title}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {jobPost.position}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {jobPost.employment_type}
                        </span>
                      </td>
                    
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {jobPosts.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                총 {jobPosts.length}개의 채용공고가 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}