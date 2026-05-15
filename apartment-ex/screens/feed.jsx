// ===== 집구경 메인 (지도 풀스크린 + 모달 시트) =====
const FeedScreen = ({ nav, params }) => {
  const D = window.APP_DATA;
  const [subTab, setSubTab] = React.useState('추천');
  // sheet states: 'mid' (default), 'expanded' (covers map), 'collapsed' (peek)
  const [sheetState, setSheetState] = React.useState(params?.openApt ? 'expanded' : 'mid');
  const [selectedAptId, setSelectedAptId] = React.useState(params?.openApt || null);
  const [dragOffset, setDragOffset] = React.useState(null); // px offset during drag

  const dragRef = React.useRef({ active: false, startY: 0, startState: 'mid' });

  const stateTops = {
    collapsed: 0.86,
    mid: 0.55,
    expanded: 0.21, // ~184/874 — sits BELOW search + filter chips
  };

  const onPointerDown = (e) => {
    dragRef.current = { active: true, startY: e.clientY, startState: sheetState };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const dy = e.clientY - dragRef.current.startY;
    setDragOffset(dy);
  };
  const onPointerUp = (e) => {
    if (!dragRef.current.active) return;
    const dy = e.clientY - dragRef.current.startY;
    dragRef.current.active = false;
    setDragOffset(null);

    // Determine end state based on drag distance + direction
    const startTop = stateTops[dragRef.current.startState];
    const deviceH = 874;
    const endTopPct = startTop + dy / deviceH;
    // snap to nearest
    let nearest = 'mid';
    let bestDist = Infinity;
    for (const s of ['collapsed', 'mid', 'expanded']) {
      const d = Math.abs(stateTops[s] - endTopPct);
      if (d < bestDist) { bestDist = d; nearest = s; }
    }
    setSheetState(nearest);
  };

  const computedTop = (() => {
    const base = stateTops[sheetState] * 874;
    if (dragOffset !== null) {
      return Math.max(180, Math.min(770, base + dragOffset));
    }
    return base;
  })();

  return (
    <div className="app" data-screen-label="01 집구경 (지도+모달)" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* ===== Real map (Leaflet + OpenStreetMap tiles) ===== */}
      <window.LeafletMap
        apartments={D.apartments}
        getLatestCase={D.latestCaseFor}
        onSelect={(id) => setSelectedAptId(id)}
        selectedId={selectedAptId}
      />

      {/* ===== Floating search pill (over map) ===== */}
      <div style={{
        position: 'absolute',
        top: 54,
        left: 14, right: 14,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          flex: 1,
          height: 50,
          background: '#fff',
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          padding: '0 6px 0 18px',
          gap: 10,
          boxShadow: '0 4px 16px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <Icon name="search" size={20} stroke={2}/>
          <span style={{
            flex: 1, fontSize: 15, color: '#9D9D9D', fontWeight: 500,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            아파트 단지, 동네 검색
          </span>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #B6E3FF, #5BB5F5)',
              border: '1.5px solid #fff',
              overflow: 'hidden',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 13, fontWeight: 700,
            }}>나</div>
            <div style={{
              position: 'absolute',
              right: -2, bottom: -2,
              width: 16, height: 16, borderRadius: '50%',
              background: '#F1554C',
              border: '2px solid #fff',
            }}/>
          </div>
        </div>
      </div>

      {/* Filter chips — top overlay above map */}
      <div style={{
        position: 'absolute', top: 116, left: 0, right: 0,
        display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none',
        padding: '0 14px',
        zIndex: 8, opacity: sheetState === 'expanded' ? 0 : 1,
        transition: 'opacity 200ms',
        pointerEvents: sheetState === 'expanded' ? 'none' : 'auto',
      }}>
        <button className="chip-overlay primary">
          <Icon name="filter" size={14}/>
          필터
        </button>
        <button className="chip-overlay">집들이</button>
        <button className="chip-overlay">공간 <Icon name="chevDownThin" size={12}/></button>
        <button className="chip-overlay">평수 <Icon name="chevDownThin" size={12}/></button>
        <button className="chip-overlay">주거형태 <Icon name="chevDownThin" size={12}/></button>
        <button className="chip-overlay">도면 있음</button>
      </div>

      {/* My location button — anchored just above modal's top edge */}
      <button
        style={{
        position: 'absolute',
        top: computedTop - 52,
        left: 14,
        width: 40, height: 40, background: '#fff', borderRadius: '50%',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        zIndex: 25,
        opacity: sheetState === 'expanded' && dragOffset === null ? 0 : 1,
        transition: dragOffset !== null
          ? 'none'
          : 'top 320ms cubic-bezier(0.32, 0.72, 0, 1), opacity 200ms',
        pointerEvents: sheetState === 'expanded' ? 'none' : 'auto',
      }}>
        <Icon name="target" size={20}/>
      </button>

      {/* ===== Bottom sheet (the modal) ===== */}
      <div style={{
        position: 'absolute',
        top: computedTop,
        left: 0, right: 0, bottom: 76,
        background: '#fff',
        borderRadius: sheetState === 'expanded' && dragOffset === null ? 0 : '20px 20px 0 0',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
        zIndex: 20,
        transition: dragOffset !== null ? 'none' : 'top 320ms cubic-bezier(0.32, 0.72, 0, 1), border-radius 320ms',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        touchAction: 'none',
      }}>
        {/* Drag handle */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            padding: '10px 0 8px',
            cursor: 'grab',
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          <div style={{
            width: 40, height: 4, borderRadius: 4,
            background: '#D9D9D9',
          }}/>
        </div>

        {/* If apartment selected: show selected-apt hero */}
        {selectedAptId && (
          <SelectedAptHero
            aptId={selectedAptId}
            onClear={() => setSelectedAptId(null)}
            nav={nav}
          />
        )}

        {/* sub-tabs */}
        {!selectedAptId && (
          <div className="subtabs" style={{ borderBottom: '1px solid var(--border)' }}>
            {['추천', '커뮤니티', '쇼츠'].map((t) => (
              <button key={t} className={subTab === t ? 'active' : ''} onClick={() => setSubTab(t)}>{t}</button>
            ))}
            <span className="grow"/>
            <button className="map-pill" onClick={() => setSheetState('collapsed')}>
              <Icon name="map" size={14} stroke={2.2}/>
              지도 크게 보기
            </button>
          </div>
        )}

        {/* sheet body — feed sections */}
        <div className="scroll" style={{ flex: 1 }}>
          {selectedAptId ? (
            <SelectedAptBody aptId={selectedAptId} nav={nav}/>
          ) : (
            <>
              {D.feedSections.map((sec) => (
                <FeedSection key={sec.id} section={sec} nav={nav}/>
              ))}
              <ApartmentTopList nav={nav}/>
              <div className="spacer"/>
            </>
          )}
        </div>
      </div>

      {/* ===== Write buttons — context-aware ===== */}
      {(() => {
        const apt = selectedAptId ? D.findApt(selectedAptId) : null;
        // Modal is "near top" when it covers > ~70% of vertical space
        const isModalLarge = computedTop < 250;

        // Only show big bottom button when (1) apt is selected AND (2) modal is expanded
        if (apt && isModalLarge) {
          return (
            <button
              onClick={() => nav.push('compose', { aptId: apt.id })}
              style={{
                position: 'absolute',
                left: 14, right: 14,
                bottom: 88,
                background: '#1A86FF',
                color: '#fff',
                padding: '15px 20px',
                borderRadius: 999,
                fontSize: 16, fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 8px 24px rgba(26,134,255,0.36), 0 1px 3px rgba(0,0,0,0.08)',
                zIndex: 26,
                letterSpacing: '-0.01em',
                border: 0,
                minWidth: 0,
              }}
            >
              <Icon name="plus" size={20} stroke={2.6}/>
              <span style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 'calc(100% - 32px)',
                display: 'inline-block',
              }}>
                {apt.name}에 글쓰기
              </span>
            </button>
          );
        }

        // Otherwise: compact FAB tracking the modal edge (hides when fully expanded)
        if (isModalLarge) return null;
        return (
          <button
            onClick={() => nav.push('compose', selectedAptId ? { aptId: selectedAptId } : {})}
            style={{
              position: 'absolute',
              top: computedTop - 60,
              right: 14,
              background: '#1A86FF',
              color: '#fff',
              padding: '12px 18px 12px 14px',
              borderRadius: 999,
              fontSize: 15, fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 14px rgba(26,134,255,0.32), 0 1px 3px rgba(0,0,0,0.08)',
              transition: dragOffset !== null
                ? 'none'
                : 'top 320ms cubic-bezier(0.32, 0.72, 0, 1)',
              zIndex: 25,
              letterSpacing: '-0.01em',
            }}
          >
            <Icon name="plus" size={18} stroke={2.6}/>
            글쓰기
          </button>
        );
      })()}

      <BottomNav active="집구경"/>

      <style>{`
        .map-chip {
          background: #fff; border-radius: 999px;
          padding: 8px 12px; font-size: 12px; font-weight: 600;
          color: #141414;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          display: inline-flex; align-items: center; gap: 4px;
          white-space: nowrap; flex-shrink: 0;
        }
        .map-chip.dark { background: #141414; color: #fff; }
        .map-chip.active { background: #1A86FF; color: #fff; }
      `}</style>
    </div>
  );
};

