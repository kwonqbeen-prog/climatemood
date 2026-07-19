# 백엔드/로그인 설정 가이드 (Supabase)

이 문서는 로그인(이메일/비밀번호 + 카카오)과 서버 경유 Solar API 호출 구조를
Supabase로 설정하는 절차입니다. 한 번만 해두면 됩니다.

---

## 1. Supabase 프로젝트 생성

1. https://supabase.com 에서 회원가입 후 새 프로젝트 생성
2. 프로젝트 생성 후 **Project Settings > API** 메뉴에서 아래 두 값을 확인
   - `Project URL` → `.env`의 `VITE_SUPABASE_URL`
   - `anon public` 키 → `.env`의 `VITE_SUPABASE_ANON_KEY`
3. 프로젝트 루트에 `.env` 파일을 만들고 (`.env.example` 참고) 위 값을 입력

## 2. 데이터베이스 테이블 생성

1. Supabase 대시보드 좌측 메뉴 **SQL Editor** 클릭
2. `supabase/schema.sql` 파일 내용을 그대로 붙여넣고 실행(Run)
   - `missions`, `sessions` 테이블과 RLS(행 단위 보안) 정책이 생성됩니다.
   - RLS 덕분에 각 사용자는 본인 데이터만 조회/수정할 수 있습니다.

## 3. 이메일/비밀번호 로그인 활성화

기본값으로 이미 켜져 있어요. **Authentication > Providers > Email**에서
"Confirm email" 옵션을 켜둘지 끌지만 확인하면 됩니다.
(끄면 가입 즉시 로그인 가능, 켜면 이메일 인증 후 로그인 — 데모 시연이 급하면 꺼두는 걸 추천)

## 4. 카카오 로그인 설정

### 4-1. 카카오 개발자 앱 생성
1. https://developers.kakao.com 에서 애플리케이션 추가
2. **제품 설정 > 카카오 로그인**에서 활성화
3. **동의항목**에서 최소 "닉네임", "이메일"(선택 동의 가능) 활성화
4. 앱 키 중 **REST API 키**를 복사해둠

### 4-2. Redirect URI 등록 (카카오 콘솔)
Supabase가 발급하는 콜백 주소를 카카오 콘솔의 "Redirect URI"에 등록해야 합니다.
Supabase 대시보드 **Authentication > Providers > Kakao**를 열면 아래 형태의
Callback URL이 보여요. 이 값을 그대로 카카오 콘솔의 Redirect URI에 추가하세요.

```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

### 4-3. Supabase에 카카오 키 입력
**Authentication > Providers > Kakao**에서:
- Client ID: 카카오 REST API 키
- Client Secret: 카카오 콘솔에서 발급한 Client Secret (보안 > Client Secret 코드 발급)
- 활성화(Enable) 토글 켜기 → Save

## 5. Solar API 프록시(Edge Function) 배포

브라우저에 Upstage API 키가 노출되지 않도록, Solar API 호출은 이제
Supabase Edge Function(`supabase/functions/solar-proxy`)이 대신 처리합니다.

```bash
# Supabase CLI 설치 (최초 1회)
npm install -g supabase

# 로그인 및 프로젝트 연결
supabase login
supabase link --project-ref <your-project-ref>

# Upstage API 키를 시크릿으로 등록 (기존에 쓰던 up_로 시작하는 키)
supabase secrets set UPSTAGE_API_KEY=up_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 함수 배포
supabase functions deploy solar-proxy
```

배포 후 대시보드 **Edge Functions > solar-proxy**에서 "Enforce JWT Verification"이
켜져 있는지 확인하세요 (기본값 on — 로그인한 사용자만 호출 가능하게 함).

## 6. 로컬 실행 / 배포 시 환경 변수

- 로컬 개발: `.env` 파일에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 설정 후 `npm run dev`
- 배포(Vercel/Netlify 등): 배포 환경의 환경 변수 설정 화면에 동일한 두 값을 등록
- 배포 후 실제 도메인이 생기면, 카카오 개발자 콘솔의 **플랫폼 > Web** 사이트 도메인에도
  해당 배포 도메인을 추가로 등록해야 카카오 로그인이 정상 동작합니다.

## 7. 더 이상 필요 없는 것

- 프론트엔드용 `VITE_UPSTAGE_API_KEY` — 삭제해도 됩니다 (API 키는 이제 Supabase 시크릿에만 존재)
- localStorage 기반 데이터 — 로그인 후에는 Supabase DB에 저장되며, 기존 localStorage
  데이터는 자동으로 이전되지 않습니다 (필요하면 별도 마이그레이션 스크립트 작성 가능)
