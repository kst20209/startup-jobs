'use client'

import { useState, useEffect, useRef } from 'react'
import { companyStore } from './JobPostList'

export default function SearchInput() {
  const [inputValue, setInputValue] = useState('')
  const timeoutRef = useRef<number | undefined>(undefined)

  // 디바운스된 검색 처리
  useEffect(() => {
    // 기존 타이머 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // 300ms 후에 검색 실행
    timeoutRef.current = window.setTimeout(() => {
      companyStore.setSearchTerm(inputValue)
    }, 300)

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [inputValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      placeholder="검색어를 입력하세요 (예: 운영, HR)"
      className="w-full max-w-lg px-4 py-3 rounded-xl border border-gray-200/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5D5DF6] focus:border-transparent transition text-base bg-white/70 backdrop-blur-sm placeholder-gray-400"
    />
  )
} 