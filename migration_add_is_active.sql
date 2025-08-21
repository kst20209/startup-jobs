-- JobPost 테이블에 is_active 컬럼 추가
ALTER TABLE "JobPost" ADD COLUMN "is_active" BOOLEAN DEFAULT true NOT NULL;

-- 기존 데이터는 모두 활성 상태로 설정
UPDATE "JobPost" SET "is_active" = true WHERE "is_active" IS NULL;

-- 인덱스 추가 (성능 최적화)
CREATE INDEX "idx_jobpost_is_active" ON "JobPost" ("is_active");

-- RLS 정책 추가 (선택사항 - 보안 강화)
-- ALTER TABLE "JobPost" ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for active job posts" ON "JobPost" FOR SELECT USING (is_active = true);
