// ===== 콘텐츠 상세 (CDP) =====
const CdpScreen = ({ nav, params }) => {
  const D = window.APP_DATA;
  const c = D.findCase(params.caseId);
  const apt = D.findApt(c.apt);

  // Other cases from the same apartment
  const sameAptCases = D.byApt(c.apt).filter((x) => x.id !== c.id);
  const sameSizeCount = sameAptCases.filter((x) => x.size === c.size).length;

  return (
    <div className="app" data-screen-label="04 콘텐츠 상세 CDP">
      <div className="topbar" style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        background: 'transparent', zIndex: 30,
        paddingTop: 54,
        height: 'auto',
      }}>
        <button className="iconbtn" onClick={() => nav.pop()} style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', color: '#fff' }}>
          <Icon name="back" size={20}/>
        </button>
        <div className="title left"></div>
        <button className="iconbtn" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', color: '#fff' }}>
          <Icon name="share" size={18}/>
        </button>
        <button className="iconbtn" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', color: '#fff' }}>
          <Icon name="menu" size={20}/>
        </button>
      </div>

      <div className="scroll" style={{ paddingTop: 0 }}>
        {/* hero */}
        <div className="cdp-hero">
          <img src={c.photo} alt=""/>
          <div className="pager">1 / 12</div>
        </div>

        {/* meta */}
        <div className="cdp-meta">
          <h1>{c.title}</h1>

          {/* Tags row */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={chipMini}>{c.size.replace('py', '평')}</span>
            <span style={chipMini}>아파트</span>
            <span style={{...chipMini, background: '#E3F0FF', color: '#1A86FF', fontWeight: 700}}>{apt.name}</span>
            {c.hasPlan && (
              <span style={{...chipMini, background: '#E3F0FF', color: '#1A86FF', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3}}>
                <Icon name="plan" size={10} stroke={2.6}/>
                도면 있음
              </span>
            )}
          </div>

          <div className="cdp-user">
            <div className="avatar"/>
            <div>
              <div className="name">{c.user}</div>
              <div className="sub">팔로워 1.2k · 집들이 8</div>
            </div>
            <button className="follow">팔로우</button>
          </div>
        </div>

        {/* body */}
        <div className="cdp-body">
          <p style={{ whiteSpace: 'pre-line', fontSize: 15, lineHeight: 1.7 }}>
            {`처음 ${apt.name}로 이사 오면서 가장 신경 쓴 건 거실 채광이었어요. 남향 거실이라 햇살이 정말 잘 들어와서, 자연 톤의 우드 가구로 따뜻한 분위기를 살리는 데 집중했습니다.

가구는 너무 빽빽하지 않게 배치하고, 라이팅으로 공간감을 만들었어요. 평형은 ${c.size.replace('py', '평')}이지만 군더더기 없이 넓어 보이도록 가구 높이와 배치를 신경 썼습니다.`}
          </p>

          {/* Inline photo */}
          {sameAptCases[0] && (
            <div style={{ borderRadius: 12, overflow: 'hidden', margin: '12px 0' }}>
              <img src={sameAptCases[0].photo} style={{ width: '100%', display: 'block' }}/>
            </div>
          )}

          <p style={{ fontSize: 15, lineHeight: 1.7 }}>
            바닥재는 헤링본 패턴 원목으로 선택했고, 벽지는 따뜻한 베이지 톤으로 마무리했어요. 도면 그대로 살린 부분도 있고, 일부 벽체를 허물어 LDK 통합으로 만들었습니다.
          </p>
        </div>

        {/* Reactions */}
        <div style={{ display: 'flex', borderTop: '1px solid var(--bg-soft)', background: '#fff', padding: '12px 18px', alignItems: 'center', gap: 16 }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Icon name="heart" size={20} stroke={1.8}/>
            {c.likes.toLocaleString()}
          </button>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Icon name="chat" size={20} stroke={1.8}/>
            68
          </button>
          <span style={{ flex: 1 }}/>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Icon name="bookmark" size={20} stroke={1.8}/>
          </button>
        </div>

        <div className="row-divider"/>

        {/* ===== 시공도면 + 3D 방꾸미기 진입 ===== */}
        <PlanSection apt={apt} c={c} nav={nav}/>

        <div className="row-divider"/>

        {/* ===== Merged: 같은 단지 사례 (정보 + 콘텐츠) ===== */}
        <div style={{ background: '#fff', padding: '20px 18px 10px' }}>
          <div
            onClick={() => nav.reset('feed', { openApt: apt.id })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 10,
              overflow: 'hidden', flexShrink: 0,
              background: '#eee',
              position: 'relative',
            }}>
              <img
                src={sameAptCases[0]?.photo || c.photo}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.25))',
              }}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>
                {apt.name} 사례 더보기
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                시공 사례 <b style={{ color: '#1A86FF', fontWeight: 700 }}>{apt.cases}건</b>
                {' · '}도면 <b style={{ color: '#1A86FF', fontWeight: 700 }}>{apt.plans}개</b>
                {sameSizeCount > 0 && <> {' · '}같은 평형 <b style={{ color: '#1A86FF', fontWeight: 700 }}>{sameSizeCount + 1}건</b></>}
              </div>
            </div>
            <Icon name="chevron" size={18}/>
          </div>
        </div>
        <div className="hscroll" style={{ paddingBottom: 16, background: '#fff' }}>
          {sameAptCases.slice(0, 6).map((cc) => (
            <CaseCard key={cc.id} c={cc} nav={nav}/>
          ))}
        </div>

        <div className="spacer"/>
      </div>
    </div>
  );
};

