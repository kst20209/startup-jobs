'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { companyStore } from './JobPostList'

// 버튼 이름 → 실제 DB company_name 매핑
const COMPANY_NAME_MAPPING: { [key: string]: string } = {
  '네이버': '네이버 (Naver)',
  '카카오': '카카오 (Kakao)',
  '쿠팡': '쿠팡 (Coupang)', 
  '라인': '라인 (LINE)',
  '배민': '우아한형제들 (Woowahan)',
  '당근': '당근 (Carrot)',
  '토스': '토스 (Toss)'
}

interface CompanyButtonProps {
  company: {
    name: string
    color: string
    logo: string
    logoStyle: 'no-bg' | 'with-bg' | 'with-bg-circle'
    logoSize: { width: number; height: number }
    objectFit: 'contain' | 'cover'
    scale: number
  }
}

export default function CompanyButton({ company }: CompanyButtonProps) {
  const [selectedCompany, setSelectedCompany] = useState('전체')
  
  // 글로벌 상태 구독
  useEffect(() => {
    setSelectedCompany(companyStore.getSelectedCompany())
    const unsubscribe = companyStore.subscribe(() => {
      setSelectedCompany(companyStore.getSelectedCompany())
    })
    return unsubscribe
  }, [])
  
  // 실제 DB의 company_name 가져오기
  const actualCompanyName = COMPANY_NAME_MAPPING[company.name] || company.name
  const isSelected = selectedCompany === actualCompanyName

  const handleClick = () => {
    console.log(`🔄 기업 선택: ${company.name} → ${actualCompanyName}`)
    companyStore.setSelectedCompany(actualCompanyName)
  }

  return (
    <button
      onClick={handleClick}
      className={`
        relative w-20 h-20 rounded-2xl transition-all duration-300 group
        ${isSelected 
          ? 'ring-4 ring-offset-2 shadow-xl transform scale-105' 
          : 'hover:shadow-lg hover:transform hover:scale-105'
        }
      `}
      style={{
        backgroundColor: company.color,
        boxShadow: isSelected 
          ? `0 8px 25px -5px ${company.color}40, 0 8px 10px -6px ${company.color}40`
          : undefined
      }}
      title={`${company.name} 채용공고 보기`}
    >
      <div className="w-full h-full flex items-center justify-center p-2">
        {company.logoStyle === 'no-bg' ? (
          <div 
            className="transition-transform duration-300 group-hover:scale-110"
            style={{ transform: `scale(${company.scale})` }}
          >
            <Image
              src={company.logo}
              alt={`${company.name} 로고`}
              width={company.logoSize.width}
              height={company.logoSize.height}
              style={{ objectFit: company.objectFit }}
            />
          </div>
        ) : company.logoStyle === 'with-bg' ? (
          <div className="bg-white rounded-lg p-2 w-full h-full flex items-center justify-center">
            <div 
              className="transition-transform duration-300 group-hover:scale-110"
              style={{ transform: `scale(${company.scale})` }}
            >
              <Image
                src={company.logo}
                alt={`${company.name} 로고`}
                width={company.logoSize.width}
                height={company.logoSize.height}
                style={{ objectFit: company.objectFit }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden">
            <div 
              className="transition-transform duration-300 group-hover:scale-110"
              style={{ transform: `scale(${company.scale})` }}
            >
              <Image
                src={company.logo}
                alt={`${company.name} 로고`}
                width={company.logoSize.width}
                height={company.logoSize.height}
                style={{ objectFit: company.objectFit }}
              />
            </div>
          </div>
        )}
      </div>
      
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: company.color }} />
        </div>
      )}
    </button>
  )
}

export function AllCompaniesButton() {
  const [selectedCompany, setSelectedCompany] = useState('전체')
  
  // 글로벌 상태 구독
  useEffect(() => {
    setSelectedCompany(companyStore.getSelectedCompany())
    const unsubscribe = companyStore.subscribe(() => {
      setSelectedCompany(companyStore.getSelectedCompany())
    })
    return unsubscribe
  }, [])
  
  const isSelected = selectedCompany === '전체'

  const handleClick = () => {
    console.log('🔄 전체 선택')
    companyStore.setSelectedCompany('전체')
  }

  return (
    <button
      onClick={handleClick}
      className={`
        relative w-20 h-20 rounded-2xl transition-all duration-300 group
        ${isSelected 
          ? 'ring-4 ring-offset-2 shadow-xl transform scale-105 bg-[#5D5DF6]' 
          : 'bg-gray-100 hover:bg-[#5D5DF6] hover:shadow-lg hover:transform hover:scale-105'
        }
      `}
      style={{
        boxShadow: isSelected 
          ? '0 8px 25px -5px rgba(93, 93, 246, 0.4), 0 8px 10px -6px rgba(93, 93, 246, 0.4)'
          : undefined
      }}
      title="전체 채용공고 보기"
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className={`text-2xl mb-1 transition-colors duration-300 ${
          isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'
        }`}>
          🏢
        </div>
        <span className={`text-xs font-semibold transition-colors duration-300 ${
          isSelected ? 'text-white' : 'text-gray-600 group-hover:text-white'
        }`}>
          전체
        </span>
      </div>
      
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
          <div className="w-3 h-3 bg-[#5D5DF6] rounded-full" />
        </div>
      )}
    </button>
  )
} 