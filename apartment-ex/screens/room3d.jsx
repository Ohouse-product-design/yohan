// ===== 3D 방꾸미기 화면 =====
const Room3dScreen = ({ nav, params }) => {
  const D = window.APP_DATA;
  const apt = D.findApt(params.aptId);
  const [tab, setTab] = React.useState('상품');
  const [chip, setChip] = React.useState('배치상품');

  return (
    <div className="app" data-screen-label="08 3D 방꾸미기" style={{ background: '#141414' }}>
      {/* Top action bar — overlay on dark canvas */}
      <div style={{
        position: 'absolute', top: 54, left: 0, right: 0,
        display: 'flex', alignItems: 'center',
        padding: '8px 12px',
        zIndex: 30,
        background: 'transparent',
      }}>
        <button onClick={() => nav.pop()} style={{
          width: 40, height: 40,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
        }}>
          <Icon name="back" size={24} stroke={2}/>
        </button>
        <span style={{ flex: 1 }}/>
        <TopAction icon="locationFill" label="뷰 변경"/>
        <TopAction icon="photo" label="캡처"/>
        <TopAction icon="pages" label="방 목록"/>
        <TopAction icon="menu" label="메뉴"/>
      </div>

      {/* 3D viewer area */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        bottom: 380,
        background: 'linear-gradient(180deg, #000 0%, #1a1a1a 60%, #0a0a0a 100%)',
        overflow: 'hidden',
      }}>
        <RoomRender3D/>

        {/* Floating product suggestion pill */}
        <div style={{
          position: 'absolute',
          bottom: 14, left: 14,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#fff',
          color: '#141414',
          padding: '9px 14px 9px 11px',
          borderRadius: 999,
          fontSize: 13, fontWeight: 700,
          boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
        }}>
          <Icon name="sparkle" size={14} stroke={2.4}/>
          맞춤 상품 추천
        </div>

        {/* Undo/redo */}
        <div style={{
          position: 'absolute',
          bottom: 14, right: 14,
          display: 'flex', gap: 8,
        }}>
          <button style={undoBtnStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/>
            </svg>
          </button>
          <button style={undoBtnStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 15-6.7L21 13"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom panel */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 380,
        background: '#fff',
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* grabber */}
        <div style={{
          padding: '8px 0 6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 40, height: 4, borderRadius: 4,
            background: '#D9D9D9',
          }}/>
        </div>

        {/* Segment control: 상품 / 공간 수정 / 아이디어 */}
        <div style={{
          margin: '4px 14px 8px',
          background: '#F7F9FA',
          borderRadius: 999,
          padding: 4,
          display: 'flex',
        }}>
          {['상품', '공간 수정', '아이디어'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '9px 0',
                borderRadius: 999,
                fontSize: 14, fontWeight: 700,
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#141414' : '#9D9D9D',
                boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                border: 0,
                letterSpacing: '-0.02em',
              }}
            >{t}</button>
          ))}
        </div>

        {/* Chips row */}
        <div style={{
          display: 'flex', gap: 8, alignItems: 'center',
          padding: '4px 14px 10px',
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          <button style={chipBtn(false)}>
            <Icon name="search" size={14} stroke={2}/>
            <span style={{ marginLeft: 4 }}>검색</span>
          </button>
          <span style={{ width: 1, height: 16, background: 'var(--border)', flexShrink: 0 }}/>
          {['배치상품', '스크랩', '내3D상품', '테이블', '수납장'].map((c) => (
            <button key={c} onClick={() => setChip(c)}
              style={chipBtn(chip === c)}
            >{c}</button>
          ))}
        </div>

        {/* AI photo CTA */}
        <div style={{ padding: '4px 14px 12px' }}>
          <button style={{
            width: '100%',
            display: 'flex', alignItems: 'center',
            background: '#E5F1FF', color: '#1A86FF',
            padding: '12px 14px',
            borderRadius: 12,
            fontSize: 14, fontWeight: 700,
            border: 0,
            letterSpacing: '-0.02em',
            gap: 10,
          }}>
            <span style={{
              width: 26, height: 26, borderRadius: 6,
              background: '#1A86FF', color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon name="photo" size={15} stroke={2}/>
            </span>
            <span style={{ flex: 1, textAlign: 'left' }}>사진으로 3D 모델 만들기</span>
            <Icon name="chevron" size={16} stroke={2.2}/>
          </button>
        </div>

        {/* Items count */}
        <div style={{
          padding: '4px 18px 8px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>배치상품 38개</span>
          <span style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 }}>삭제</span>
        </div>

        {/* Product strip */}
        <div style={{
          display: 'flex', gap: 8,
          padding: '0 14px 14px',
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {[1,2,3,4,5].map((i) => (
            <div key={i} style={{
              flex: '0 0 84px',
              width: 84, height: 84,
              borderRadius: 10,
              overflow: 'hidden',
              background: '#F4F4F4',
              position: 'relative',
            }}>
              <img
                src={`assets/thumbnails/${String(i+5).padStart(2,'0')}.jpg`}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TopAction = ({ icon, label }) => (
  <button style={{
    width: 56,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 2,
    color: '#fff',
    padding: '4px 0',
  }}>
    <Icon name={icon} size={22} stroke={2}/>
    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '-0.02em' }}>{label}</span>
  </button>
);

const undoBtnStyle = {
  width: 38, height: 38, borderRadius: '50%',
  background: 'rgba(255,255,255,0.85)',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  color: '#141414',
  border: 0,
  backdropFilter: 'blur(8px)',
};

const chipBtn = (active) => ({
  flexShrink: 0,
  padding: '9px 14px',
  borderRadius: 999,
  fontSize: 13, fontWeight: 700,
  background: active ? '#141414' : '#fff',
  color: active ? '#fff' : '#424242',
  border: active ? 'none' : '1px solid var(--border-strong)',
  display: 'inline-flex', alignItems: 'center',
  letterSpacing: '-0.02em',
});

// ===== Stylized 3D room render (SVG isometric) =====
const RoomRender3D = () => (
  <svg viewBox="0 0 800 500" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
    <defs>
      <linearGradient id="floor-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F5E9D6"/>
        <stop offset="1" stopColor="#E5D2B4"/>
      </linearGradient>
      <linearGradient id="wall-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FAFAFA"/>
        <stop offset="1" stopColor="#E8E8E8"/>
      </linearGradient>
      <linearGradient id="grid-tile" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#0a0a0a"/>
        <stop offset="1" stopColor="#1a1a1a"/>
      </linearGradient>
      <pattern id="grid-pattern" patternUnits="userSpaceOnUse" width="32" height="16">
        <rect width="32" height="16" fill="#0a0a0a"/>
        <path d="M0 0 L32 0 M0 16 L32 16" stroke="#222" strokeWidth="0.5"/>
        <path d="M0 0 L0 16 M16 0 L16 16 M32 0 L32 16" stroke="#222" strokeWidth="0.5"/>
      </pattern>
    </defs>

    {/* black grid base */}
    <rect width="800" height="500" fill="url(#grid-pattern)"/>

    {/* Floor (parallelogram) */}
    <polygon points="180,200 720,240 600,440 60,400" fill="url(#floor-grad)" stroke="#a08858" strokeWidth="1"/>

    {/* Wall back */}
    <polygon points="180,200 720,240 720,120 180,80" fill="url(#wall-grad)" stroke="#bbb" strokeWidth="1"/>
    {/* Wall left */}
    <polygon points="180,200 180,80 60,160 60,400" fill="#F0F0F0" stroke="#bbb" strokeWidth="1" opacity="0.95"/>

    {/* Bed (mattress) */}
    <g>
      <polygon points="120,330 290,360 270,420 100,390" fill="#fff" stroke="#aaa" strokeWidth="1"/>
      <polygon points="120,330 290,360 290,345 120,315" fill="#E5E5E5" stroke="#aaa" strokeWidth="0.5"/>
      <polygon points="100,390 270,420 270,408 100,378" fill="#D5D5D5"/>
      {/* pillow */}
      <polygon points="130,338 175,346 170,360 125,352" fill="#fff" stroke="#bbb" strokeWidth="0.5"/>
    </g>

    {/* Wardrobe back wall */}
    <g>
      <polygon points="380,80 420,90 420,260 380,250" fill="#E0E0E0" stroke="#aaa"/>
      <polygon points="420,90 580,120 580,280 420,260" fill="#F2F2F2" stroke="#aaa"/>
      <polygon points="580,120 700,140 700,290 580,280" fill="#E0E0E0" stroke="#aaa"/>
      {/* doors */}
      <line x1="475" y1="100" x2="475" y2="265" stroke="#bbb" strokeWidth="1"/>
      <line x1="525" y1="110" x2="525" y2="270" stroke="#bbb" strokeWidth="1"/>
      <line x1="630" y1="128" x2="630" y2="284" stroke="#bbb" strokeWidth="1"/>
    </g>

    {/* Rug (oval) */}
    <ellipse cx="430" cy="400" rx="80" ry="22" fill="#EFE5D2" stroke="#c8b78a" strokeWidth="0.5"/>

    {/* Floor lamp */}
    <g>
      <line x1="420" y1="335" x2="420" y2="395" stroke="#aaa" strokeWidth="1"/>
      <ellipse cx="420" cy="335" rx="14" ry="6" fill="#fff" stroke="#aaa"/>
      <ellipse cx="420" cy="395" rx="9" ry="3" fill="#999"/>
    </g>

    {/* Sink/toilet area on right */}
    <g>
      <polygon points="690,330 730,338 720,378 680,368" fill="#fff" stroke="#aaa"/>
      <ellipse cx="700" cy="345" rx="10" ry="4" fill="#E0E0E0"/>
    </g>

    {/* Window curtain back-left */}
    <g opacity="0.7">
      <polygon points="200,90 240,98 240,250 200,242" fill="#fff" stroke="#bbb" strokeWidth="0.5"/>
      <line x1="210" y1="92" x2="210" y2="245" stroke="#E5E5E5"/>
      <line x1="220" y1="94" x2="220" y2="247" stroke="#E5E5E5"/>
      <line x1="230" y1="96" x2="230" y2="249" stroke="#E5E5E5"/>
    </g>

    {/* Small chair */}
    <g>
      <ellipse cx="350" cy="430" rx="14" ry="6" fill="#444"/>
      <line x1="350" y1="424" x2="350" y2="412" stroke="#666" strokeWidth="1.5"/>
      <ellipse cx="350" cy="412" rx="8" ry="3" fill="#666"/>
    </g>
  </svg>
);

window.Room3dScreen = Room3dScreen;