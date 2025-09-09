'use client'

import { useState } from 'react'
import { companyStore } from './JobPostList'
import { saveSearchLog } from '@/lib/supabase'

export default function SearchInput() {
  const [inputValue, setInputValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSearch = async () => {
    if (!inputValue.trim()) return

    setIsSearching(true)
    
    try {
      // 검색 로그를 데이터베이스에 저장
      await saveSearchLog(inputValue.trim())
      
      // 검색 실행
      companyStore.setSearchTerm(inputValue.trim())
    } catch (error) {
      console.error('검색 중 오류 발생:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="w-full max-w-lg flex gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="검색어를 입력하세요 (예: 운영, HR)"
        className="flex-1 px-4 py-3 rounded-xl border border-gray-200/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5D5DF6] focus:border-transparent transition text-base bg-white/70 backdrop-blur-sm placeholder-gray-400 md:px-3 md:py-2.5 md:text-sm sm:px-3 sm:py-2 sm:text-sm xs:px-2 xs:py-1.5 xs:text-xs"
      />
      <button
        onClick={handleSearch}
        disabled={isSearching || !inputValue.trim()}
        className="px-6 py-3 bg-[#5D5DF6] text-white rounded-xl hover:bg-[#4A4AE5] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-base md:px-4 md:py-2.5 md:text-sm sm:px-3 sm:py-2 sm:text-sm xs:px-2 xs:py-1.5 xs:text-xs"
      >
        {isSearching ? '검색중...' : '검색'}
      </button>
    </div>
  )
} 