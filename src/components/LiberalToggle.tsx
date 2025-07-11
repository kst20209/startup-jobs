'use client'

import { useState, useEffect } from 'react'
import { companyStore } from './JobPostList'

export default function LiberalToggle() {
  const [liberalFilter, setLiberalFilter] = useState<'liberal' | 'science' | 'all'>('liberal')
  const [employmentFilter, setEmploymentFilter] = useState<'permanent' | 'contract' | 'all'>('contract')

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

  const handleLiberalToggle = () => {
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

  const handleEmploymentToggle = () => {
    let nextFilter: 'permanent' | 'contract' | 'all'
    
    switch (employmentFilter) {
      case 'permanent':
        nextFilter = 'contract'
        break
      case 'contract':
        nextFilter = 'all'
        break
      case 'all':
        nextFilter = 'permanent'
        break
      default:
        nextFilter = 'contract'
    }
    
    companyStore.setEmploymentFilter(nextFilter)
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

  const getButtonColor = () => {
    // 모든 상태에서 동일한 색상 사용 (나중에 쉽게 변경 가능)
    const baseColor = 'bg-gray-100 hover:bg-gray-200 text-gray-600'
    return baseColor
  }

  return (
    <div className="mt-4">
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <div className="flex gap-2">
            <button
              onClick={handleLiberalToggle}
              className={`
                ${getButtonColor()}
                px-3 py-1.5 rounded-md font-medium
                transition-colors duration-200
                text-sm border border-gray-200
              `}
              title={`현재: ${getLiberalButtonText()}, 클릭하여 변경`}
            >
              {getLiberalButtonText()}
            </button>
            <button
              onClick={handleEmploymentToggle}
              className={`
                ${getButtonColor()}
                px-3 py-1.5 rounded-md font-medium
                transition-colors duration-200
                text-sm border border-gray-200
              `}
              title={`현재: ${getEmploymentButtonText()}, 클릭하여 변경`}
            >
              {getEmploymentButtonText()}
            </button>
            {/* 향후 추가될 토글 버튼들이 여기에 들어갈 예정 */}
          </div>
        </div>
      </div>
    </div>
  )
} 