# dear-mind — 프로젝트 컨텍스트 (Claude Code 핸드오프)

이 문서는 기획/디자인 단계에서 결정된 모든 내용을 정리한 것입니다.
Claude Code는 이 문서를 읽고 아래 "다음 할 일"부터 이어서 작업해주세요.

## 프로젝트 개요
- 이름: dear-mind
- 컨셉: "정답을 찾기보다, 지금의 나를 알아가는 시간" — 매일 써야 하는 과제가 아니라, 원할 때 질문에 답하며 자기성찰을 기록하는 AI 개인 프로젝트 (포트폴리오용). 하루 작성 횟수 제한 없음
- 개발자: 2년차 프론트엔드 개발자, 1인 개발, 풀타임(주 30~40시간) 기준 약 2.5~3주 목표
- AI 상담이 아닌 "AI와 함께하는 자기성찰 기록 서비스"로 포지셔닝

## 기술 스택
- Frontend: React + TypeScript, Next.js (App Router)
- Backend: Next.js API Route
- DB/Auth: Supabase (PostgreSQL + Auth, Google OAuth 단일 로그인)
- AI: LLM API + Structured Output (JSON Schema)
- Deployment: Vercel + Supabase

## 디자인 컨셉 (확정)
- 무드: 파스텔 레트로 데스크탑(Windows 감성) — 하늘색→라벤더 그라데이션 배경, 창(윈도우) UI, 구름/반짝임 장식
- 모든 화면은 공통 "창 프레임"(타이틀바 + 창 조작 버튼 3개 + .EXE 스타일 제목)을 씌움
- 폰트: 제목은 Jua(둥글고 귀여운 한글 폰트, Google Fonts), 본문은 시스템 산세리프
- 홈 화면 메뉴 3개는 "폴더 아이콘" 모양 (탭+본체 2겹 구조, 두꺼운 다크 네이비 아웃라인)
- 레벨(1~4) 그라데이션: 하늘색(Lv1) → 라벤더(Lv2) → 핑크(Lv3) → 진보라(Lv4) — "가볍게→깊게"를 색으로 표현
- AI 분석 결과 화면에만 은은하게 빛나는 동반자 캐릭터(블롭 모양) 등장

### 디자인 토큰
```
sky-light:  #DCE9FB
sky-dark:   #ECE3FB
ink:        #4A5480   (기본 텍스트)
ink-dark:   #2E2A45   (아웃라인, 진한 텍스트)
muted:      #6A6FAC   (보조 텍스트, 창 배경 대비 4.5:1)

folder.purple: back #8466BA / front #C9B8EA / text #4A3B7A / sub #57457C   (작성하기)
folder.pink:   back #D98FB0 / front #F7C6DA / text #8A3F5E / sub #8B4465   (기록 보기)
folder.mint:   back #5FAE85 / front #B9E8D0 / text #2E6B4A / sub #326B50   (내 정보 변경)

level:  Lv1 #DCEFFB / Lv2 #E3E3FB / Lv3 #F0D9F5 / Lv4 #B39DE5   (app/lib/levels.ts, --color-level-N)
```

### 완성된 목업 (참고용)
디자인 캔버스에 9개 화면 고해상도 목업이 완성되어 있음 (색상, 레이아웃, 텍스트 확정):
1. Main (로그인, Google OAuth 단일 버튼)
2. Onboarding1 (나이대 선택)
3. Onboarding2 (기본 레벨 1~4 선택)
4. Home (폴더형 메뉴 3개: 작성하기/기록 보기/내 정보 변경)
5. Questions (오늘의 질문 3개, 기본 레벨 기준 — 레벨 탭 선택 UI는 없음)
6. Editor (글쓰기 에디터)
7. Analysis (AI 분석 결과 + 동반자 캐릭터)
8. Records (기록 리스트, 질문+답변 미리보기 함께 표시)
9. RecordDetail (기록 상세, 그날의 글+AI 분석 다시보기)

