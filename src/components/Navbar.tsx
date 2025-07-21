'use client'

import { useState } from 'react'
import Image from 'next/image'
import FeedbackModal from './FeedbackModal'

export default function Navbar() {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)

  return (
    <>
      <header className="w-full backdrop-blur-md bg-white/80 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2 px-2">
            <Image
              src="/logos/logo.png"
              alt="logo"
              width={486}
              height={77}
              className="h-auto responsive-logo"
              style={{
                maxWidth: '180px',
                width: '100%',
                aspectRatio: '486/77',
              }}
            />
            <nav className="ml-8 flex gap-6 text-gray-700 text-base font-medium sm:text-sm sm:ml-3 sm:gap-3">
              
            </nav>
          </div>
          {/* 우측: 피드백 요청 버튼 */}
          <div className="flex items-center">
            <button
              className="bg-[#5D5DF6]/10 hover:bg-[#5D5DF6]/20 text-[#5D5DF6] font-semibold px-6 py-2.5 rounded-full border border-[#5D5DF6]/30 transition-colors text-sm md:text-base min-w-[120px] sm:text-xs sm:px-3 sm:py-1.5 sm:min-w-[80px]"
              onClick={() => setIsFeedbackModalOpen(true)}
            >
              제발 도와주세요 🙏
            </button>
          </div>
        </div>
      </header>

      {/* 피드백 모달 */}
      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
      />
      <style jsx>{`
        @media (max-width: 640px) {
          .responsive-logo {
            max-width: 120px !important;
          }
        }
      `}</style>
    </>
  )
} 