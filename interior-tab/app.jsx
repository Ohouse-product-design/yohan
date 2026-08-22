// ===== Root — 현재안 / 개편안 / 나란히 비교 =====

function ControlBar({ mode, setMode, phaseId, setPhaseId, ann, setAnn }) {
  return (
    <div className="controls">
      <div className="seg">
        {[['current', '현재안'], ['redesign', '개편안'], ['both', '나란히']].map(([k, label]) => (
          <button key={k} className={mode === k ? 'on' : ''} onClick={() => setMode(k)}>{label}</button>
        ))}
      </div>

      {mode !== 'current' && (
        <>
          <span className="ctl-label">시나리오</span>
          {window.DATA.phases.map(p => (
            <button key={p.id} className={`ctl-chip ${phaseId === p.id ? 'on' : ''}`}
                    onClick={() => setPhaseId(p.id)}>{p.label}</button>
          ))}
        </>
      )}

      <button className={`ctl-chip ${ann ? 'on' : ''}`} onClick={() => setAnn(a => !a)}>
        {ann ? '주석 끄기' : '주석 보기'}
      </button>
    </div>
  );
}

function Root() {
  const [mode, setMode] = React.useState('redesign');
  const [phaseId, setPhaseId] = React.useState('d45');
  const [ann, setAnn] = React.useState(false);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    document.body.classList.toggle('ann-on', ann);
  }, [ann]);

  const twoUp = mode === 'both';

  React.useEffect(() => {
    const compute = () => {
      const dw = twoUp ? 402 * 2 + 28 : 402;
      const dh = 874;
      const sx = (window.innerWidth - 48) / dw;
      const sy = (window.innerHeight - 108) / dh;
      setScale(Math.min(1.02, sx, sy));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [twoUp]);

  const frame = (which, label) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      {twoUp && (
        <div style={{
          fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em',
          color: which === 'current' ? 'rgba(255,255,255,0.45)' : '#fff',
        }}>{label}</div>
      )}
      <IOSDevice width={402} height={874}>
        {which === 'current'
          ? <CurrentScreen/>
          : <RedesignScreen phaseId={phaseId} setPhaseId={setPhaseId}/>}
      </IOSDevice>
    </div>
  );

  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', background: '#23232a', overflow: 'hidden',
    }}>
      <ControlBar mode={mode} setMode={setMode} phaseId={phaseId} setPhaseId={setPhaseId}
                  ann={ann} setAnn={setAnn}/>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%', minHeight: 0,
      }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center', display: 'flex', gap: 28 }}>
          {twoUp
            ? <>{frame('current', '현재안')}{frame('redesign', '개편안')}</>
            : frame(mode === 'current' ? 'current' : 'redesign')}
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root/>);