// ===== When a marker is tapped, show this hero in the sheet =====
const SelectedAptHero = ({ aptId, onClear, nav }) => {
  const D = window.APP_DATA;
  const apt = D.findApt(aptId);
  return (
    <div style={{
      padding: '4px 16px 14px',
      borderBottom: '1px solid var(--border)',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingRight: 36 }}
        onClick={() => nav.push('complex', { aptId: apt.id })}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em' }}>{apt.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>
            {apt.area} · {apt.year}년 · {apt.households.toLocaleString()}세대 · {apt.sizes.join(' / ')}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 13, fontWeight: 700 }}>
            <span style={{ color: '#1A86FF' }}>사례 {apt.cases}</span>
            <span style={{ color: '#BCBCBC' }}>·</span>
            <span style={{ color: '#1A86FF' }}>도면 {apt.plans}</span>
          </div>
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onClear(); }} style={{
        position: 'absolute', top: 8, right: 12,
        width: 32, height: 32, borderRadius: '50%',
        background: 'var(--bg-soft)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="close" size={16} stroke={2.2}/>
      </button>
    </div>
  );
};

const SelectedAptBody = ({ aptId, nav }) => {
  const D = window.APP_DATA;
  const apt = D.findApt(aptId);
  const allCases = D.byApt(aptId);
  // pad with cases from other apts if too few, so user always sees a populated feed
  const cases = allCases.length >= 6
    ? allCases
    : [...allCases, ...D.cases.filter((c) => c.apt !== aptId).slice(0, 8)];

  const userCount = cases.filter((c) => c.author === 'user').length;
  const proCount = cases.filter((c) => c.author === 'contractor').length;
  const planCount = cases.filter((c) => c.hasPlan).length;
  const [filter, setFilter] = React.useState('all');

  const visible = cases.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'plan') return c.hasPlan;
    return c.author === filter;
  });

  return (
    <div>
      {/* Author filter tabs */}
      <div style={{
        display: 'flex', gap: 6, padding: '10px 16px 8px',
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        <button onClick={() => setFilter('all')}
          style={authorChipStyle(filter === 'all')}>
          전체 {cases.length}
        </button>
        <button onClick={() => setFilter('user')}
          style={authorChipStyle(filter === 'user', '#1A86FF')}>
          <span style={{
            width: 6, height: 6, borderRadius: 999,
            background: filter === 'user' ? '#fff' : '#1A86FF',
            display: 'inline-block', marginRight: 4,
          }}/>
          유저 집들이 {userCount}
        </button>
        <button onClick={() => setFilter('contractor')}
          style={authorChipStyle(filter === 'contractor', '#FF7900')}>
          <span style={{
            width: 6, height: 6, borderRadius: 999,
            background: filter === 'contractor' ? '#fff' : '#FF7900',
            display: 'inline-block', marginRight: 4,
          }}/>
          시공업체 {proCount}
        </button>
        <button onClick={() => setFilter('plan')}
          style={authorChipStyle(filter === 'plan', '#1A86FF')}>
          <Icon name="plan" size={11} stroke={2.4}/>
          <span style={{ marginLeft: 2 }}>도면 {planCount}</span>
        </button>
      </div>

      {/* sort row */}
      <div style={{
        padding: '4px 16px 8px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>
          {apt.name}에서 발행된 콘텐츠
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          최신순 <Icon name="chevronDown" size={12} stroke={2.2}/>
        </span>
      </div>

      {/* Mixed feed: user posts + contractor posts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px 16px' }}>
        {visible.map((c) => <CaseCardWithAuthor key={c.id} c={c} nav={nav}/>)}
      </div>
      <div className="spacer"/>
    </div>
  );
};

const authorChipStyle = (active, color = '#141414') => ({
  fontSize: 12, fontWeight: 700,
  padding: '7px 12px',
  borderRadius: 999,
  border: active ? 'none' : '1px solid var(--border-strong)',
  background: active ? color : '#fff',
  color: active ? '#fff' : 'var(--text-secondary)',
  display: 'inline-flex', alignItems: 'center', gap: 2,
  whiteSpace: 'nowrap',
});

// Card with profile-based author distinction — profile at the bottom (below meta)
const CaseCardWithAuthor = ({ c, nav }) => {
  const isPro = c.author === 'contractor';
  // Deterministic avatar from user string
  const seed = c.user.split('').reduce((s, ch) => s + ch.charCodeAt(0), 0);
  const avatarUrl = `https://i.pravatar.cc/64?img=${(seed % 70) + 1}`;

  return (
    <div className="case-card" onClick={() => nav.push('cdp', { caseId: c.id })}>
      <div className="thumb">
        <img src={c.photo} alt="" loading="lazy"/>

        {/* Size — top-right */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: 'rgba(0,0,0,0.5)', color: '#fff',
          fontSize: 10, fontWeight: 700,
          padding: '2px 6px', borderRadius: 3,
        }}>{c.size.replace('py', '평')}</div>

        {/* Plan badge — bottom-right */}
        {c.hasPlan && (
          <div style={{
            position: 'absolute', bottom: 8, right: 8,
            background: '#fff', color: '#1A86FF',
            fontSize: 10, fontWeight: 800,
            padding: '3px 7px', borderRadius: 4,
            display: 'inline-flex', alignItems: 'center', gap: 3,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}>
            <Icon name="plan" size={9} stroke={2.6}/>
            도면
          </div>
        )}
      </div>
      <div className="title">{c.title}</div>
      <div className="meta">
        <Icon name="heart" size={12} stroke={2}/>
        {c.likes.toLocaleString()}
        {c.daysAgo && (<>
          <span style={{ color: 'var(--text-quaternary)', margin: '0 4px' }}>·</span>
          <span style={{ color: 'var(--text-tertiary)' }}>{c.daysAgo}일 전</span>
        </>)}
      </div>

      {/* Profile row — at the bottom of the card */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        marginTop: 6,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          overflow: 'hidden', flexShrink: 0,
          background: '#eee',
        }}>
          <img src={avatarUrl} alt="" style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          }}/>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          minWidth: 0,
        }}>{c.user}</span>
        {isPro && (
          <span style={{
            background: '#FF7900', color: '#fff',
            fontSize: 9, fontWeight: 800,
            padding: '2px 5px', borderRadius: 3,
            letterSpacing: '0.04em', flexShrink: 0,
          }}>PRO</span>
        )}
      </div>
    </div>
  );
};

