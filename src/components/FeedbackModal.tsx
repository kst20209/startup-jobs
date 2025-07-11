'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedbackText, setFeedbackText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const maxLength = 1000
  const charCount = feedbackText.length

  const handleSubmit = async () => {
    if (!feedbackText.trim() || isSubmitting) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // 사용자 정보 수집 (선택적)
      const userAgent = navigator.userAgent
      
      const { error } = await supabase
        .from('user_feedback')
        .insert([
          {
            feedback_content: feedbackText.trim(),
            user_agent: userAgent,
            // user_ip는 서버사이드에서 처리하거나 생략 가능
          }
        ])

      if (error) {
        throw error
      }

      setSubmitStatus('success')
      setFeedbackText('')
      
      // 성공 메시지 표시 후 모달 닫기
      setTimeout(() => {
        onClose()
        setSubmitStatus('idle')
      }, 1500)

    } catch (error) {
      console.error('피드백 전송 오류:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFeedbackText('')
      setSubmitStatus('idle')
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isSubmitting) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            무엇이 불편하신가요?
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            개선이 필요한 부분이 있다면 자유롭게 말씀해주세요. 의견을 반영하여 더 나은 서비스로 보답하겠습니다.
          </p>

          {/* 텍스트 영역 */}
          <div className="relative">
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="여기에 의견을 자유롭게 작성해주세요..."
              maxLength={maxLength}
              disabled={isSubmitting}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            
            {/* 글자 수 카운터 */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {charCount}/{maxLength}
            </div>
          </div>

          {/* 상태 메시지 */}
          {submitStatus === 'success' && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-green-700">피드백이 성공적으로 전송되었습니다!</span>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-red-700">전송 중 오류가 발생했습니다. 다시 시도해주세요.</span>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="px-6 pb-6">
          <button
            onClick={handleSubmit}
            disabled={!feedbackText.trim() || isSubmitting || charCount > maxLength}
            className="w-full bg-[#5D5DF6] text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-[#4c4cf5] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                전송 중...
              </>
            ) : (
              '보내기'
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 