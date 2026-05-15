// ===== 단지 상세 (부동산 정보 중심으로 재설계) =====
const ComplexScreen = ({ nav, params }) => {
  const D = window.APP_DATA;
  const apt = D.findApt(params.aptId);
  const re = D.getRealEstate(apt.id);
  const contractors = D.contractorsByApt(apt.id);
  const allCases = D.byApt(apt.id);

  // Highlight a user-posted case (when arriving from publish flow)
  const myCaseId = params.myCaseId;
  const myCase = myCaseId === 'my-new-post' ? {
    id: 'my-new-post',
    title: sessionStorage.getItem('compose-body-final') || '우리 집 소개합니다 :)',
    photo: 'assets/thumbnails/15.jpg',
    size: apt.sizes[0],
    likes: 0,
    author: 'user',
    hasPlan: false,
  } : null;

  const [sizeIdx, setSizeIdx] = React.useState(0);
  const size = apt.sizes[sizeIdx];

  return (
    <div className="app" data-screen-label="03 단지 상세" style={{ background: 'var(--bg-soft)' }}>
      <div className="topbar" style={{ background: '#fff', paddingTop: 54, height: 'auto' }}>
        <button className="iconbtn" onClick={() => nav.pop()}>
          <Icon name="back" size={22}/>
        </button>
        <div className="title left"></div>
        <button className="iconbtn"><Icon name="search" size={20}/></button>
        <button className="iconbtn"><Icon name="share" size={20}/></button>
      </div>

      <div className="scroll">
        {/* ===== Hero ===== */}
        <div style={{ background: '#fff', padding: '8px 18px 18px' }}>
          <div className="badge">아파트</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '8px 0 4px', letterSpacing: '-0.025em' }}>
            {apt.name}
          </h1>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            {apt.area} · {apt.year}년 입주 · {apt.households.toLocaleString()}세대
          </div>
        </div>

        {/* ===== 단지 정보 ===== */}
        <ComplexInfoCard apt={apt} re={re}/>

        {/* ===== 시공 업체 목록 ===== */}
        {contractors.length > 0 && (
          <ContractorsCard contractors={contractors} nav={nav} apt={apt}/>
        )}

        {/* ===== 사례 + 도면 (집안구경) ===== */}
        <div style={{ background: '#fff', marginTop: 8, padding: '20px 18px 4px' }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>
            집안구경 <span style={{ fontSize: 14, color: 'var(--text-tertiary)', fontWeight: 500 }}>· {apt.cases}건</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
            평형별 시공 사례와 도면을 한눈에
          </div>
        </div>

        {/* size tabs */}
        <div className="size-tabs" style={{ background: '#fff' }}>
          {apt.sizes.map((sz, i) => (
            <button key={sz} className={i === sizeIdx ? 'active' : ''} onClick={() => setSizeIdx(i)}>
              {sz.replace('py', '평')}
            </button>
          ))}
          <span style={{ flex: 1 }}/>
        </div>

        {/* Plan card */}
        <div style={{ background: '#fff', paddingBottom: 16 }}>
          <PlanCard apt={apt} size={size}/>
        </div>

        {/* ===== 시세 카드 (맨 아래) ===== */}
        <PriceCard re={re} apt={apt}/>

        {/* ===== 실거래가 (맨 아래) ===== */}
        {re.transactions.length > 0 && <TransactionsCard re={re}/>}

        <div className="spacer"/>
      </div>
    </div>
  );
};

// ===== 시세 카드 =====
const PriceCard = ({ re, apt }) => (
  <div style={{ background: '#fff', marginTop: 8, padding: '18px 18px 16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em' }}>시세 정보</div>
      <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>2026.05 기준</span>
    </div>

    {/* Price summary */}
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
      borderRadius: 12,
      border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      <PriceCell label="매매" value={re.avgPrice.sale} accent="#1A86FF"/>
      <PriceCell label="전세" value={re.avgPrice.jeonse} border/>
      <PriceCell label="월세" value={re.avgPrice.wolse}/>
    </div>

    {/* Change indicator */}
    <div style={{
      marginTop: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 14px',
      background: re.priceChange.positive ? '#FFF1E5' : '#E5F1FF',
      borderRadius: 10,
    }}>
      <div style={{
        fontSize: 12, fontWeight: 700,
        color: re.priceChange.positive ? '#FF5A1F' : '#1A86FF',
        display: 'inline-flex', alignItems: 'center', gap: 4,
      }}>
        {re.priceChange.positive ? '▲' : '▼'} {re.priceChange.value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
        지난 {re.priceChange.period} 매매가 변동
      </div>
    </div>

    {/* Per-pyeong */}
    <div style={{
      marginTop: 12,
      fontSize: 12,
      color: 'var(--text-tertiary)',
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: 12,
      borderTop: '1px solid var(--bg-soft)',
    }}>
      <span>평당가</span>
      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
        {re.pricePerPyeong.toLocaleString()}만원/평
      </span>
    </div>
  </div>
);

const PriceCell = ({ label, value, accent, border }) => (
  <div style={{
    padding: '12px 10px 14px',
    borderLeft: border ? '1px solid var(--border)' : 0,
    borderRight: border ? '1px solid var(--border)' : 0,
    textAlign: 'center',
  }}>
    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: 4 }}>{label}</div>
    <div style={{
      fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em',
      color: accent || 'var(--text-primary)',
    }}>{value}</div>
  </div>
);