const chipMini = {
  display: 'inline-block',
  fontSize: 11,
  fontWeight: 600,
  background: 'var(--bg-soft)',
  color: 'var(--text-secondary)',
  padding: '4px 8px',
  borderRadius: 4,
};

window.CdpScreen = CdpScreen;

// ===== 시공도면 섹션 (CDP 내부) =====
const PlanSection = ({ apt, c, nav }) => {
  return (
    <div style={{ background: '#fff', padding: '22px 18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em' }}>
          시공 도면
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700,
          background: '#E3F0FF', color: '#1A86FF',
          padding: '3px 7px', borderRadius: 4,
        }}>{c.size.replace('py', 'A')}</span>
      </div>

      {/* Floorplan card + 3D CTA 일체화 */}
      <div style={{
        borderRadius: 12,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        background: '#fff',
      }}>
        {/* Plan diagram */}
        <div style={{
          position: 'relative',
          aspectRatio: '1.3',
          background: '#FAFAFA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <SchematicFloorPlanLarge size={c.size}/>
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'rgba(0,0,0,0.55)', color: '#fff',
            fontSize: 11, fontWeight: 700,
            padding: '4px 9px', borderRadius: 999,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <Icon name="plan" size={11} stroke={2.4}/>
            평면도
          </div>
        </div>

        {/* Specs row */}
        <div style={{
          display: 'flex',
          padding: '14px 16px',
          borderTop: '1px solid var(--border)',
          gap: 16,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>전용면적</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>
              {Math.round(parseInt(c.size) * 3.3)}m² <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>· {c.size.replace('py', '평')}</span>
            </div>
          </div>
          <div style={{ width: 1, background: 'var(--border)' }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>구조</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>방 3 · 화 2</div>
          </div>
          <div style={{ width: 1, background: 'var(--border)' }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>방향</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>남향</div>
          </div>
        </div>

        {/* 3D 꾸미기 inline footer — 같은 카드 안 */}
        <button
          onClick={() => nav.push('room3d', { aptId: apt.id, size: c.size })}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '14px 16px',
            background: '#141414',
            color: '#fff',
            border: 0,
            fontSize: 14, fontWeight: 800,
            letterSpacing: '-0.01em',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Icon name="sparkle" size={16} stroke={2.4}/>
            이 도면으로 3D 방 꾸며보기
          </span>
          <Icon name="chevron" size={16} stroke={2.4}/>
        </button>
      </div>

      {/* 견적 상담 CTA — 검정 배너 (오늘의집 패턴) */}
      <div style={{
        marginTop: 14,
        background: '#141414',
        borderRadius: 12,
        padding: '18px 16px 16px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: '#fff',
          letterSpacing: '-0.02em',
          marginBottom: 4,
        }}>
          이 인테리어가 마음에 든다면?
        </div>
        <div style={{
          fontSize: 12, color: 'rgba(255,255,255,0.6)',
          marginBottom: 12,
          fontWeight: 500,
        }}>
          유사 평형 시공업체로부터 견적을 받아보세요
        </div>
        <button
          onClick={() => alert('견적 상담 흐름은 별도 화면이에요 (프로토타입)')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            padding: '14px 18px',
            background: '#fff',
            color: '#141414',
            borderRadius: 999,
            fontSize: 15, fontWeight: 800,
            letterSpacing: '-0.01em',
            border: 0,
          }}
        >
          <Icon name="chat" size={16} stroke={2.2}/>
          이 인테리어로 견적 상담받기
        </button>
      </div>
    </div>
  );
};

// Larger schematic floor plan diagram, color-tinted by size
const SchematicFloorPlanLarge = ({ size }) => (
  <svg viewBox="0 0 360 240" width="92%" height="92%" style={{ display: 'block' }}>
    {/* outer walls */}
    <g stroke="#181818" strokeWidth="2.5" fill="none">
      <path d="M40 30 L 320 30 L 320 100 L 340 100 L 340 220 L 60 220 L 60 180 L 40 180 Z"/>
    </g>

    {/* rooms — flat top-down with subtle fills */}
    <rect x="60" y="40" width="80" height="60" fill="#F0E6D2" stroke="#181818" strokeWidth="1"/>
    <text x="100" y="74" textAnchor="middle" fontSize="11" fontWeight="700" fill="#5a4530">침실</text>

    <rect x="140" y="40" width="40" height="50" fill="#D5EAF1" stroke="#181818" strokeWidth="1"/>
    <rect x="180" y="40" width="50" height="55" fill="#F4EFE5" stroke="#181818" strokeWidth="1"/>
    <rect x="230" y="40" width="40" height="40" fill="#D5EAF1" stroke="#181818" strokeWidth="1"/>

    <rect x="270" y="40" width="50" height="70" fill="#F0E6D2" stroke="#181818" strokeWidth="1"/>
    <text x="295" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fill="#5a4530">침실</text>

    <rect x="140" y="90" width="180" height="90" fill="#E5CFA4" stroke="#181818" strokeWidth="1"/>
    <text x="230" y="140" textAnchor="middle" fontSize="16" fontWeight="800" fill="#5a4530">거실</text>

    <rect x="40" y="90" width="20" height="90" fill="#fff" stroke="#181818" strokeWidth="1"/>
    <rect x="60" y="100" width="80" height="80" fill="#F0E6D2" stroke="#181818" strokeWidth="1"/>

    <rect x="220" y="180" width="100" height="40" fill="#F4EFE5" stroke="#181818" strokeWidth="1"/>
    <text x="270" y="206" textAnchor="middle" fontSize="11" fontWeight="700" fill="#5a4530">주방</text>

    <rect x="320" y="110" width="20" height="70" fill="#fff" stroke="#181818" strokeWidth="1"/>

    <rect x="140" y="180" width="80" height="40" fill="#F0E6D2" stroke="#181818" strokeWidth="1"/>
    <text x="180" y="206" textAnchor="middle" fontSize="11" fontWeight="700" fill="#5a4530">침실</text>

    {/* Dimensions */}
    <g fontSize="9" fill="#999" fontWeight="500">
      <text x="180" y="14" textAnchor="middle">12,330</text>
      <text x="350" y="148" textAnchor="middle">3,000</text>
    </g>
  </svg>
);
