// ===== 지도뷰 =====
const MapScreen = ({ nav }) => {
  const D = window.APP_DATA;
  const [selectedId, setSelectedId] = React.useState('apt-jamsil-els');
  const [sheetExpanded, setSheetExpanded] = React.useState(false);
  const [filterPlan, setFilterPlan] = React.useState(false);

  const selected = D.findApt(selectedId);
  const selectedCases = D.byApt(selectedId);

  return (
    <div className="app" data-screen-label="02 지도뷰" style={{ position: 'relative' }}>
      {/* Map canvas */}
      <div className="map-canvas">
        <MapBackground/>

        {/* markers */}
        {D.apartments.map((a) => {
          if (filterPlan && a.plans === 0) return null;
          const isSel = a.id === selectedId;
          return (
            <button
              key={a.id}
              className={`map-marker ${isSel ? 'selected' : ''}`}
              style={{ left: `${a.pos.x * 100}%`, top: `${a.pos.y * 100}%` }}
              onClick={() => { setSelectedId(a.id); setSheetExpanded(false); }}
            >
              <div className="pill">
                <span className={`swatch ${a.hue}`} style={swatchStyle(a.hue)}>{a.initial}</span>
                <span>{a.name}</span>
                <span className="count">{a.cases}</span>
              </div>
              <div className="pin"/>
            </button>
          );
        })}

        {/* search header */}
        <div className="map-search">
          <button className="pill-btn icon" onClick={() => nav.pop()}>
            <Icon name="back" size={20}/>
          </button>
          <button className="pill-btn" style={{ flex: 1, justifyContent: 'flex-start' }}>
            <Icon name="search" size={16}/>
            <span style={{ color: '#999', fontWeight: 500 }}>아파트 단지 검색</span>
          </button>
        </div>

        {/* second-row chips */}
        <div style={{
          position: 'absolute',
          top: 60,
          left: 12, right: 12,
          display: 'flex', gap: 8, overflowX: 'auto',
          zIndex: 6, scrollbarWidth: 'none',
        }}>
          <button className="map-chip dark">
            <Icon name="filter" size={12} stroke={2.4}/>
            필터
          </button>
          <button className="map-chip">강남 3구</button>
          <button
            className={`map-chip ${filterPlan ? 'active' : ''}`}
            onClick={() => setFilterPlan((v) => !v)}
          >
            {filterPlan && <Icon name="check" size={12} stroke={2.6}/>}
            도면 있음
          </button>
          <button className="map-chip">평형</button>
          <button className="map-chip">연식</button>
        </div>

        {/* locate */}
        <button className="map-locate" style={{ top: 122 }}>
          <Icon name="layers" size={18}/>
        </button>
        <button className="map-locate" style={{ bottom: 280 }}>
          <Icon name="target" size={20}/>
        </button>

        {/* recenter pill */}
        <button className="map-recenter" style={{ bottom: 244 }}>
          <Icon name="search" size={13}/>
          이 지역 다시 검색
        </button>

        {/* FAB 글쓰기 */}
        <button className="fab dark" onClick={() => nav.push('compose')} style={{ bottom: 248, right: 14, padding: '10px 14px' }}>
          <Icon name="plus" size={16} stroke={2.6}/>
          글쓰기
        </button>
      </div>

      {/* bottom sheet */}
      <div className={`map-sheet ${sheetExpanded ? 'expanded' : ''}`} style={{
        bottom: 52,
        transform: 'translateY(0)',
        maxHeight: sheetExpanded ? '70%' : '230px',
        transition: 'max-height 280ms cubic-bezier(0.32, 0.72, 0, 1)',
      }}>
        <div
          className="grabber"
          onClick={() => setSheetExpanded((v) => !v)}
        />

        <div className="sheet-body">
          {/* hero - selected apt */}
          <div className="sheet-hero" onClick={() => nav.push('complex', { aptId: selectedId })}>
            <div className={`apt-thumb ${selected.hue}`}>
              <AptThumb apt={selected}/>
            </div>
            <div className="apt-info">
              <div className="apt-name">
                {selected.name}
              </div>
              <div className="apt-meta">{selected.year}년 · {selected.households.toLocaleString()}세대</div>
              <div className="apt-stats" style={{ marginTop: 4 }}>
                <span className="s-case">사례 {selected.cases}</span>
                <span className="sep">·</span>
                <span className="s-plan">도면 {selected.plans}</span>
                <span className="sep">·</span>
                <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>
                  {selected.sizes.join(' / ')}
                </span>
              </div>
            </div>
            <Icon name="chevron" size={20}/>
          </div>

          {/* thumb strip */}
          <div style={{
            display: 'flex', gap: 8, padding: '0 14px 14px',
            overflowX: 'auto', scrollbarWidth: 'none',
          }}>
            {selectedCases.slice(0, 8).map((c) => (
              <div
                key={c.id}
                style={{
                  flex: '0 0 110px', width: 110, aspectRatio: '1',
                  borderRadius: 8, overflow: 'hidden',
                  background: '#F5F5F5', position: 'relative', cursor: 'pointer',
                }}
                onClick={() => nav.push('cdp', { caseId: c.id })}
              >
                <img src={c.photo} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                <div style={{
                  position: 'absolute', top: 6, left: 6,
                  background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 10,
                  fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                }}>{c.size}</div>
                {c.hasPlan && (
                  <div style={{
                    position: 'absolute', bottom: 6, right: 6,
                    background: 'var(--ohouse-blue)', color: '#fff', fontSize: 10,
                    fontWeight: 700, padding: '2px 5px', borderRadius: 4,
                    display: 'inline-flex', alignItems: 'center', gap: 2,
                  }}>
                    <Icon name="plan" size={9} stroke={2.6}/>
                    도면
                  </div>
                )}
              </div>
            ))}
            <div
              style={{
                flex: '0 0 110px', width: 110, aspectRatio: '1',
                borderRadius: 8, background: '#F5F5F5',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: '#666',
                cursor: 'pointer',
              }}
              onClick={() => nav.push('complex', { aptId: selectedId })}
            >
              <Icon name="chevron" size={20}/>
              <div style={{ marginTop: 4 }}>전체 보기</div>
            </div>
          </div>

          {/* expanded view: full case grid */}
          {sheetExpanded && (
            <div style={{ padding: '4px 14px 20px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#888', marginBottom: 10, padding: '4px 4px' }}>
                평형별 사례
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {selectedCases.map((c) => <CaseCard key={c.id} c={c} nav={nav}/>)}
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav active="집구경"/>

      <style>{`
        .map-chip {
          background: #fff; border-radius: 999px;
          padding: 8px 12px; font-size: 12px; font-weight: 600;
          color: #181818;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          display: inline-flex; align-items: center; gap: 4px;
          white-space: nowrap; flex-shrink: 0;
        }
        .map-chip.dark { background: #181818; color: #fff; }
        .map-chip.active { background: var(--ohouse-blue); color: #fff; }
      `}</style>
    </div>
  );
};

function swatchStyle(hue) {
  const map = {
    h1: 'linear-gradient(135deg, #5BB5F5, #1571FF)',
    h2: 'linear-gradient(135deg, #FF9B5C, #FF7900)',
    h3: 'linear-gradient(135deg, #6FCB6A, #2F8F45)',
    h4: 'linear-gradient(135deg, #FF6E94, #E03671)',
    h5: 'linear-gradient(135deg, #8C72E5, #5E45C8)',
  };
  return { background: map[hue] || map.h1 };
}

// ===== Stylized map background =====
const MapBackground = () => {
  return (
    <svg className="streets" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EBF3F0"/>
          <stop offset="1" stopColor="#DDE7E2"/>
        </linearGradient>
        <pattern id="park-pat" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="#CFE4D0"/>
        </pattern>
      </defs>

      {/* background */}
      <rect width="400" height="700" fill="url(#bg-grad)"/>

      {/* Parks & blocks */}
      <ellipse cx="80" cy="240" rx="60" ry="40" fill="url(#park-pat)" opacity="0.7"/>
      <ellipse cx="320" cy="120" rx="50" ry="30" fill="url(#park-pat)" opacity="0.7"/>
      <ellipse cx="280" cy="520" rx="70" ry="50" fill="url(#park-pat)" opacity="0.7"/>

      {/* river */}
      <path d="M -20 360 Q 100 320 180 350 T 420 380 L 420 410 Q 280 390 180 400 Q 100 410 -20 410 Z"
        fill="#BFD9E5" opacity="0.9"/>
      <path d="M -20 360 Q 100 320 180 350 T 420 380"
        stroke="#9ABFD0" strokeWidth="1" fill="none" opacity="0.5"/>

      {/* major streets — yellow highway */}
      <path d="M0 280 Q 100 250 200 290 T 400 330" stroke="#F4D88A" strokeWidth="14" fill="none" opacity="0.85"/>
      <path d="M0 280 Q 100 250 200 290 T 400 330" stroke="#fff" strokeWidth="1" strokeDasharray="6 8" fill="none"/>

      {/* secondary streets */}
      <path d="M50 0 L80 700" stroke="#E8E2D6" strokeWidth="5" fill="none"/>
      <path d="M180 0 L220 700" stroke="#E8E2D6" strokeWidth="5" fill="none"/>
      <path d="M340 0 L320 700" stroke="#E8E2D6" strokeWidth="5" fill="none"/>

      <path d="M0 130 L400 110" stroke="#fff" strokeWidth="3" fill="none"/>
      <path d="M0 470 L400 500" stroke="#fff" strokeWidth="3" fill="none"/>
      <path d="M0 600 L400 580" stroke="#fff" strokeWidth="3" fill="none"/>

      {/* thin streets */}
      <g stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.7">
        <path d="M0 70 L400 60"/>
        <path d="M0 200 L400 215"/>
        <path d="M0 540 L400 555"/>
        <path d="M120 0 L130 700"/>
        <path d="M260 0 L255 700"/>
      </g>

      {/* block labels */}
      <g fill="#9CA5A0" fontSize="9" fontWeight="600" opacity="0.6">
        <text x="95" y="60">압구정동</text>
        <text x="320" y="240">청담동</text>
        <text x="155" y="510">반포동</text>
        <text x="340" y="460">잠원동</text>
        <text x="30" y="630">서초동</text>
      </g>

      {/* subway lines */}
      <g fill="none" strokeWidth="3" opacity="0.85">
        <path d="M -20 460 Q 80 440 200 460 T 420 470" stroke="#00A84D" />
      </g>
      <g fill="#fff" stroke="#00A84D" strokeWidth="2">
        <circle cx="80" cy="448" r="5"/>
        <circle cx="220" cy="461" r="5"/>
        <circle cx="350" cy="468" r="5"/>
      </g>
    </svg>
  );
};

window.MapScreen = MapScreen;
window.MapBackground = MapBackground;
