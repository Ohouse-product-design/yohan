// ===== 글쓰기 화면 =====
const ComposeScreen = ({ nav, params }) => {
  const D = window.APP_DATA;

  // Pre-fill from apt detail if entered from there
  const initialAptId = params.aptId || null;
  const [selectedAptId, setSelectedAptId] = React.useState(initialAptId);
  const [bodyText, setBodyText] = React.useState('');
  const apt = selectedAptId ? D.findApt(selectedAptId) : null;

  // Restore from session storage (after going to apt picker)
  React.useEffect(() => {
    const stored = sessionStorage.getItem('compose-apt');
    if (stored && !selectedAptId) setSelectedAptId(stored);
    const storedBody = sessionStorage.getItem('compose-body');
    if (storedBody && !bodyText) setBodyText(storedBody);
  }, []);

  React.useEffect(() => {
    if (selectedAptId) sessionStorage.setItem('compose-apt', selectedAptId);
  }, [selectedAptId]);

  React.useEffect(() => {
    sessionStorage.setItem('compose-body', bodyText);
  }, [bodyText]);

  const canPublish = !!selectedAptId;

  const handlePublish = () => {
    sessionStorage.removeItem('compose-apt');
    sessionStorage.removeItem('compose-body');
    nav.replace('publishDone', { aptId: selectedAptId });
  };

  return (
    <div className="app compose-screen" data-screen-label="05 글쓰기">
      <div className="topbar with-border">
        <button className="iconbtn" onClick={() => nav.pop()}>
          <Icon name="back" size={22}/>
        </button>
        <div className="title left">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 24, height: 24, borderRadius: 6,
              background: '#141414', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="house" size={16} stroke={2} />
            </span>
          </span>
        </div>
        <button
          onClick={handlePublish}
          disabled={!canPublish}
          style={{
            fontSize: 15, fontWeight: 700,
            color: canPublish ? '#1A86FF' : '#BCBCBC',
            padding: '0 8px',
          }}
        >
          글쓰기
        </button>
      </div>

      <div className="scroll">
        <div className="compose-content">
          {/* Photo */}
          <div className="compose-photo">
            <img src="assets/thumbnails/15.jpg" alt=""/>
            <div className="count">+ 0</div>
          </div>

          {/* APARTMENT row - NEW & highlighted */}
          <div
            className={`row-input ${apt ? '' : 'highlight'}`}
            onClick={() => nav.push('aptPicker')}
            style={apt ? {} : {
              background: '#FFFBF2', border: '1px solid #FFE4B0',
              borderRadius: 10, padding: 14,
              marginTop: 4, marginBottom: 4,
            }}
          >
            <div className="icon" style={!apt ? { color: '#FF7900' } : {}}>
              <Icon name="apartment" size={22} stroke={apt ? 1.8 : 2.2}/>
            </div>
            <div className="label" style={!apt ? { color: '#141414', fontWeight: 700 } : {}}>
              {apt ? '아파트 단지' : (
                <>
                  아파트 단지 선택
                  <span style={{
                    marginLeft: 6, display: 'inline-block',
                    background: '#FF7900', color: '#fff',
                    fontSize: 10, fontWeight: 800,
                    padding: '2px 5px', borderRadius: 3,
                    letterSpacing: '0.02em',
                    verticalAlign: 'middle',
                  }}>NEW</span>
                </>
              )}
            </div>
            {apt ? (
              <span className="value" style={{ color: '#1A86FF' }}>{apt.name}</span>
            ) : (
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>선택하면 묶여 보여요</span>
            )}
            <Icon name="chevron" size={18}/>
          </div>

          {!apt && (
            <div style={{
              fontSize: 12, color: '#FF7900',
              padding: '0 4px 8px',
              fontWeight: 500,
            }}>
              💡 단지를 선택하면 같은 단지 이웃에게 우선 노출돼요
            </div>
          )}

          {/* Other rows */}
          <div className="row-input">
            <div className="icon"><Icon name="pin" size={22} stroke={1.8}/></div>
            <div className="label">공간 정보 추가</div>
            <Icon name="chevron" size={18}/>
          </div>

          {/* Body */}
          <textarea
            className="compose-textarea"
            placeholder={"어떤 사진인지 짧은 소개로 시작해보세요.\n다양한 #태그도 추가할 수 있어요."}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

// ===== 단지 선택 sheet =====
const AptPickerScreen = ({ nav }) => {
  const D = window.APP_DATA;
  const [q, setQ] = React.useState('');

  const recent = ['apt-jamsil-els', 'apt-helio'];
  const filtered = q.trim()
    ? D.apartments.filter((a) =>
        a.name.includes(q.trim()) || a.area.includes(q.trim())
      )
    : D.apartments;

  const select = (aptId) => {
    sessionStorage.setItem('compose-apt', aptId);
    nav.pop();
  };

  return (
    <div className="app sheet-screen" data-screen-label="06 단지 선택">
      <div className="topbar with-border">
        <button className="iconbtn" onClick={() => nav.pop()}>
          <Icon name="close" size={22}/>
        </button>
        <div className="title">아파트 단지 선택</div>
      </div>

      <div className="sheet-search-wrap">
        <div className="sheet-search-input">
          <Icon name="search" size={16}/>
          <input
            placeholder="아파트 단지명, 동, 지역으로 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
          {q && (
            <button onClick={() => setQ('')} style={{ color: 'var(--text-quaternary)' }}>
              <Icon name="close" size={16}/>
            </button>
          )}
        </div>
      </div>

      {/* assure band */}
      <div className="assure-band">
        <div className="ic"><Icon name="info" size={18} stroke={2.2}/></div>
        <div>
          단지명만 노출되고, <b>평형·동·호수는 비공개</b>예요.
          <br/>같은 단지 이웃에게 먼저 노출돼서 더 많은 반응을 받을 수 있어요.
        </div>
      </div>

      <div className="sheet-list" style={{ marginTop: 12 }}>
        {!q && (
          <div style={{ padding: '8px 18px 4px', fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)' }}>
            최근 검색
          </div>
        )}
        {!q && recent.map((id) => {
          const a = D.findApt(id);
          if (!a) return null;
          return <AptRow key={a.id} apt={a} onClick={() => select(a.id)}/>;
        })}

        <div style={{ padding: '12px 18px 4px', fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)' }}>
          {q ? `'${q}' 검색 결과 ${filtered.length}건` : '인기 단지'}
        </div>
        {filtered.map((a) => (
          <AptRow key={a.id} apt={a} onClick={() => select(a.id)}/>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: '40px 18px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
            검색 결과가 없어요
          </div>
        )}

        <div className="spacer"/>
      </div>
    </div>
  );
};

const AptRow = ({ apt, onClick }) => (
  <div className="apt-card" onClick={onClick}>
    <div className={`apt-thumb ${apt.hue}`}>
      <AptThumb apt={apt}/>
    </div>
    <div className="apt-info">
      <div className="apt-name">{apt.name}</div>
      <div className="apt-meta">{apt.area} · {apt.year}년 · {apt.households.toLocaleString()}세대</div>
      <div className="apt-stats">
        <span className="s-case">사례 {apt.cases}</span>
        <span className="sep">·</span>
        <span className="s-plan">도면 {apt.plans}</span>
      </div>
    </div>
  </div>
);

// ===== 발행 완료 =====
const PublishDoneScreen = ({ nav, params }) => {
  const D = window.APP_DATA;
  const apt = D.findApt(params.aptId);
  const [showToast, setShowToast] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setShowToast(true), 200);
    return () => clearTimeout(t);
  }, []);

  // After publishing - jump to complex detail showing the new post
  React.useEffect(() => {
    const t = setTimeout(() => {
      nav.replace('complex', { aptId: apt.id, myCaseId: 'my-new-post' });
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="app" style={{ background: '#fff' }} data-screen-label="07 발행 완료">
      <div className="scroll" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: '#E3F0FF', color: '#1A86FF',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Icon name="check" size={40} stroke={2.6}/>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>
            발행 완료!
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-tertiary)', marginTop: 8, lineHeight: 1.5 }}>
            <b style={{ color: '#1A86FF' }}>{apt.name}</b> 페이지에<br/>
            글이 노출되고 있어요
          </div>
          <div style={{
            marginTop: 24,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: 'var(--text-tertiary)',
            background: 'var(--bg-soft)',
            padding: '8px 14px', borderRadius: 999,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1A86FF', animation: 'pulse 1.4s infinite' }}/>
            단지 페이지로 이동 중...
          </div>
        </div>
      </div>

      <div className={`publish-toast ${showToast ? 'show' : ''}`}>
        <div className="ck"><Icon name="check" size={14} stroke={2.6}/></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>같은 단지 이웃에게 우선 노출 중</div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>{apt.name} · 평형·동·호수 비공개</div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

window.ComposeScreen = ComposeScreen;
window.AptPickerScreen = AptPickerScreen;
window.PublishDoneScreen = PublishDoneScreen;
