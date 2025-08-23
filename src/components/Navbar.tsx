'use client'

import { useState } from 'react'
import Image from 'next/image'
import FeedbackModal from './FeedbackModal'

export default function Navbar() {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)

  return (
    <>
      <header className="w-full backdrop-blur-md bg-white/80 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2 px-1 sm:px-2">
            <Image
              src="/logos/logo.png"
              alt="logo"
              width={486}
              height={77}
              className="h-auto max-w-[110px] sm:max-w-[180px] w-full responsive-logo"
              style={{
                width: '100%',
                aspectRatio: '486/77',
              }}
            />
            <nav className="ml-4 sm:ml-8 flex gap-3 sm:gap-6 text-gray-700 text-base font-medium sm:text-sm">
              
            </nav>
          </div>
          {/* 우측: 피드백 요청 버튼 */}
          <div className="flex items-center">
            <button
              className="bg-[#5D5DF6]/10 hover:bg-[#5D5DF6]/20 text-[#5D5DF6] font-semibold px-2 py-1.5 sm:px-5 sm:py-2 rounded-full border border-[#5D5DF6]/30 transition-colors text-xs sm:text-sm min-w-[60px] sm:min-w-[110px]"
              onClick={() => setIsFeedbackModalOpen(true)}
            >
              <span className="inline">제발 도와주세요 🙏</span>
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
            max-width: 100px !important;
          }
        }
        @media (max-width: 480px) {
          .responsive-logo {
            max-width: 90px !important;
          }
        }
        @media (max-width: 380px) {
          .responsive-logo {
            max-width: 80px !important;
          }
          .xs\\:px-1\\.5 {
            padding-left: 0.375rem !important;
            padding-right: 0.375rem !important;
          }
          .xs\\:py-1 {
            padding-top: 0.25rem !important;
            padding-bottom: 0.25rem !important;
          }
          .xs\\:text-\\[10px\\] {
            font-size: 10px !important;
          }
          .xs\\:min-w-\\[60px\\] {
            min-width: 60px !important;
          }
        }
      `}</style>
    </>
  )
} 