// ===== 실거래가 =====
const TransactionsCard = ({ re }) => (
  <div style={{ background: '#fff', marginTop: 8, padding: '18px 18px 8px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em' }}>실거래가</div>
      <button style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
        전체보기 <Icon name="chevron" size={12} stroke={2.2}/>
      </button>
    </div>

    <div>
      {re.transactions.map((t, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 0',
          gap: 12,
          borderBottom: i < re.transactions.length - 1 ? '1px solid var(--bg-soft)' : 0,
        }}>
          {/* Type badge */}
          <div style={{
            background: t.type === '매매' ? '#E3F0FF' : t.type === '전세' ? '#FFF1E5' : '#F4F4F4',
            color: t.type === '매매' ? '#1A86FF' : t.type === '전세' ? '#FF7900' : '#666',
            fontSize: 11, fontWeight: 800,
            padding: '4px 8px', borderRadius: 4,
            flexShrink: 0,
          }}>{t.type}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              {t.price}<span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, marginLeft: 3 }}>만원</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
              {t.size} · {t.floor}
            </div>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', flexShrink: 0 }}>
            {t.date}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ===== 단지 정보 =====
const ComplexInfoCard = ({ apt, re }) => (
  <div style={{ background: '#fff', marginTop: 8, padding: '18px 18px 18px' }}>
    <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 14 }}>
      단지 정보
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 14, columnGap: 18 }}>
      <InfoItem label="세대수" value={`${apt.households.toLocaleString()}세대`}/>
      <InfoItem label="동수" value={`${re.info.buildingCount}동`}/>
      <InfoItem label="입주" value={`${apt.year}년`}/>
      <InfoItem label="층수" value={re.info.floors}/>
      <InfoItem label="주차" value={re.info.parking}/>
      <InfoItem label="난방" value={re.info.heating}/>
      <InfoItem label="평형" value={apt.sizes.map((s) => s.replace('py', '평')).join(' / ')} wide/>
    </div>
  </div>
);

const InfoItem = ({ label, value, wide }) => (
  <div style={{ gridColumn: wide ? '1 / -1' : 'auto' }}>
    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2, color: 'var(--text-primary)' }}>{value}</div>
  </div>
);