const CaseCardCompact = ({ c, nav }) => (
  <div className="case-card" onClick={() => nav.push('cdp', { caseId: c.id })}>
    <div className="thumb">
      <img src={c.photo} alt="" loading="lazy"/>
      <div style={{
        position: 'absolute', top: 8, left: 8,
        background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11,
        fontWeight: 700, padding: '3px 7px', borderRadius: 4,
      }}>{c.size.replace('py', '평')}</div>
      {c.hasPlan && (
        <div style={{
          position: 'absolute', bottom: 8, right: 8,
          background: '#1A86FF', color: '#fff', fontSize: 11,
          fontWeight: 700, padding: '3px 7px', borderRadius: 4,
          display: 'inline-flex', alignItems: 'center', gap: 3,
        }}>
          <Icon name="plan" size={9} stroke={2.6}/>
          도면
        </div>
      )}
    </div>
    <div className="title">{c.title}</div>
    <div className="meta">
      <Icon name="heart" size={12} stroke={2}/>
      {c.likes.toLocaleString()}
    </div>
  </div>
);

const floatBtnStyle = {
  width: 44, height: 44, borderRadius: '50%',
  background: '#fff',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)',
  color: '#181818',
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

const FeedSection = ({ section, nav }) => {
  const D = window.APP_DATA;
  const items = section.cases.map(D.findCase).filter(Boolean);
  return (
    <div className="feed-section">
      <div className="section-head">
        <h2>{section.title}</h2>
        <div className="more"><Icon name="chevron" size={14} stroke={2.4}/></div>
      </div>
      <div className="hscroll">
        {items.map((c) => (
          <CaseCard key={c.id} c={c} nav={nav}/>
        ))}
      </div>
    </div>
  );
};

