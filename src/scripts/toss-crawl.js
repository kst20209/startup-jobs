// scripts/toss-crawl.js
const puppeteer = require('puppeteer')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function crawlTossJobs() {
  const browser = await puppeteer.launch({ headless: false }) // 디버깅용으로 브라우저 보이게
  const page = await browser.newPage()
  
  try {
    console.log('🚀 토스 채용 페이지 크롤링 시작...')
    
    // 1. 메인 채용 페이지 접속
    await page.goto('https://toss.im/career/jobs', { waitUntil: 'networkidle2' })
    
    // 2. 채용 공고 링크들 추출
    const jobLinks = await page.$$eval('a[href*="/career/job-detail"]', links => {
      return links.map(link => ({
        href: link.href,
        title: link.querySelector('[data-desktop-list-item-title]')?.textContent?.trim() || ''
      }))
    })
    
    console.log(`📋 총 ${jobLinks.length}개의 채용공고를 찾았습니다.`)
    
    const jobs = []
    
    // 3. 각 채용공고 상세 페이지 방문
    for (let i = 0; i < Math.min(jobLinks.length, 5); i++) { // 처음 5개만 테스트
      const { href, title } = jobLinks[i]
      console.log(`📄 ${i + 1}/${jobLinks.length}: ${title}`)
      
      await page.goto(href, { waitUntil: 'networkidle2' })
      
      // 4. 상세 정보 추출
      const jobDetails = await page.evaluate(() => {
        // company_name_detail과 employment_type 추출
        const detailContainer = document.querySelector('.css-1kbe2mo')
        let companyNameDetail = ''
        let employmentType = ''
        
        if (detailContainer) {
          const h5Elements = detailContainer.querySelectorAll('h5')
          h5Elements.forEach(h5 => {
            const text = h5.textContent.trim()
            if (text.includes('소속')) {
              companyNameDetail = text.replace('소속', '').trim()
            } else if (text.includes('직') || text.includes('계약') || text.includes('정규')) {
              employmentType = text.trim()
            }
          })
        }
        
        return { companyNameDetail, employmentType }
      })
      
      // 5. 데이터 정리
      jobs.push({
        company_name: '비바리퍼블리카 / 토스 (Viva Republica / Toss)',
        job_title: title,
        job_url: href,
        position: '', // 빈 칸
        employment_type: jobDetails.employmentType || '정규직',
        company_name_detail: jobDetails.companyNameDetail || '토스'
      })
      
      // 요청 간격 (서버 부하 방지)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    console.log(`✅ 크롤링 완료! ${jobs.length}개 채용공고 수집`)
    
    // 6. Supabase에 저장
    if (jobs.length > 0) {
      const { data, error } = await supabase
        .from('JobPost')
        .insert(jobs)
        .select()
      
      if (error) {
        console.error('❌ DB 저장 실패:', error.message)
      } else {
        console.log(`🎉 ${data.length}개 채용공고가 DB에 저장되었습니다!`)
      }
    }
    
  } catch (error) {
    console.error('💥 크롤링 에러:', error.message)
  } finally {
    await browser.close()
  }
}

// 실행
crawlTossJobs()