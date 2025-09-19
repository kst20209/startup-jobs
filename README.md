# 스타트업 채용공고 사이트

이 프로젝트는 스타트업들의 채용공고를 모아서 보여주는 Next.js 웹사이트입니다.

## 주요 기능

- 매일 오전 9시 자동 데이터 업데이트
- 기업별 채용공고 필터링
- 검색 기능
- 반응형 디자인

## 데이터 업데이트 설정

사이트는 매일 오전 9시에 자동으로 데이터를 업데이트합니다. 이는 GitHub Actions의 cron job을 통해 구현됩니다.

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수들을 설정하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# 재검증 API 보안 토큰
REVALIDATE_TOKEN=your_secure_random_token_here
```

### GitHub Secrets 설정

GitHub 저장소의 Settings > Secrets and variables > Actions에서 다음 secrets를 설정하세요:

- `SITE_URL`: 배포된 사이트의 URL (예: https://your-site.vercel.app)
- `REVALIDATE_TOKEN`: 위에서 설정한 REVALIDATE_TOKEN과 동일한 값

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