const CaseCard = ({ c, nav }) => {
  return (
    <div className="case-card" onClick={() => nav.push('cdp', { caseId: c.id })}>
      <div className="thumb">
        <img src={c.photo} alt="" loading="lazy"/>
        <div style={{
          position: 'absolute',
          left: 8, bottom: 8,
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(6px)',
          color: '#fff',
          padding: '3px 9px 3px 3px',
          borderRadius: 999,
          fontSize: 11, fontWeight: 600,
          maxWidth: 'calc(100% - 50px)',
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            background: '#ddd', flexShrink: 0,
          }}/>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {c.user}
          </span>
        </div>
        <button className="bookmark" onClick={(e) => e.stopPropagation()} style={{
          position: 'absolute', bottom: 4, right: 4,
        }}>
          <Icon name="bookmark" size={22} stroke={1.6}/>
        </button>
      </div>
      <div className="title">{c.title}</div>
      <div className="meta">
        <Icon name="heart" size={12} stroke={2}/>
        {c.likes.toLocaleString()}
      </div>
    </div>
  );
};

const ApartmentTopList = ({ nav }) => {
  const D = window.APP_DATA;
  const top = [...D.apartments].sort((a, b) => b.cases - a.cases).slice(0, 4);
  return (
    <div className="feed-section">
      <div className="section-head">
        <h2>사례가 많은 아파트 단지</h2>
        <div className="more"><Icon name="chevron" size={14} stroke={2.4}/></div>
      </div>
      <div>
        {top.map((a) => (
          <div className="apt-card" key={a.id} onClick={() => nav.push('complex', { aptId: a.id })}>
            <div className={`apt-thumb ${a.hue}`}>
              <AptThumb apt={a}/>
            </div>
            <div className="apt-info">
              <div className="apt-name">{a.name}</div>
              <div className="apt-meta">{a.area} · {a.year}년 · {a.households.toLocaleString()}세대</div>
              <div className="apt-stats">
                <span className="s-case">사례 {a.cases}</span>
                <span className="sep">·</span>
                <span className="s-plan">도면 {a.plans}</span>
              </div>
            </div>
            <Icon name="chevron" size={16}/>
          </div>
        ))}
      </div>
    </div>
  );
};

