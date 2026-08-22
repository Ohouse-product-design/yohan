// ===== 두 화면이 공유하는 껍데기 =====

const Thumb = ({ id, style, className }) => (
  <img src={`assets/thumbnails/${id}.jpg`} alt="" className={className}
       style={{ objectFit: 'cover', display: 'block', background: '#EEE', ...style }}/>
);

// 주석 래퍼 — 상단 컨트롤의 "주석" 토글이 켜져야 보인다
const Ann = ({ kind = 'bad', label, children, style, pos = 'top' }) => (
  <div className={`ann ${kind} ${pos === 'bottom' ? 'pos-bottom' : ''}`} style={style}>
    {label && <span className={`ann-tag ${kind} ${pos === 'bottom' ? 'at-bottom' : ''}`}>{label}</span>}
    {children}
  </div>
);

// 검색바 — 현재안은 커머스 검색어, 개편안은 탭 컨텍스트 검색
const AppBar = ({ placeholder, ann }) => {
  const bar = (
    <div className="appbar">
      <Icon name="menu" size={24}/>
      <div className="searchbox">
        <Icon name="search" size={16} stroke={2.1}/>
        <span>{placeholder}</span>
      </div>
      <div className="icons">
        <Icon name="bell" size={22}/>
        <Icon name="bookmark" size={22}/>
        <Icon name="cart" size={22}/>
      </div>
    </div>
  );
  return ann ? <Ann kind={ann.kind} label={ann.label} pos="bottom">{bar}</Ann> : bar;
};

const BottomNav = () => {
  const items = [
    { name: '홈', src: 'assets/icons/icon-home.svg' },
    { name: '집구경', src: 'assets/icons/icon-home-tour.svg' },
    { name: '쇼핑', src: 'assets/icons/icon-shopping.svg' },
    { name: '인테리어/생활', src: 'assets/icons/icon-interior.svg' },
    { name: '마이페이지', src: 'assets/icons/icon-user.svg' },
  ];
  return (
    <div className="bottomnav">
      {items.map((it) => {
        const on = it.name === '인테리어/생활';
        return (
          <button key={it.name}>
            <img src={it.src} alt="" width={24} height={24}
                 style={{ opacity: on ? 1 : 0.55, display: 'block' }}/>
            <span style={{
              fontSize: 10, marginTop: 2, letterSpacing: '-0.02em',
              fontWeight: on ? 700 : 500, color: on ? '#141414' : '#9D9D9D',
            }}>{it.name}</span>
          </button>
        );
      })}
    </div>
  );
};

// 앱 아이콘 타일 (그리드 / 칩 공용)
const Tile = ({ glyph, name, badge, tint = '#F4F5F6', size = 52 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, minWidth: 0 }}>
    <div style={{ position: 'relative' }}>
      <div style={{
        width: size, height: size, borderRadius: 15, background: tint,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.46, lineHeight: 1,
      }}>{glyph}</div>
      {badge && (
        <span style={{
          position: 'absolute', top: -4, right: -6,
          background: badge === 'N' ? '#F1554C' : '#F1554C', color: '#fff',
          fontSize: badge === 'N' ? 9 : 8.5, fontWeight: 800, letterSpacing: '-0.02em',
          borderRadius: 999, padding: badge === 'N' ? '2px 5px' : '2px 5px',
          border: '1.5px solid #fff', lineHeight: 1.15,
        }}>{badge}</span>
      )}
    </div>
    <span style={{
      fontSize: 12.5, fontWeight: 500, color: '#2B2B2B', letterSpacing: '-0.03em',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
    }}>{name}</span>
  </div>
);

const MoreBtn = ({ label = '더보기' }) => (
  <button className="morebtn">{label}<Icon name="chevron" size={15} stroke={2.2}/></button>
);

Object.assign(window, { Thumb, Ann, AppBar, BottomNav, Tile, MoreBtn });
