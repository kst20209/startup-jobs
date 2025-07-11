'use client'

import { useState, useEffect } from 'react'
import { companyStore } from './JobPostList'

export default function LiberalToggle() {
  const [liberalFilter, setLiberalFilter] = useState<'liberal' | 'science' | 'all'>('liberal')

  // 글로벌 상태 구독
  useEffect(() => {
    setLiberalFilter(companyStore.getLiberalFilter())
    const unsubscribe = companyStore.subscribe(() => {
      setLiberalFilter(companyStore.getLiberalFilter())
    })
    return unsubscribe
  }, [])

  const handleToggle = () => {
    let nextFilter: 'liberal' | 'science' | 'all'
    
    switch (liberalFilter) {
      case 'liberal':
        nextFilter = 'science'
        break
      case 'science':
        nextFilter = 'all'
        break
      case 'all':
        nextFilter = 'liberal'
        break
      default:
        nextFilter = 'liberal'
    }
    
    companyStore.setLiberalFilter(nextFilter)
  }

  const getButtonText = () => {
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

  const getButtonColor = () => {
    // 모든 상태에서 동일한 색상 사용 (나중에 쉽게 변경 가능)
    const baseColor = 'bg-gray-100 hover:bg-gray-200 text-gray-600'
    
    switch (liberalFilter) {
      case 'liberal':
        return baseColor
      case 'science':
        return baseColor
      case 'all':
        return baseColor
      default:
        return baseColor
    }
  }

  return (
    <div className="mt-4">
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <div className="flex gap-2">
            <button
              onClick={handleToggle}
              className={`
                ${getButtonColor()}
                px-3 py-1.5 rounded-md font-medium
                transition-colors duration-200
                text-sm border border-gray-200
              `}
              title={`현재: ${getButtonText()}, 클릭하여 변경`}
            >
              {getButtonText()}
            </button>
            {/* 향후 추가될 토글 버튼들이 여기에 들어갈 예정 */}
          </div>
        </div>
      </div>
    </div>
  )
} 