const AptThumb = ({ apt }) => {
  return (
    <svg viewBox="0 0 56 56" width="100%" height="100%">
      <g opacity="0.35">
        <rect x="12" y="20" width="10" height="30" fill="#fff" rx="1"/>
        <rect x="24" y="14" width="10" height="36" fill="#fff" rx="1"/>
        <rect x="36" y="24" width="10" height="26" fill="#fff" rx="1"/>
        <g fill="rgba(0,0,0,0.18)">
          <rect x="14" y="23" width="2" height="2"/><rect x="18" y="23" width="2" height="2"/>
          <rect x="14" y="28" width="2" height="2"/><rect x="18" y="28" width="2" height="2"/>
          <rect x="14" y="33" width="2" height="2"/><rect x="18" y="33" width="2" height="2"/>
          <rect x="26" y="17" width="2" height="2"/><rect x="30" y="17" width="2" height="2"/>
          <rect x="26" y="22" width="2" height="2"/><rect x="30" y="22" width="2" height="2"/>
          <rect x="26" y="27" width="2" height="2"/><rect x="30" y="27" width="2" height="2"/>
          <rect x="26" y="32" width="2" height="2"/><rect x="30" y="32" width="2" height="2"/>
          <rect x="38" y="27" width="2" height="2"/><rect x="42" y="27" width="2" height="2"/>
          <rect x="38" y="32" width="2" height="2"/><rect x="42" y="32" width="2" height="2"/>
        </g>
      </g>
      <text x="28" y="44" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" letterSpacing="-0.04em">{apt.initial}</text>
    </svg>
  );
};

window.FeedScreen = FeedScreen;
window.AptThumb = AptThumb;
window.CaseCard = CaseCard;
window.CaseCardCompact = CaseCardCompact;
