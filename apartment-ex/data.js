// Mock data for the prototype
window.APP_DATA = (() => {

  // Real-looking apartment data — Jamsil/Songpa focused
  const apartments = [
    // === 잠실 core (시작 디폴트 영역) ===
    {
      id: 'apt-jamsil-els',
      lat: 37.5145, lng: 127.0818,
      name: '잠실엘스',
      area: '송파구 잠실동',
      year: 2008,
      households: 5678,
      sizes: ['25py', '33py', '42py', '55py'],
      cases: 213,
      plans: 8,
      hue: 'h1',
      initial: '잠',
      pos: { x: 0.5, y: 0.5 },
      cluster: 'jamsil',
    },
    {
      id: 'apt-parkrio',
      lat: 37.5165, lng: 127.0884,
      name: '잠실파크리오',
      area: '송파구 신천동',
      year: 2008,
      households: 6864,
      sizes: ['25py', '33py', '45py'],
      cases: 156,
      plans: 6,
      hue: 'h3',
      initial: '파',
      pos: { x: 0.6, y: 0.45 },
      cluster: 'jamsil',
    },
    {
      id: 'apt-leesents',
      lat: 37.5167, lng: 127.0853,
      name: '잠실리센츠',
      area: '송파구 잠실동',
      year: 2008,
      households: 5563,
      sizes: ['28py', '36py', '47py'],
      cases: 178,
      plans: 9,
      hue: 'h2',
      initial: '리',
      pos: { x: 0.55, y: 0.35 },
      cluster: 'jamsil',
    },
    {
      id: 'apt-trizium',
      lat: 37.5130, lng: 127.0860,
      name: '잠실트리지움',
      area: '송파구 잠실동',
      year: 2007,
      households: 3696,
      sizes: ['26py', '33py', '44py'],
      cases: 142,
      plans: 7,
      hue: 'h4',
      initial: '트',
      pos: { x: 0.58, y: 0.55 },
      cluster: 'jamsil',
    },
    {
      id: 'apt-lakepalace',
      lat: 37.5132, lng: 127.0773,
      name: '잠실레이크팰리스',
      area: '송파구 신천동',
      year: 2006,
      households: 2678,
      sizes: ['33py', '42py', '49py'],
      cases: 98,
      plans: 5,
      hue: 'h5',
      initial: '레',
      pos: { x: 0.38, y: 0.52 },
      cluster: 'jamsil',
    },
    {
      id: 'apt-jugong5',
      lat: 37.5119, lng: 127.0834,
      name: '잠실주공5단지',
      area: '송파구 잠실동',
      year: 1978,
      households: 3930,
      sizes: ['34py', '36py'],
      cases: 67,
      plans: 4,
      hue: 'h1',
      initial: '주',
      pos: { x: 0.5, y: 0.62 },
      cluster: 'jamsil',
    },
    {
      id: 'apt-galleria',
      lat: 37.5190, lng: 127.0790,
      name: '갤러리아팰리스',
      area: '송파구 잠실동',
      year: 2003,
      households: 744,
      sizes: ['44py', '55py', '69py'],
      cases: 54,
      plans: 6,
      hue: 'h2',
      initial: '갤',
      pos: { x: 0.42, y: 0.28 },
      cluster: 'jamsil',
    },
    {
      id: 'apt-charmant',
      lat: 37.5110, lng: 127.0900,
      name: '잠실 더샵 스타파크',
      area: '송파구 신천동',
      year: 2015,
      households: 1148,
      sizes: ['25py', '33py', '38py'],
      cases: 86,
      plans: 5,
      hue: 'h3',
      initial: '더',
      pos: { x: 0.7, y: 0.65 },
      cluster: 'jamsil',
    },

    // === 송파 외곽 ===
    {
      id: 'apt-helio',
      lat: 37.5034, lng: 127.0996,
      name: '헬리오시티',
      area: '송파구 가락동',
      year: 2018,
      households: 9510,
      sizes: ['25py', '33py', '39py', '49py'],
      cases: 487,
      plans: 14,
      hue: 'h2',
      initial: '헬',
      pos: { x: 0.7, y: 0.85 },
      cluster: 'songpa',
    },
    {
      id: 'apt-gaepo',
      lat: 37.4870, lng: 127.0653,
      name: '개포래미안포레스트',
      area: '강남구 개포동',
      year: 2020,
      households: 2296,
      sizes: ['25py', '33py', '49py'],
      cases: 156,
      plans: 8,
      hue: 'h4',
      initial: '개',
      pos: { x: 0.25, y: 0.95 },
      cluster: 'gangnam',
    },
    {
      id: 'apt-garak',
      lat: 37.4950, lng: 127.1110,
      name: '가락 헬리오 더샵',
      area: '송파구 가락동',
      year: 2019,
      households: 1782,
      sizes: ['27py', '34py'],
      cases: 92,
      plans: 5,
      hue: 'h5',
      initial: '가',
      pos: { x: 0.8, y: 0.92 },
      cluster: 'songpa',
    },

    // === 강남 ===
    {
      id: 'apt-apgujeong',
      lat: 37.5266, lng: 127.0344,
      name: '압구정현대',
      area: '강남구 압구정동',
      year: 1976,
      households: 4148,
      sizes: ['35py', '50py', '73py'],
      cases: 47,
      plans: 12,
      hue: 'h4',
      initial: '압',
      pos: { x: 0.05, y: 0.15 },
      cluster: 'gangnam',
    },
    {
      id: 'apt-raemian',
      lat: 37.5024, lng: 127.0035,
      name: '래미안퍼스티지',
      area: '서초구 반포동',
      year: 2009,
      households: 2444,
      sizes: ['33py', '42py', '59py'],
      cases: 89,
      plans: 7,
      hue: 'h5',
      initial: '래',
      pos: { x: 0.05, y: 0.78 },
      cluster: 'banpo',
    },
    {
      id: 'apt-acro',
      lat: 37.5089, lng: 127.0114,
      name: '아크로리버파크',
      area: '서초구 반포동',
      year: 2016,
      households: 1612,
      sizes: ['34py', '45py', '59py'],
      cases: 134,
      plans: 9,
      hue: 'h2',
      initial: '아',
      pos: { x: 0.05, y: 0.65 },
      cluster: 'banpo',
    },
  ];

  // Photo helper - local thumbnails
  const photo = (n) => `assets/thumbnails/${String(n).padStart(2, '0')}.jpg`;
  const photos = {
    p1: photo(1), p2: photo(2), p3: photo(3), p4: photo(4),
    p5: photo(5), p6: photo(6), p7: photo(7), p8: photo(8),
    p9: photo(9), p10: photo(10), p11: photo(11), p12: photo(12),
    p13: photo(13), p14: photo(14), p15: photo(15), p16: photo(16),
    p17: photo(17), p18: photo(18), p19: photo(19), p20: photo(20),
  };

  // Cases for feed and complex pages
  // author: 'user' (일반 유저) | 'contractor' (시공업체)
  const cases = [
    { id: 'c1', apt: 'apt-jamsil-els', size: '33py', title: '잠실엘스 33평, 우드 톤으로 따뜻하게 리모델링', user: '한샘리하우스', author: 'contractor', likes: 2410, photo: photos.p1, hasPlan: true, daysAgo: 3 },
    { id: 'c2', apt: 'apt-jamsil-els', size: '42py', title: '아이 둘 키우기 좋은 화이트 인테리어', user: 'mom_house', author: 'user', likes: 1820, photo: photos.p2, hasPlan: true, daysAgo: 5 },
    { id: 'c3', apt: 'apt-jamsil-els', size: '25py', title: '미니멀하게 살아가는 25평 신혼집', user: 'minimal.k', author: 'user', likes: 980, photo: photos.p3, hasPlan: false, daysAgo: 7 },
    { id: 'c4', apt: 'apt-jamsil-els', size: '33py', title: '베이지 톤으로 포근하게 완성한 거실', user: '까사미아 디자인', author: 'contractor', likes: 1265, photo: photos.p4, hasPlan: true, daysAgo: 9 },
    { id: 'c5', apt: 'apt-helio', size: '33py', title: '헬리오시티 33평, LDK 통합 리모델링', user: '리바트 인테리어', author: 'contractor', likes: 3120, photo: photos.p5, hasPlan: true, daysAgo: 2 },
    { id: 'c6', apt: 'apt-helio', size: '39py', title: '4인 가족의 헬리오시티 39평 자연광 가득', user: 'sunny_4', author: 'user', likes: 1670, photo: photos.p6, hasPlan: true, daysAgo: 4 },
    { id: 'c7', apt: 'apt-apgujeong', size: '50py', title: '대형 평형 럭셔리 인테리어, 우드 + 골드', user: '리모델링플러스', author: 'contractor', likes: 1200, photo: photos.p7, hasPlan: true, daysAgo: 8 },
    { id: 'c8', apt: 'apt-apgujeong', size: '35py', title: '화이트톤 미니멀 거실, 우드 포인트로 따뜻하게', user: 'whitewood', author: 'user', likes: 312, photo: photos.p8, hasPlan: false, daysAgo: 14 },
    { id: 'c9', apt: 'apt-parkrio', size: '33py', title: '잠실파크리오 33평 그레이지 톤', user: 'greige.h', author: 'user', likes: 720, photo: photos.p9, hasPlan: false, daysAgo: 6 },
    { id: 'c10', apt: 'apt-raemian', size: '42py', title: '래미안 퍼스티지 42평, 클래식 모던', user: '오트레디자인', author: 'contractor', likes: 1450, photo: photos.p10, hasPlan: true, daysAgo: 11 },
    { id: 'c11', apt: 'apt-acro', size: '34py', title: '아크로리버파크 한강뷰 거실 인테리어', user: 'river.view', author: 'user', likes: 2890, photo: photos.p11, hasPlan: true, daysAgo: 1 },
    { id: 'c12', apt: 'apt-acro', size: '45py', title: '아크로 45평, 아이 키우기 좋은 구조', user: 'kids.home', author: 'user', likes: 1340, photo: photos.p12, hasPlan: true, daysAgo: 10 },
    { id: 'c13', apt: 'apt-jamsil-els', size: '33py', title: '북유럽 감성 잠실엘스 거실 인테리어', user: 'nordic.k', author: 'user', likes: 845, photo: photos.p13, hasPlan: true, daysAgo: 12 },
    { id: 'c14', apt: 'apt-helio', size: '49py', title: '헬리오시티 49평, 가족 모두를 위한 공간', user: 'family.lab', author: 'user', likes: 1980, photo: photos.p14, hasPlan: true, daysAgo: 6 },
    { id: 'c15', apt: 'apt-jamsil-els', size: '42py', title: '잠실엘스 42평 채광 좋은 자연 친화 인테리어', user: '디자인스튜디오우드', author: 'contractor', likes: 1320, photo: photos.p15, hasPlan: true, daysAgo: 4 },
    { id: 'c16', apt: 'apt-helio', size: '33py', title: '헬리오시티 33평 미니멀 화이트', user: 'minimal.w', author: 'user', likes: 1640, photo: photos.p16, hasPlan: false, daysAgo: 8 },
    { id: 'c17', apt: 'apt-jamsil-els', size: '25py', title: '신혼 첫집 25평, 화이트 + 우드 톤', user: 'newly.weds', author: 'user', likes: 754, photo: photos.p17, hasPlan: false, daysAgo: 15 },
    { id: 'c18', apt: 'apt-apgujeong', size: '73py', title: '압구정현대 73평, 빈티지 + 모던 믹스', user: '아우라디자인', author: 'contractor', likes: 2150, photo: photos.p18, hasPlan: true, daysAgo: 5 },
    { id: 'c19', apt: 'apt-parkrio', size: '45py', title: '파크리오 45평 한강뷰 거실', user: 'parkrio.fan', author: 'user', likes: 1190, photo: photos.p19, hasPlan: true, daysAgo: 13 },
    { id: 'c20', apt: 'apt-raemian', size: '33py', title: '래미안 33평, 차분한 그레이톤 미니멀', user: 'grey.tone', author: 'user', likes: 980, photo: photos.p20, hasPlan: true, daysAgo: 7 },
  ];

  // Sections on 집구경 feed
  const feedSections = [
    {
      id: 's1',
      title: '우리 단지 사례 모아보기 🏢',
      cases: ['c1', 'c4', 'c5', 'c11', 'c14'],
    },
    {
      id: 's2',
      title: '취향만 쏙쏙 골라 담은 추천 집들이',
      cases: ['c13', 'c6', 'c15', 'c10', 'c18'],
    },
    {
      id: 's3',
      title: '도면이 있는 시공 사례 📐',
      cases: ['c2', 'c7', 'c19', 'c20', 'c12'],
    },
  ];

  const byApt = (aptId) => cases.filter((c) => c.apt === aptId);

  // Real estate data per apartment (mock)
  const realEstate = {
    'apt-jamsil-els': {
      avgPrice: { sale: '24.8억', jeonse: '13.5억', wolse: '월 320' },
      pricePerPyeong: 7515,  // 만원
      priceChange: { value: '+3.2%', positive: true, period: '3개월' },
      transactions: [
        { date: '2026.04.28', type: '매매', size: '33평', floor: '15층', price: '24억 8,000' },
        { date: '2026.04.15', type: '매매', size: '42평', floor: '22층', price: '32억 5,000' },
        { date: '2026.04.02', type: '전세', size: '33평', floor: '7층', price: '13억 5,000' },
        { date: '2026.03.22', type: '매매', size: '25평', floor: '11층', price: '17억 9,000' },
      ],
      info: { parking: '1.4대/세대', heating: '개별 도시가스', floors: '15~33층', buildingCount: 65 },
    },
    'apt-helio': {
      avgPrice: { sale: '22.3억', jeonse: '11.8억', wolse: '월 290' },
      pricePerPyeong: 6757,
      priceChange: { value: '+1.8%', positive: true, period: '3개월' },
      transactions: [
        { date: '2026.05.02', type: '매매', size: '33평', floor: '18층', price: '22억 3,000' },
        { date: '2026.04.21', type: '매매', size: '39평', floor: '24층', price: '27억 0,000' },
        { date: '2026.04.10', type: '전세', size: '49평', floor: '11층', price: '15억 5,000' },
        { date: '2026.03.30', type: '매매', size: '25평', floor: '6층', price: '16억 8,500' },
      ],
      info: { parking: '1.7대/세대', heating: '개별 도시가스', floors: '15~35층', buildingCount: 84 },
    },
    'apt-apgujeong': {
      avgPrice: { sale: '49.5억', jeonse: '17.5억', wolse: '월 480' },
      pricePerPyeong: 14143,
      priceChange: { value: '+5.6%', positive: true, period: '3개월' },
      transactions: [
        { date: '2026.04.25', type: '매매', size: '50평', floor: '6층', price: '49억 5,000' },
        { date: '2026.04.10', type: '매매', size: '73평', floor: '8층', price: '72억 0,000' },
      ],
      info: { parking: '0.9대/세대', heating: '중앙난방', floors: '8~12층', buildingCount: 24 },
    },
    'apt-leesents': {
      avgPrice: { sale: '20.5억', jeonse: '11.0억', wolse: '월 270' },
      pricePerPyeong: 6212,
      priceChange: { value: '+2.4%', positive: true, period: '3개월' },
      transactions: [
        { date: '2026.04.20', type: '매매', size: '36평', floor: '20층', price: '20억 5,000' },
        { date: '2026.04.05', type: '전세', size: '28평', floor: '12층', price: '11억 0,000' },
      ],
      info: { parking: '1.5대/세대', heating: '개별 도시가스', floors: '15~32층', buildingCount: 35 },
    },
  };
  const defaultRE = {
    avgPrice: { sale: '시세 정보', jeonse: '시세 정보', wolse: '시세 정보' },
    pricePerPyeong: 6500,
    priceChange: { value: '+0.0%', positive: true, period: '3개월' },
    transactions: [],
    info: { parking: '1.4대/세대', heating: '개별 난방', floors: '10~25층', buildingCount: 30 },
  };
  const getRealEstate = (aptId) => realEstate[aptId] || defaultRE;

  // 시공 업체 목록 — 각 단지에서 작업한 업체, 없으면 인근/유사 업체 fallback
  const contractorsByApt = (aptId) => {
    const proCases = cases.filter((c) => c.apt === aptId && c.author === 'contractor');
    const grouped = {};
    proCases.forEach((c) => {
      if (!grouped[c.user]) grouped[c.user] = { name: c.user, cases: [], totalLikes: 0, viaThisApt: true };
      grouped[c.user].cases.push(c);
      grouped[c.user].totalLikes += c.likes;
    });
    let list = Object.values(grouped).sort((a, b) => b.totalLikes - a.totalLikes);

    // Fallback: show top platform contractors (marked as recommended) if none specific
    if (list.length === 0) {
      const allPros = cases.filter((c) => c.author === 'contractor');
      const allGrouped = {};
      allPros.forEach((c) => {
        if (!allGrouped[c.user]) allGrouped[c.user] = { name: c.user, cases: [], totalLikes: 0, viaThisApt: false };
        allGrouped[c.user].cases.push(c);
        allGrouped[c.user].totalLikes += c.likes;
      });
      list = Object.values(allGrouped).sort((a, b) => b.totalLikes - a.totalLikes).slice(0, 5);
    }
    return list;
  };
  const findApt = (id) => apartments.find((a) => a.id === id);
  const findCase = (id) => cases.find((c) => c.id === id);
  const latestCaseFor = (aptId) => {
    const own = cases
      .filter((c) => c.apt === aptId)
      .sort((a, b) => (a.daysAgo || 99) - (b.daysAgo || 99))[0];
    if (own) return own;
    // Generic placeholder content — uses the apt's own name so the popup makes sense
    const apt = apartments.find((a) => a.id === aptId);
    const seed = aptId.split('').reduce((s, ch) => s + ch.charCodeAt(0), 0);
    const fallbackPhoto = cases[seed % cases.length].photo;
    return {
      id: 'placeholder-' + aptId,
      apt: aptId,
      size: apt?.sizes?.[0] || '33py',
      title: `${apt?.name || ''} 사례 모음`,
      user: '오늘의집',
      author: 'user',
      likes: 0,
      photo: fallbackPhoto,
      hasPlan: false,
      daysAgo: 7,
    };
  };

  return { apartments, cases, photos, feedSections, byApt, findApt, findCase, latestCaseFor, getRealEstate, contractorsByApt, photo };
})();