### UX 라이팅 규칙
- 문체: 해요체로 통일 ("-습니다" 쓰지 않음)
- 띄어쓰기: 보조용언은 띄어 씀 (시도해 주세요, 적어 보세요, 써 볼까요). 한 단어인 동사는 붙여 씀 (들여다봐요)
- 문장 부호: 한 문장짜리 UI 문구는 끝에 마침표 없음. 두 문장 이상이면 문장 사이에만 마침표
- 에러 문구: "[무엇]을 [하지] 못했어요. 잠시 후 다시 시도해 주세요"
- 버튼: 누른 뒤 일어날 일을 드러냄 (예: 저장하고 분석 보기)
- 창 제목: `이름.EXE` 영문 대문자. 기록 상세는 파일이라 `날짜.TXT`, 온보딩은 설치 프로그램 느낌으로 `SETUP.EXE (n/2)`
- 메뉴명과 화면 제목을 같게 씀 (작성하기 / 기록 보기 / 내 정보 변경)
- "오늘도"처럼 매일 쓰기를 강요하는 표현은 쓰지 않음. "오늘의 질문"은 그날 받은 질문 세트를 가리킬 때만 씀

## 확정된 화면 플로우
```
로그인(Google) → 온보딩(나이대→레벨) → 홈 메뉴
  → [작성하기] 오늘의 질문 3개 → 글쓰기 → AI 분석 → 저장 → 홈
  → [기록 보기] 리스트/캘린더 → 기록 상세
  → [내 정보 변경] 나이대/레벨 재설정
```

## 핵심 기능 로직
- **질문 레벨**: 사용자가 설정한 기본 레벨(N) 기준으로 3개 중 2개는 N, 1개는 N-1/N/N+1 중 랜덤. 질문 화면에 레벨 탭 선택 UI는 없음.
- **오늘의 질문 세트**: 하루에 받은 세트를 저장해 재사용. "다른 질문 받기"는 하루 3회, 오늘 받은 이전 세트는 넘겨 보며 답할 수 있음. 날짜는 KST 기준.
- **레벨 변경 제안**: 기본 레벨 설정(또는 제안 수락/거절) 이후 쓴 최근 글 5개 중 4개 이상이 기본 레벨보다 높거나 낮은 질문이면, 질문 화면 상단에 한 단계 올리기/내리기를 제안. 자동 변경은 하지 않음 (`profiles.level_counted_since` 이후 글만 집계).
- **질문 생성**: LLM에 (나이대, 레벨 N-1/N/N+1)을 넘겨 Structured Output으로 질문 3개를 한 번에 받음.
- **AI 분석 응답 스키마**:
  ```json
  { "summary": "...", "tone_keywords": ["...", "...", "..."], "message": "..." }
  ```
- **안전 설계**: 자해/위기 암시 표현 감지 시 AI 분석 대신 고정 안내 문구(전문기관 연락처)로 대체하는 룰 기반 필터. AI는 진단·상담을 하지 않음.
- **실패 처리**: LLM 응답 실패/스키마 불일치 시 1회 재시도 후 안내 문구로 폴백. 질문 재생성(새로고침)에는 일일 한도.

## 데이터 모델
- User: id, age_group, base_level, nickname
- Question: id, content, level, type
- Journal: id, user_id, question_id, level, content, created_at
- AIAnalysis: journal_id, summary, tone_keywords, message

## MVP 범위 (이번 스프린트에 포함)
포함: 로그인, 온보딩, 홈 메뉴, 오늘의 질문 3개, 글쓰기/저장, AI 분석/피드백, 기록 조회
제외(향후 확장): 월간 AI 회고, Embedding/Vector DB/RAG, 감정 점수화, 전문 상담 기능

## 이미 작성된 코드 (첨부 파일 참고)
- `tailwind.config.snippet.ts` — 색상/폰트 토큰
- `app/layout.tsx` — Jua 폰트 등록
- `components/WindowFrame.tsx` — 공통 창 프레임
- `components/FolderMenuItem.tsx` — 홈 화면 폴더 메뉴 컴포넌트

## 다음 할 일 (Claude Code가 이어서 할 작업)
1. 위 코드 스니펫들을 실제 Next.js 프로젝트(`dear-mind`)에 통합
2. Main(로그인) → Home → Onboarding 순으로 페이지 코딩 (더미 데이터로 먼저 완성, Supabase 연동은 이후)
3. Questions, Editor, Analysis, Records, RecordDetail 페이지 순서로 이어서 작업
4. 아이콘은 `lucide-react`의 Pencil/BookOpen/Settings로 대체 가능
5. 전체 완성 후 Supabase Auth(Google OAuth) + 기록 CRUD 연동
6. 이후 LLM API 연동 (질문 생성, 글 분석) — Structured Output 스키마는 위 참고
7. Vercel 배포

각 단계에서 이 문서의 디자인 토큰과 컴포넌트 구조를 최대한 재사용해서, 화면마다 스타일을 새로 짜지 않도록 해주세요.
