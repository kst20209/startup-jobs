'use client'

import { useState } from 'react'
import Image from 'next/image'
import FeedbackModal from './FeedbackModal'

export default function Header() {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)

  return (
    <>
      <header className="w-full backdrop-blur-md bg-white/80 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <Image src="/globe.svg" alt="logo" width={32} height={32} />
            <span className="font-extrabold text-xl tracking-tight text-gray-800">LETS CAREER</span>
            <nav className="ml-8 flex gap-6 text-gray-700 text-base font-medium">
              
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {/* 도움 아이콘 버튼 */}
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center text-gray-600 hover:text-gray-800 group"
              title="도움말 및 피드백"
            >
              <svg 
                className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </button>

            <button 
              className="font-medium transition-colors duration-200 text-[#5D5DF6] hover:text-[#4c4cf5]"
            >
              로그인
            </button>
            <button 
              className="text-white px-4 py-1.5 rounded-lg font-semibold shadow hover:shadow-lg transition-all duration-200 bg-[#5D5DF6] hover:bg-[#4c4cf5]"
              style={{ 
                boxShadow: '0 4px 14px 0 rgba(93, 93, 246, 0.4)'
              }}
            >
              회원가입
            </button>
          </div>
        </div>
      </header>

      {/* 피드백 모달 */}
      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
      />
    </>
  )
} 