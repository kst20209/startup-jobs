'use client'

import { useState, useEffect, useRef } from 'react'
import { companyStore } from './JobPostList'

export default function LiberalToggle() {
  const [liberalFilter, setLiberalFilter] = useState<'liberal' | 'science' | 'all'>('liberal')
  const [employmentFilter, setEmploymentFilter] = useState<'permanent' | 'contract' | 'all'>('contract')
  const [liberalDropdownOpen, setLiberalDropdownOpen] = useState(false)
  const [employmentDropdownOpen, setEmploymentDropdownOpen] = useState(false)
  
  const liberalDropdownRef = useRef<HTMLDivElement>(null)
  const employmentDropdownRef = useRef<HTMLDivElement>(null)
  const liberalDropdownMenuRef = useRef<HTMLDivElement>(null)
  const employmentDropdownMenuRef = useRef<HTMLDivElement>(null)



  // 글로벌 상태 구독
  useEffect(() => {
    setLiberalFilter(companyStore.getLiberalFilter())
    setEmploymentFilter(companyStore.getEmploymentFilter())
    const unsubscribe = companyStore.subscribe(() => {
      setLiberalFilter(companyStore.getLiberalFilter())
      setEmploymentFilter(companyStore.getEmploymentFilter())
    })
    return unsubscribe
  }, [])

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      // 문과/이과 드롭다운 체크
      if (liberalDropdownOpen) {
        const isInsideButton = liberalDropdownRef.current?.contains(target)
        const isInsideMenu = liberalDropdownMenuRef.current?.contains(target)
        
        if (!isInsideButton && !isInsideMenu) {
          setLiberalDropdownOpen(false)
        }
      }
      
      // 고용형태 드롭다운 체크
      if (employmentDropdownOpen) {
        const isInsideButton = employmentDropdownRef.current?.contains(target)
        const isInsideMenu = employmentDropdownMenuRef.current?.contains(target)
        
        if (!isInsideButton && !isInsideMenu) {
          setEmploymentDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [liberalDropdownOpen, employmentDropdownOpen])

  const handleLiberalChange = (filter: 'liberal' | 'science' | 'all') => {
    console.log(`🔄 문과/이과 필터 변경: ${filter}`)
    setLiberalFilter(filter)
    companyStore.setLiberalFilter(filter)
    setLiberalDropdownOpen(false)
  }

  const handleEmploymentChange = (filter: 'permanent' | 'contract' | 'all') => {
    console.log(`🔄 고용형태 필터 변경: ${filter}`)
    setEmploymentFilter(filter)
    companyStore.setEmploymentFilter(filter)
    setEmploymentDropdownOpen(false)
  }

  const handleLiberalButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLiberalDropdownOpen(!liberalDropdownOpen)
    // 다른 드롭다운 닫기
    setEmploymentDropdownOpen(false)
  }

  const handleEmploymentButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setEmploymentDropdownOpen(!employmentDropdownOpen)
    // 다른 드롭다운 닫기
    setLiberalDropdownOpen(false)
  }

  const getLiberalButtonText = () => {
    switch (liberalFilter) {
      case 'liberal':
        return '문과'
      case 'science':
        return '이과'
      case 'all':
        return '전체'
      default:
        return '문과'
    }
  }

  const getEmploymentButtonText = () => {
    switch (employmentFilter) {
      case 'permanent':
        return '정규직'
      case 'contract':
        return '계약직'
      case 'all':
        return '전체'
      default:
        return '계약직'
    }
  }

  const liberalOptions = [
    { value: 'liberal', label: '문과' },
    { value: 'science', label: '이과' },
    { value: 'all', label: '전체' }
  ]

  const employmentOptions = [
    { value: 'permanent', label: '정규직' },
    { value: 'contract', label: '계약직' },
    { value: 'all', label: '전체' }
  ]

  return (
    <div className="mt-2 relative z-[100]" style={{ isolation: 'isolate', transform: 'translateZ(0)' }}>
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <div className="flex gap-2">
            {/* 문과/이과 드롭다운 */}
            <div className="relative" ref={liberalDropdownRef}>
              <button
                onClick={handleLiberalButtonClick}
                className="
                  px-3 py-1.5 rounded-md font-medium
                  transition-colors duration-200
                  text-sm border border-gray-200
                  bg-gray-100 hover:bg-gray-200 text-gray-600
                  flex items-center justify-between min-w-[80px]
                "
              >
                <span>{getLiberalButtonText()}</span>
                <svg 
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${liberalDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* 문과/이과 드롭다운 메뉴 */}
              {liberalDropdownOpen && (
                <div 
                  ref={liberalDropdownMenuRef}
                  className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-xl z-[100] w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  {liberalOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleLiberalChange(option.value as 'liberal' | 'science' | 'all')
                      }}
                      className={`
                        w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md
                        ${liberalFilter === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 고용형태 드롭다운 */}
            <div className="relative" ref={employmentDropdownRef}>
              <button
                onClick={handleEmploymentButtonClick}
                className="
                  px-3 py-1.5 rounded-md font-medium
                  transition-colors duration-200
                  text-sm border border-gray-200
                  bg-gray-100 hover:bg-gray-200 text-gray-600
                  flex items-center justify-between min-w-[80px]
                "
              >
                <span>{getEmploymentButtonText()}</span>
                <svg 
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${employmentDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* 고용형태 드롭다운 메뉴 */}
              {employmentDropdownOpen && (
                <div 
                  ref={employmentDropdownMenuRef}
                  className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-xl z-[100] w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  {employmentOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleEmploymentChange(option.value as 'permanent' | 'contract' | 'all')
                      }}
                      className={`
                        w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md
                        ${employmentFilter === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 