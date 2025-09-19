import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // API 키 검증 (보안을 위해)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.REVALIDATE_TOKEN
    
    if (!expectedToken) {
      return NextResponse.json(
        { error: 'Revalidate token not configured' },
        { status: 500 }
      )
    }
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Invalid authorization token' },
        { status: 401 }
      )
    }

    // 홈페이지 재검증
    revalidatePath('/')
    
    console.log('✅ 홈페이지가 성공적으로 재검증되었습니다.')
    
    return NextResponse.json({
      revalidated: true,
      message: '홈페이지가 성공적으로 재검증되었습니다.',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ 재검증 중 오류 발생:', error)
    return NextResponse.json(
      { error: '재검증 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
