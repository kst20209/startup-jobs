-- SearchHistory 테이블 생성 마이그레이션
-- 검색어와 검색 빈도를 저장하는 테이블

CREATE TABLE IF NOT EXISTS SearchHistory (
  id SERIAL PRIMARY KEY,
  search_term VARCHAR(255) NOT NULL UNIQUE,
  search_count INTEGER DEFAULT 1,
  last_searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 검색어로 빠른 조회를 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_search_history_search_term ON SearchHistory(search_term);

-- 검색 빈도로 정렬하기 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_search_history_search_count ON SearchHistory(search_count DESC);

-- 마지막 검색 시간으로 정렬하기 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_search_history_last_searched_at ON SearchHistory(last_searched_at DESC);

-- updated_at 자동 업데이트를 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_search_history_updated_at 
    BEFORE UPDATE ON SearchHistory 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책 설정 (모든 사용자가 읽기/쓰기 가능)
ALTER TABLE SearchHistory ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 검색 기록을 읽을 수 있도록 허용
CREATE POLICY "Allow public read access to search history" ON SearchHistory
    FOR SELECT USING (true);

-- 모든 사용자가 검색 기록을 삽입할 수 있도록 허용
CREATE POLICY "Allow public insert access to search history" ON SearchHistory
    FOR INSERT WITH CHECK (true);

-- 모든 사용자가 검색 기록을 업데이트할 수 있도록 허용
CREATE POLICY "Allow public update access to search history" ON SearchHistory
    FOR UPDATE USING (true);
