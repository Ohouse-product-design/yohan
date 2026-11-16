---
name: book-support
description: 오늘의집(버킷플레이스) 사내 도서 지원 신청을 끝까지 대신 실행한다 — 노션 「📚 도서 지원」 가이드 확인 → 버킷 도서 리스트 중복 확인 → 알라딘 공용 계정 로그인 → 장바구니 담기·검증(Claude in Chrome) → 슬랙 #support_office-it-구매 에 신청 글 작성 → 스레드에 책제목·장바구니 담기 완료 여부·링크 기록. 사용자가 "도서 지원", "도서 신청", "책 신청해줘", "책 사줘", "도서 구매 신청", "알라딘 장바구니 담아줘", "이 책 회사에서 사고 싶어" 같은 말을 하거나 책 제목/알라딘 링크를 주며 회사 지원을 원할 때 반드시 이 스킬을 쓴다.
---

# 도서 지원 신청 (Book Support)

직무 관련 도서를 회사 지원으로 신청하는 전 과정을 실행한다. 사람이 하던 순서를 그대로 따르고,
각 단계의 결과(성공/실패/스킵)를 끝까지 기록해 마지막에 한 번에 보고한다.

## 고정 정보

| 항목 | 값 |
| --- | --- |
| 가이드(정책·계정의 원본) | 노션 「📚 도서 지원」 `82fe90b132284e19b84a2e3df84b945c` |
| 버킷 도서 리스트 | Google Sheet `15MWvmgLP3BUAYzr1K_6_-q4M7QODDM2DqC5tyuhd6cY` (시트 `02. 도서목록`) |
| 슬랙 채널 | `#support_office-it-구매` — `C03FXS3PQA2` |
| 알라딘 | `https://www.aladin.co.kr` (로그인 팝업 `/login/wlogin_popup.aspx`, 장바구니 `/shop/wbasket.aspx`) |

**계정 정보는 이 파일·레포·슬랙에 절대 적지 않는다.** 매번 노션 가이드에서 읽어 온다
(「2. 어떻게 신청하나요?」 콜아웃의 `알라딘 계정 (아이디/비밀번호)`). 연도마다 비밀번호가 바뀌므로 캐시하지 않는다.

## 입력

- 책 1권 이상: 도서명, 또는 알라딘 상품 URL(`.../wproduct.aspx?ItemId=...`). URL 이 가장 정확하다.
- 도서명만 받았다면 알라딘 검색 1순위 결과를 쓰되, **2단계에서 찾은 제목·저자를 사용자에게 보여 주고 맞는지 확인**한다.
- 스터디 목적 구매라면 이 스킬 대신 담당자 요청 + 스터디 계획서가 필요하다고 안내한다(가이드 Q&A).

## 실행 순서

### 1. 가이드 확인 (매번)
`notion-fetch` 로 가이드 페이지를 읽는다.
- 알라딘 계정 ID/PW 를 추출한다(대화에 출력하지 않는다).
- 채널·절차가 아래 내용과 달라졌으면 **노션을 우선**하고 사용자에게 변경점을 알린다.

### 2. 중복 확인 — 버킷 도서 리스트
가이드 원칙: 회사에 이미 있는 책은 사지 않는다.
- Google Drive `read_file_content` 로 시트를 읽어 `02. 도서목록`/`도서구매관리` 에서 제목을 찾아본다.
  이 도구는 **일부 행만** 돌려주므로 "못 찾음 = 없음" 이 아니다.
- 찾았다 → 멈추고 위치(`책장` = 27층 책장 / 사람 닉네임 = 개인 보유)를 알려 준다.
  책장이면 직접 가져와 시트 위치를 본인으로 수정, 개인 보유면 DM 으로 문의하라고 안내한다. 신청하지 않는다.
- 확인 불가 → 시트 링크를 주고 "사내 보유 여부를 직접 한 번 확인해 주세요" 라고 말한 뒤, 사용자가 진행하라고 하면 계속한다.

### 3. 알라딘 로그인 → 장바구니 담기 → 검증 (Claude in Chrome)
알라딘 단계는 **Claude in Chrome MCP(`mcp__claude-in-chrome__*`)로 사용자의 실제 크롬에서** 한다.
클라우드 헤드리스 브라우저는 알라딘이 로그인을 거부하므로(에러코드 42FB6013…) 쓰지 않는다.
시작 전에 `chrome-browser` 스킬을 로드하고, 도구는 한 번의 ToolSearch 로 불러온다:
`select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__tabs_close_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__find,mcp__claude-in-chrome__form_input,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__javascript_tool`
확장이 연결되어 있지 않으면 재시도하지 말고 "크롬을 켜고 Claude in Chrome 확장을 연결해 주세요" 라고 말한 뒤 멈춘다.

공용 계정의 장바구니는 **회사 전체가 같이 쓴다.** 남이 담은 책을 지우거나 수량을 바꾸지 않는다.
이미 담긴 책은 다시 담지 않는다(수량 2가 됨).

1. **새 탭 준비** — `tabs_context_mcp` → `tabs_create_mcp` 로 새 탭을 열어 그 탭에서만 작업한다(사용자 탭은 건드리지 않음).
2. **계정 확인** — `https://www.aladin.co.kr/shop/wbasket.aspx` 로 이동해 `read_page` 로 상단을 본다.
   - 이미 로그인되어 있다면 **회사 공용 계정인지 확인**한다(`/account/wmaininfo.aspx` 마이페이지의 아이디가 노션 계정과 같은지).
     사용자의 **개인 알라딘 계정**이면 개인 장바구니에 담기면 안 되므로, 로그아웃해도 되는지 사용자에게 먼저 묻는다.
   - 로그인 안 되어 있으면 3번으로.
