// ===== 단지 상세 =====
const ComplexScreen = ({ nav, params }) => {
  const D = window.APP_DATA;
  const apt = D.findApt(params.aptId);
  const [sizeIdx, setSizeIdx] = React.useState(0);
  const size = apt.sizes[sizeIdx];

  // Highlight a user-posted case (when arriving from publish flow)
  const myCaseId = params.myCaseId;
  const myCase = myCaseId === 'my-new-post' ? {
    id: 'my-new-post',
    title: sessionStorage.getItem('compose-body-final') || '우리 집 소개합니다 :)',
    photo: 'assets/thumbnails/15.jpg',
    size: apt.sizes[0],
    likes: 0,
    hasPlan: false,
  } : null;

  const allCases = D.byApt(apt.id);
  const myCases = myCase ? [myCase] : [];
  const otherCases = allCases;

  return (
    <div className="app" data-screen-label="03 단지 상세">
      <div className="topbar">
        <button className="iconbtn" onClick={() => nav.pop()}>
          <Icon name="back" size={22}/>
        </button>
        <div className="title left"></div>
        <button className="iconbtn"><Icon name="search" size={20}/></button>
        <button className="iconbtn"><Icon name="share" size={20}/></button>
      </div>

      <div className="scroll">
        {/* hero */}
        <div className="cd-hero">
          <div className="badge">아파트</div>
          <h1>{apt.name}</h1>
          <div className="sub">{apt.area} · {apt.year}년 · {apt.households.toLocaleString()}세대</div>

          <div className="stats-row">
            <div className="stat case">
              <span className="num">{apt.cases}</span>
              <span className="lbl">시공 사례</span>
            </div>
            <div className="stat plan">
              <span className="num">{apt.plans}</span>
              <span className="lbl">도면</span>
            </div>
            <div className="stat">
              <span className="num">{apt.sizes.length}</span>
              <span className="lbl">평형</span>
            </div>
          </div>
        </div>

        <div className="row-divider"/>

        {/* visit banner */}
        <div style={{ padding: '16px 18px', background: '#fff' }}>
          <div style={{
            background: 'linear-gradient(110deg, #1571FF 0%, #2A8AFF 100%)',
            borderRadius: 12,
            padding: '16px 18px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' }}>현장 방문 예정이신가요?</div>
              <div style={{ fontSize: 12, marginTop: 4, opacity: 0.92 }}>집보기 체크리스트로 매물 기록하기</div>
            </div>
            <div style={{
              width: 48, height: 48, borderRadius: 10, background: '#fff', color: '#1571FF',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon name="pages" size={26} stroke={2}/>
            </div>
          </div>
        </div>

        {/* 집안구경 section */}
        <div style={{ background: '#fff', padding: '20px 18px 4px' }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>
            집안구경 👀
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 6 }}>
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.55 }}>
              평수별로 집안을 살펴보세요.<br/>
              비슷한 구조의 집도 함께 볼 수 있어요.
            </div>
            <div style={{
              fontSize: 12, fontWeight: 600, color: '#666',
              border: '1px solid var(--border)', borderRadius: 6,
              padding: '6px 10px',
              display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0,
            }}>
              비슷한 구조란? <Icon name="info" size={12} stroke={2}/>
            </div>
          </div>
        </div>

        {/* size tabs */}
        <div className="size-tabs">
          {apt.sizes.map((sz, i) => (
            <button key={sz} className={i === sizeIdx ? 'active' : ''} onClick={() => setSizeIdx(i)}>
              {sz.replace('py', '평')}
            </button>
          ))}
          <span style={{ flex: 1 }}/>
          <button style={{ paddingRight: 0 }}>
            <Icon name="chevronDown" size={18}/>
          </button>
        </div>

        {/* Plan card */}
        <PlanCard apt={apt} size={size}/>

        {/* Cases grid for size */}
        <div style={{ background: '#fff', paddingTop: 4 }}>
          <div style={{
            padding: '14px 18px 6px',
            fontSize: 14, fontWeight: 700,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>{size.replace('py', '평')} 사례 {allCases.filter((c) => c.size === size).length || allCases.length}</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              최신순 <Icon name="chevronDown" size={12} stroke={2.2}/>
            </span>
          </div>

          <div className="case-grid">
            {/* my case first, highlighted */}
            {myCases.map((c) => (
              <div key={c.id} className="case-card mine">
                <div className="thumb">
                  <img src={c.photo} alt=""/>
                  <div className="badge-mine">내 글</div>
                </div>
                <div className="title">{c.title}</div>
                <div className="meta">
                  <Icon name="heart" size={12} stroke={2}/>
                  방금 발행
                </div>
              </div>
            ))}
            {otherCases.map((c) => (
              <CaseCardCompact key={c.id} c={c} nav={nav}/>
            ))}
          </div>
        </div>

        <div className="spacer"/>
      </div>
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

// Stylized floor plan diagram
const SchematicFloorPlan = () => (
  <svg viewBox="0 0 360 280" width="100%" height="100%" style={{ display: 'block' }}>
    {/* outer walls */}
    <g stroke="#181818" strokeWidth="2" fill="none">
      <path d="M40 30 L 320 30 L 320 110 L 340 110 L 340 240 L 60 240 L 60 200 L 40 200 Z"/>
    </g>

    {/* dimension labels top */}
    <g fontSize="9" fill="#666" fontWeight="500">
      <text x="80" y="20">1500</text>
      <text x="130" y="20">2650</text>
      <text x="190" y="20">2490</text>
      <text x="260" y="20">5690</text>
      <text x="180" y="14" textAnchor="middle" fontWeight="700">12330</text>
    </g>

    {/* rooms */}
    {/* 침실 top-left */}
    <rect x="60" y="40" width="80" height="60" fill="#F5EBD9" stroke="#181818" strokeWidth="1"/>
    <text x="100" y="74" textAnchor="middle" fontSize="11" fontWeight="700" fill="#444">침실</text>

    {/* bath */}
    <rect x="140" y="40" width="40" height="50" fill="#C8E7F0" stroke="#181818" strokeWidth="1"/>

    {/* hall */}
    <rect x="180" y="40" width="50" height="55" fill="#F4EFE5" stroke="#181818" strokeWidth="1"/>

    {/* small bath */}
    <rect x="230" y="40" width="40" height="40" fill="#C8E7F0" stroke="#181818" strokeWidth="1"/>

    {/* 침실 top-right */}
    <rect x="270" y="40" width="50" height="70" fill="#F5EBD9" stroke="#181818" strokeWidth="1"/>
    <text x="295" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fill="#444">침실</text>

    {/* 거실 - main center */}
    <rect x="140" y="100" width="180" height="80" fill="#D6BFA0" stroke="#181818" strokeWidth="1"/>
    <text x="230" y="146" textAnchor="middle" fontSize="14" fontWeight="800" fill="#5a4530">거실</text>

    {/* 발코니 left */}
    <rect x="40" y="100" width="20" height="100" fill="#fff" stroke="#181818" strokeWidth="1"/>
    <text x="50" y="155" textAnchor="middle" fontSize="9" fill="#666" fontWeight="600">발</text>
    <text x="50" y="165" textAnchor="middle" fontSize="9" fill="#666" fontWeight="600">코</text>
    <text x="50" y="175" textAnchor="middle" fontSize="9" fill="#666" fontWeight="600">니</text>

    <rect x="60" y="100" width="80" height="100" fill="#F5EBD9" stroke="#181818" strokeWidth="1"/>

    {/* 주방/식당 */}
    <rect x="220" y="180" width="100" height="60" fill="#F4EFE5" stroke="#181818" strokeWidth="1"/>
    <text x="270" y="208" textAnchor="middle" fontSize="11" fontWeight="700" fill="#444">주방</text>
    <text x="270" y="220" textAnchor="middle" fontSize="11" fontWeight="700" fill="#444">식당</text>

    {/* 발코니 right */}
    <rect x="320" y="110" width="20" height="70" fill="#fff" stroke="#181818" strokeWidth="1"/>
    <text x="330" y="148" textAnchor="middle" fontSize="9" fill="#666" fontWeight="600">발코니</text>

    {/* 침실 bottom */}
    <rect x="140" y="180" width="80" height="60" fill="#F5EBD9" stroke="#181818" strokeWidth="1"/>
    <text x="180" y="214" textAnchor="middle" fontSize="11" fontWeight="700" fill="#444">침실</text>

    {/* center logo */}
    <g opacity="0.4">
      <circle cx="230" cy="140" r="11" fill="#fff" stroke="#1571FF" strokeWidth="1.5"/>
      <text x="230" y="143" textAnchor="middle" fontSize="6" fontWeight="700" fill="#1571FF">오집</text>
    </g>

    {/* right side dimensions */}
    <g fontSize="9" fill="#666" fontWeight="500">
      <text x="346" y="78">2800</text>
      <text x="346" y="148">3000</text>
      <text x="346" y="218">3840</text>
    </g>
  </svg>
);

window.ComplexScreen = ComplexScreen;
