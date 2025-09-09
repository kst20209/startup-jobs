import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// 검색 로그를 저장하는 함수
export async function saveSearchLog(searchTerm: string) {
  if (!searchTerm.trim()) return

  try {
    // 사용자 정보 수집 (선택적)
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : null
    
    // 검색 로그 저장
    const { error: insertError } = await supabase
      .from('search_logs')
      .insert({
        search_term: searchTerm.trim(),
        user_agent: userAgent,
        created_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('검색 로그 저장 중 오류:', insertError)
    }
  } catch (error) {
    console.error('검색 로그 저장 중 예상치 못한 오류:', error)
  }
}

// 인기 검색어를 가져오는 함수 (search_logs에서 집계)
export async function getPopularSearchTerms(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('search_logs')
      .select('search_term, created_at')
      .order('created_at', { ascending: false })
      .limit(1000) // 최근 1000개 로그에서 집계

    if (error) {
      console.error('검색 로그 조회 중 오류:', error)
      return []
    }

    // 검색어별 빈도 계산
    const termCounts: { [key: string]: { count: number; lastSearched: string } } = {}
    
    data?.forEach(log => {
      const term = log.search_term
      if (termCounts[term]) {
        termCounts[term].count++
        if (log.created_at && log.created_at > termCounts[term].lastSearched) {
          termCounts[term].lastSearched = log.created_at
        }
      } else {
        termCounts[term] = {
          count: 1,
          lastSearched: log.created_at || new Date().toISOString()
        }
      }
    })

    // 빈도순으로 정렬하여 상위 검색어 반환
    return Object.entries(termCounts)
      .map(([search_term, data]) => ({
        search_term,
        search_count: data.count,
        last_searched_at: data.lastSearched
      }))
      .sort((a, b) => b.search_count - a.search_count)
      .slice(0, limit)
  } catch (error) {
    console.error('인기 검색어 조회 중 예상치 못한 오류:', error)
    return []
  }
}