3. **로그인** — `https://www.aladin.co.kr/login/wlogin_popup.aspx` 로 이동 →
   `form_input` 으로 `#Email`, `#Password` 에 노션 계정 입력 → 「로그인」 링크(`a[href="javascript:fn_submit();"]`)를 클릭.
   Enter 로 제출하면 실패한다. `wlogin_popup_result.aspx` 로 넘어가면 성공.
   - 비밀번호가 틀리면 알라딘이 `alert` 를 띄워 확장이 멈출 수 있다. 입력 전에 노션 값을 정확히 옮겼는지 확인하고,
     멈추면 사용자에게 크롬에서 알림창을 닫아 달라고 한다.
4. **도서 확정** — URL 이 있으면 그대로, 도서명만 있으면
   `https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=Book&SearchWord=<도서명>` 의 첫 결과(`.ss_book_box[itemid]`)를 쓴다.
   상품 페이지 `https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=<id>` 에서 제목·저자·판매가를 읽어 사용자에게 맞는지 확인한다.
5. **중복 확인** — 장바구니 페이지에서 `javascript_tool` 로 담긴 상품 ItemId 를 모은다:
   ```js
   [...document.querySelectorAll('a[href*="ItemId="]')]
     .filter(a => /^\[[^\]]+\]/.test(a.innerText.trim()))   // "[국내도서] 제목" 형태 = 장바구니 행
     .map(a => a.href.match(/ItemId=(\d+)/)[1] + ' ' + a.innerText.trim())
   ```
   이미 있으면 담지 않고 상태를 `already_in_cart`(= 장바구니 담기 완료)로 둔다.
6. **담기** — 상품 페이지에서 `javascript_tool` 로 상세 페이지 「장바구니 담기」 버튼과 같은 요청을 보낸다.
   버튼 클릭은 확인창(confirm)이 뜰 수 있어 확장이 멈추므로 피한다.
   ```js
   const isbn = document.querySelector('.hd_ISBN').value;
   const r = await fetch(`/shop/BasketAjax.aspx?method=BasketAdd&isbn=${encodeURIComponent(isbn)}&_=${Date.now()}`, { credentials: 'include' });
   await r.text();
   ```
7. **검증** — 장바구니 페이지를 다시 열어 5번 스크립트로 해당 ItemId 가 있는지 확인한다.
   **장바구니에서 확인된 경우에만** "장바구니 담기 완료" 로 기록한다. 없으면 `failed` 와 이유를 남긴다.
8. **정리** — 만든 탭을 `tabs_close_mcp` 로 닫는다. 로그인 상태는 그대로 둔다.

참고: `scripts/aladin_cart.js`(Playwright)는 같은 흐름의 스크립트 버전이다. 로컬 맥에서 `HEADED=1` 로 실행할 때만 쓰고,
클라우드에서는 쓰지 않는다.

### 4. 슬랙 신청 글 + 스레드
채널 관례(실제 신청 예시: 2026-11-16 Yohan 「좋은 전략 나쁜 전략」 스레드)를 그대로 따른다.

- **본문(채널)** — 한 줄. Ticket Manager 봇이 이 글로 OHWOS 티켓을 자동 발행한다.
  ```
  안녕하세요, 도서 구매 신청 드립니다.
  ```
- **스레드 답글** — 책마다 아래 블록, 여러 권이면 빈 줄로 구분.
  ```
  책제목 : <알라딘 상품명>
  장바구니 담기 완료
  <알라딘 상품 URL>
  ```
  - 담기에 실패한 책은 신청 글에 넣지 않는다. 담긴 책이 0권이면 슬랙에 아무것도 쓰지 않고 사용자에게 보고만 한다.
  - URL 은 `https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=<id>` 형태로 깔끔하게(추적 파라미터 제거).

**보내기 전 확인**: 본문과 스레드 초안을 사용자에게 보여 주고 "보낼까요?" 를 묻는다.
사용자가 이번 요청에서 이미 "확인 없이 바로 올려" 라고 했다면 생략한다.
보낼 때: `slack_send_message(channel_id=C03FXS3PQA2, message=본문)` → 응답의 ts 로
`slack_send_message(channel_id=C03FXS3PQA2, thread_ts=<ts>, message=스레드)`.
그 다음 `slack_read_thread` 로 Ticket Manager 의 티켓 번호(OHWOS-xxxxx)를 읽어 온다(몇 초 걸릴 수 있음, 없으면 "발행 대기" 로 기록).

### 5. 최종 보고
```
📚 도서 지원 신청 결과
| 도서 | 사내 보유 확인 | 장바구니 | 슬랙 |
|---|---|---|---|
| 좋은 전략 나쁜 전략 (리처드 루멜트) | 직접 확인 요청 | ✅ 담기 완료 | ✅ OHWOS-14212 |
스레드: <permalink>
다음 단계: 담당자가 주간 단위로 모아 구매 → 입고되면 DM. 다 읽고 한줄 리뷰 작성, 반납 필수(27층 책장).
```
실패가 있으면 어느 단계에서 왜 멈췄는지와, 사용자가 직접 할 일을 한 줄로 적는다.

## 하지 말 것
- 결제/주문하지 않는다. 구매는 담당자가 한다. 이 스킬은 **장바구니까지**만.
- 공용 장바구니의 다른 상품을 삭제·수정하지 않는다.
- 계정 정보를 커밋·로그·슬랙·대화에 남기지 않는다.
- 봇 탐지를 피하려는 우회(UA 위장 등)를 하지 않는다. 알라딘은 Claude in Chrome 으로만 다룬다.
- 장바구니에서 확인하지 못한 책을 "담기 완료" 로 쓰지 않는다.
