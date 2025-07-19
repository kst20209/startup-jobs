'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { companyStore } from './JobPostList'

export default function LiberalToggle() {
  const [liberalFilter, setLiberalFilter] = useState<'liberal' | 'science' | 'all'>('liberal')
  const [employmentFilter, setEmploymentFilter] = useState<'permanent' | 'contract' | 'all'>('contract')
  const [liberalDropdownOpen, setLiberalDropdownOpen] = useState(false)
  const [employmentDropdownOpen, setEmploymentDropdownOpen] = useState(false)
  
  const liberalDropdownRef = useRef<HTMLDivElement>(null)
  const employmentDropdownRef = useRef<HTMLDivElement>(null)
  const liberalButtonRef = useRef<HTMLButtonElement>(null)
  const employmentButtonRef = useRef<HTMLButtonElement>(null)

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
      if (liberalButtonRef.current && !liberalButtonRef.current.contains(event.target as Node)) {
        setLiberalDropdownOpen(false)
      }
      if (employmentButtonRef.current && !employmentButtonRef.current.contains(event.target as Node)) {
        setEmploymentDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLiberalChange = (filter: 'liberal' | 'science' | 'all') => {
    setLiberalFilter(filter)
    companyStore.setLiberalFilter(filter)
    setLiberalDropdownOpen(false)
  }

  const handleEmploymentChange = (filter: 'permanent' | 'contract' | 'all') => {
    setEmploymentFilter(filter)
    companyStore.setEmploymentFilter(filter)
    setEmploymentDropdownOpen(false)
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

  // 드롭다운 위치 계산
  const getDropdownPosition = (buttonRef: React.RefObject<HTMLButtonElement | null>) => {
    if (!buttonRef.current) return { top: 0, left: 0, width: 0 }
    
    const rect = buttonRef.current.getBoundingClientRect()
    return {
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width
    }
  }

  return (
    <div className="mt-2 relative z-[999]">
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <div className="flex gap-2">
            {/* 문과/이과 드롭다운 */}
            <div className="relative" ref={liberalDropdownRef}>
              <button
                ref={liberalButtonRef}
                onClick={() => setLiberalDropdownOpen(!liberalDropdownOpen)}
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
            </div>

            {/* 고용형태 드롭다운 */}
            <div className="relative" ref={employmentDropdownRef}>
              <button
                ref={employmentButtonRef}
                onClick={() => setEmploymentDropdownOpen(!employmentDropdownOpen)}
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
            </div>
          </div>
        </div>
      </div>

      {/* Portal을 사용한 드롭다운 렌더링 */}
      {liberalDropdownOpen && typeof window !== 'undefined' && createPortal(
        <div 
          className="fixed bg-white border border-gray-200 rounded-md shadow-lg z-[9999]"
          style={{
            top: getDropdownPosition(liberalButtonRef).top,
            left: getDropdownPosition(liberalButtonRef).left,
            width: getDropdownPosition(liberalButtonRef).width
          }}
        >
          {liberalOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleLiberalChange(option.value as 'liberal' | 'science' | 'all')}
              className={`
                w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors
                ${liberalFilter === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>,
        document.body
      )}

      {employmentDropdownOpen && typeof window !== 'undefined' && createPortal(
        <div 
          className="fixed bg-white border border-gray-200 rounded-md shadow-lg z-[9999]"
          style={{
            top: getDropdownPosition(employmentButtonRef).top,
            left: getDropdownPosition(employmentButtonRef).left,
            width: getDropdownPosition(employmentButtonRef).width
          }}
        >
          {employmentOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleEmploymentChange(option.value as 'permanent' | 'contract' | 'all')}
              className={`
                w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors
                ${employmentFilter === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
} 