// ===== 프로토타입 더미 데이터 =====
// 스크린샷 기준: 경기도 성남시 분당구 동판교로 276 (삼평동, 봇들마을 이지더원)

window.DATA = {
  address: '경기도 성남시 분당구 동판교로 276 (삼평동, 봇들마…',
  complex: '봇들마을 이지더원',
  region: '성남시',

  // ── 현재안 재현용 ──────────────────────────────────
  partialServices: [
    { name: '주방', badge: 'N' },
    { name: '도배' },
    { name: '마루' },
    { name: '장판' },
  ],
  serviceIcons: [
    { name: '견적계산기', glyph: '🧮' },
    { name: '아파트사례', glyph: '🏢' },
    { name: '자재랭킹', glyph: '🏆' },
    { name: '전체서비스', glyph: '🔳' },
  ],
  movingChips: [
    { name: '이사 견적', glyph: '📦' },
    { name: '가전 렌탈', glyph: '🧊' },
    { name: '인터넷 설치', glyph: '📶' },
  ],
  vendors: [
    { name: '디자인트리', std: true, rating: 4.7, reviews: 32, deals: 11,
      tags: ['우리 아파트 3회 시공', '책임보장', '원가검수'], thumb: '01' },
    { name: '아솔랩 디자인', std: false, rating: 5.0, reviews: 8, deals: 4,
      tags: ['우리 아파트 1회 시공', '책임보장'], thumb: '05' },
  ],
  nearbyReviews: [
    { title: '30평대 · 경기도 성남시 분…', body: '처음 상담할 때부터 저희가 원하는 분위기나 방향을 꼼꼼히 들어주시고, 오래된 아파트…', vendor: '아벨디자인', thumb: '02' },
    { title: '50평 이상 · 단독주택', body: '박은주 실장님을 통해 인테리어를 진행하면서 처음 상담부터 마무리까지 정말 만족스…', vendor: '슬로우핸드 동탄점', thumb: '03' },
    { title: '30평대 · 경기도 용인시…', body: '처음 상담 때 제가 원하는 걸 정확히 파악하시고 제안해주셔서…', vendor: '오느른 디자인', thumb: '04' },
  ],
  directServices: [
    { cat: '주방', name: '오늘의집 키친', desc: '중간마진 없는 합리적 가격', thumb: '06' },
    { cat: '도배', name: '오늘의집 도배', desc: '리뷰가 검증한 시공 품질', thumb: '07' },
  ],
  beforeAfter: [
    { spec: '30평 · 3.1m · ㅡ자 주방', body: '첫 시공이라 신뢰와 A/S가 젤 중요해서 오늘의집에서 했고요! 계약서를 전자상으로 체결하는 편리성. 친절한 매니저님, 시공을 조심스럽게 잘 해…', before: '08', after: '09' },
    { spec: '24평 · 3m · ㅡ자 주방', body: '24평에 3미터 일자 주방인데 이정도 금액이면 정말 만족스럽고 소통 과정도 매우 친절…', before: '10', after: '11' },
  ],
  cases: [
    { title: '분당 시범한양 12평형', meta: '12평 · 내추럴', thumb: '12' },
    { title: '용인 기흥 신갈 새릉골풍림아파트 34평 인테리어 리모델링', meta: '33평 · 내추럴', thumb: '13' },
    { title: '서현포스빌 분당/판교 리모델링', meta: '31평 · 내추럴', thumb: '14' },
  ],
  caseFilters: ['전체', '모던', '미니멀&심플', '내추럴'],
  budgetTabs: ['20평대', '30평대', '40평대'],
  budgetRanks: {
    '20평대': [
      { label: '4천만원대', pct: 29, top: true },
      { label: '3천만원대', pct: 23 },
      { label: '5천만원대', pct: 18 },
    ],
    '30평대': [
      { label: '5천만원대', pct: 31, top: true },
      { label: '6천만원대', pct: 24 },
      { label: '4천만원대', pct: 19 },
    ],
    '40평대': [
      { label: '7천만원대', pct: 27, top: true },
      { label: '6천만원대', pct: 22 },
      { label: '8천만원대', pct: 20 },
    ],
  },

  // ── 개편안: 서비스 그리드 (탭 전체 지도) ───────────
  grid: [
    { name: '전체시공',   glyph: '🏠', recent: true },
    { name: '부분시공',   glyph: '🔧', recent: true },
    { name: '견적계산기', glyph: '🧮', badge: 'NEW' },
    { name: '시공사례',   glyph: '🏢' },
    { name: '업체찾기',   glyph: '👷' },
    { name: '이사견적',   glyph: '📦' },
    { name: '가전렌탈',   glyph: '🧊' },
    { name: '인터넷',     glyph: '📶' },
  ],

  // ── 개편안: 견적 트래커 상태 ──────────────────────
  // 이사플래너(~2024, sunset 2025-08)의 회고 결론 — "일정 알림보다
  // 업체 추천/견적 비교가 핵심이었다" — 을 축으로 삼는다.
  // 진행률/체크리스트가 아니라, 실제로 요청한 견적의 응답 상태가
  // 재방문 이유를 만든다. 업체 답을 기다리는 시간은 실재하므로.
  quotes: [
    {
      id: 'empty', label: '견적 0',
      kind: 'empty',
      title: '견적, 한 번에 받아보세요',
      sub: '이사 일정만 알려주시면 필요한 업체 견적을 모아드려요',
      picks: [
        { name: '전체시공', glyph: '🏠', on: true },
        { name: '이사',     glyph: '📦', on: true },
        { name: '입주청소', glyph: '🧼', on: false },
        { name: '인터넷',   glyph: '📶', on: false },
      ],
      cta: '선택한 2개 견적 요청하기',
    },
    {
      id: 'waiting', label: '응답 대기',
      kind: 'tracking',
      category: '전체시공',
      title: '내 견적',
      sub: '3곳 요청 · 1곳 도착 · 2곳 대기중',
      rows: [
        { vendor: '디자인트리',   std: true,  amount: 4180, status: 'in',   note: '방금 도착', fresh: true },
        { vendor: '아솔랩 디자인', std: false, amount: null, status: 'wait', note: '보통 2일 걸려요' },
        { vendor: '오느른 디자인', std: true,  amount: null, status: 'wait', note: '보통 2일 걸려요' },
      ],
      cta: '견적 더 받기',
    },
    {
      id: 'compare', label: '비교',
      kind: 'tracking',
      category: '전체시공',
      title: '내 견적',
      sub: '3곳 모두 도착 · 비교해보세요',
      rows: [
        { vendor: '아솔랩 디자인', std: false, amount: 3980, status: 'in', tag: '최저' },
        { vendor: '디자인트리',   std: true,  amount: 4180, status: 'in' },
        { vendor: '오느른 디자인', std: true,  amount: 4480, status: 'in' },
      ],
      cta: '항목별 비교표 보기',
    },
    {
      id: 'after', label: '계약 후',
      kind: 'contracted',
      category: '전체시공',
      title: '전체시공 · 디자인트리',
      sub: '4,180만원 · 10월 2일 착공',
      remaining: [
        { name: '입주청소', glyph: '🧼', hint: '보통 3주 전에 예약해요' },
        { name: '인터넷',   glyph: '📶', hint: '설치까지 평균 4일' },
      ],
      cta: '남은 견적 한 번에 받기',
    },
  ],

  // ── 개편안: 가격 추적 (계약 없이 반복 소비되는 유일한 데이터) ──
  price: {
    scope: '봇들마을 이지더원 · 32평 전체시공',
    current: 4280,          // 만원
    delta: -120,            // 전월 대비
    sampleN: 37,
    insight: '3개월째 내려가는 중이에요',
    series: [
      { m: '3월', v: 4520 },
      { m: '4월', v: 4610 },
      { m: '5월', v: 4580 },
      { m: '6월', v: 4470 },
      { m: '7월', v: 4400 },
      { m: '8월', v: 4280 },
    ],
  },

  // ── 개편안: 우리 동네 소식 피드 ────────────────────
  feed: {
    newReviews: 3,
    newCases: 2,
    items: [
      { kind: '새 리뷰', fresh: true, title: '봇들마을 이지더원 32평', body: '주방만 부분시공 했는데 3주 만에 끝났어요. 견적은 1,180만원.', meta: '2시간 전 · 디자인트리', thumb: '15' },
      { kind: '새 시공사례', fresh: true, title: '삼평동 32평 내추럴', body: '같은 평형 · 같은 구조', meta: '어제 · 아솔랩 디자인', thumb: '16' },
      { kind: '견적 변동', fresh: false, title: '우리 단지 8월 평균 4,280만원', body: '전월 대비 120만원 내려갔어요', meta: '3일 전 · 37건 기준', thumb: '17' },
      { kind: '새 리뷰', fresh: false, title: '판교원마을 34평', body: '도배·마루만 했는데 만족도 높아요', meta: '5일 전 · 오느른 디자인', thumb: '18' },
    ],
  },
};