// ===== 시공 업체 목록 =====
const ContractorsCard = ({ contractors, nav, apt }) => {
  const hasOwnContractors = contractors[0]?.viaThisApt;
  return (
  <div style={{ background: '#fff', marginTop: 8, padding: '18px 0 8px' }}>
    <div style={{
      padding: '0 18px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 6,
    }}>
      <div>
        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em' }}>
          {apt.name}를 시공한 인테리어 업체
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
          {hasOwnContractors
            ? `${contractors.length}개 업체 · 시공 사례 ${contractors.reduce((s, c) => s + c.cases.length, 0)}건`
            : `${apt.area} 지역 인기 업체`
          }
        </div>
      </div>
      <button style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
        전체 <Icon name="chevron" size={12} stroke={2.2}/>
      </button>
    </div>

    {contractors.slice(0, 4).map((co, i) => {
      const seed = co.name.split('').reduce((s, ch) => s + ch.charCodeAt(0), 0);
      const palette = [
        { bg: '#141414', fg: '#fff' },
        { bg: '#1A86FF', fg: '#fff' },
        { bg: '#FF7900', fg: '#fff' },
        { bg: '#2F8F45', fg: '#fff' },
        { bg: '#8C72E5', fg: '#fff' },
        { bg: '#E03671', fg: '#fff' },
      ];
      const swatch = palette[seed % palette.length];
      const initial = co.name.slice(0, 2);
      return (
        <div key={co.name}
          onClick={() => co.cases[0] && nav.push('cdp', { caseId: co.cases[0].id })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 18px',
            cursor: 'pointer',
          }}
        >
          {/* Brand logo placeholder — colored square with initials */}
          <div style={{
            width: 44, height: 44, borderRadius: 8,
            flexShrink: 0,
            background: swatch.bg,
            color: swatch.fg,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '-0.04em',
          }}>
            {initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {co.name}
              </span>
              <span style={{
                background: '#FF7900', color: '#fff',
                fontSize: 9, fontWeight: 800,
                padding: '2px 5px', borderRadius: 3, letterSpacing: '0.04em',
                flexShrink: 0,
              }}>PRO</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
              사례 {co.cases.length}건 · 좋아요 {co.totalLikes.toLocaleString()}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            {co.cases.slice(0, 2).map((c) => (
              <img key={c.id} src={c.photo} alt=""
                style={{
                  width: 36, height: 36, borderRadius: 6,
                  objectFit: 'cover', display: 'block',
                }}
              />
            ))}
          </div>
          <Icon name="chevron" size={16}/>
        </div>
      );
    })}

    <button style={{
      width: 'calc(100% - 36px)',
      margin: '8px 18px 8px',
      padding: '13px',
      borderRadius: 8,
      border: '1px solid var(--border-strong)',
      background: '#fff',
      fontSize: 14, fontWeight: 700,
      color: 'var(--text-primary)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    }}>
      <Icon name="chat" size={16} stroke={2}/>
      견적 상담 받기
    </button>
  </div>
  );
};

const CaseCardCompact = ({ c, nav }) => {
  return (
    <div className="case-card" onClick={() => nav.push('cdp', { caseId: c.id })}>
      <div className="thumb">
        <img src={c.photo} alt="" loading="lazy"/>
        <div style={{
          position: 'absolute', top: 8, left: 8,
          background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11,
          fontWeight: 700, padding: '3px 7px', borderRadius: 4,
          backdropFilter: 'blur(4px)',
        }}>{c.size.replace('py', '평')}</div>
        {c.hasPlan && (
          <div style={{
            position: 'absolute', bottom: 8, right: 8,
            background: 'var(--ohouse-blue)', color: '#fff', fontSize: 11,
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
};

const PlanCard = ({ apt, size }) => {
  return (
    <div className="plan-card">
      <div className="plan-head">
        <span className="pl-tag">{size.replace('py', 'A')} ({Math.round(parseInt(size) * 3.3)}m²)</span>
        <span style={{ flex: 1 }}/>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>
          <span style={{
            width: 16, height: 16, borderRadius: 3,
            border: '1.5px solid var(--border-strong)',
            display: 'inline-block',
          }}/>
          이 도면 시공사례만 보기
        </label>
      </div>
      <div className="plan-img">
        <SchematicFloorPlan/>
      </div>
    </div>
  );
};

const SchematicFloorPlan = () => (
  <svg viewBox="0 0 360 280" width="100%" height="100%" style={{ display: 'block' }}>
    <g stroke="#181818" strokeWidth="2" fill="none">
      <path d="M40 30 L 320 30 L 320 110 L 340 110 L 340 240 L 60 240 L 60 200 L 40 200 Z"/>
    </g>
    <rect x="60" y="40" width="80" height="60" fill="#F5EBD9" stroke="#181818" strokeWidth="1"/>
    <text x="100" y="74" textAnchor="middle" fontSize="11" fontWeight="700" fill="#444">침실</text>
    <rect x="140" y="40" width="40" height="50" fill="#C8E7F0" stroke="#181818" strokeWidth="1"/>
    <rect x="180" y="40" width="50" height="55" fill="#F4EFE5" stroke="#181818" strokeWidth="1"/>
    <rect x="230" y="40" width="40" height="40" fill="#C8E7F0" stroke="#181818" strokeWidth="1"/>
    <rect x="270" y="40" width="50" height="70" fill="#F5EBD9" stroke="#181818" strokeWidth="1"/>
    <text x="295" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fill="#444">침실</text>
    <rect x="140" y="100" width="180" height="80" fill="#D6BFA0" stroke="#181818" strokeWidth="1"/>
    <text x="230" y="146" textAnchor="middle" fontSize="14" fontWeight="800" fill="#5a4530">거실</text>
    <rect x="40" y="100" width="20" height="100" fill="#fff" stroke="#181818" strokeWidth="1"/>
    <rect x="60" y="100" width="80" height="100" fill="#F5EBD9" stroke="#181818" strokeWidth="1"/>
    <rect x="220" y="180" width="100" height="60" fill="#F4EFE5" stroke="#181818" strokeWidth="1"/>
    <text x="270" y="208" textAnchor="middle" fontSize="11" fontWeight="700" fill="#444">주방</text>
    <text x="270" y="220" textAnchor="middle" fontSize="11" fontWeight="700" fill="#444">식당</text>
    <rect x="320" y="110" width="20" height="70" fill="#fff" stroke="#181818" strokeWidth="1"/>
    <rect x="140" y="180" width="80" height="60" fill="#F5EBD9" stroke="#181818" strokeWidth="1"/>
    <text x="180" y="214" textAnchor="middle" fontSize="11" fontWeight="700" fill="#444">침실</text>
  </svg>
);

window.ComplexScreen = ComplexScreen;
