// ===== 개편안 — "시공 리드 퍼널" → "이사·집 준비 홈" =====
// 3층 구조: ① 내 상태 + 전체 지도  ② 지금 할 일  ③ 가격 추적 + 동네 소식
const RD = window.DATA;

/* ── 가격 추이 스파크라인 ──────────────────────────────
   단일 시리즈 → 범례 없음, 오늘의집 블루 단일 hue,
   마지막 점만 직접 라벨, 축은 최소한만.                */
function PriceSpark({ series }) {
  const [hover, setHover] = React.useState(null);
  const W = 302, H = 88, PT = 14, PB = 22, PL = 6, PR = 6;
  const vals = series.map(d => d.v);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.35 || 1;
  const y = v => PT + (1 - (v - (lo - pad)) / ((hi + pad) - (lo - pad))) * (H - PT - PB);
  const x = i => PL + (i / (series.length - 1)) * (W - PL - PR);

  const line = series.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.v).toFixed(1)}`).join(' ');
  const area = `${line} L${x(series.length - 1).toFixed(1)},${H - PB} L${x(0).toFixed(1)},${H - PB} Z`;
  const last = series.length - 1;
  const act = hover === null ? last : hover;

  return (
    <div style={{ position: 'relative', marginTop: 4 }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A86FF" stopOpacity="0.16"/>
            <stop offset="100%" stopColor="#1A86FF" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* baseline — 축은 뒤로 물러난다 */}
        <line x1={PL} y1={H - PB} x2={W - PR} y2={H - PB} stroke="#EDEEF0" strokeWidth="1"/>
        <path d={area} fill="url(#spark-fill)"/>
        <path d={line} fill="none" stroke="#1A86FF" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
        {series.map((d, i) => (
          <g key={d.m}>
            <circle cx={x(i)} cy={y(d.v)} r={i === act ? 5 : 2.6}
                    fill={i === act ? '#1A86FF' : '#9CC8FF'}
                    stroke="#fff" strokeWidth={i === act ? 2.5 : 0}/>
            {/* 히트 타깃은 마크보다 크게 */}
            <rect x={x(i) - 22} y={0} width={44} height={H - PB + 8} fill="transparent"
                  onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                  style={{ cursor: 'pointer' }}/>
            <text x={x(i)} y={H - 6} textAnchor="middle"
                  style={{ fontSize: 10.5, fill: i === act ? '#424242' : '#BCBCBC', fontWeight: i === act ? 700 : 500 }}>
              {d.m}
            </text>
          </g>
        ))}
        {/* 직접 라벨 — 모든 점이 아니라 활성 점 하나만 */}
        <text x={Math.min(Math.max(x(act), 26), W - 26)} y={y(series[act].v) - 11} textAnchor="middle"
              style={{ fontSize: 11.5, fontWeight: 700, fill: '#141414' }}>
          {series[act].v.toLocaleString()}만
        </text>
      </svg>
    </div>
  );
}

function RedesignScreen({ phaseId, setPhaseId }) {
  const phase = RD.phases.find(p => p.id === phaseId) || RD.phases[0];
  const [checked, setChecked] = React.useState({});

  // 시나리오가 바뀌면 체크 상태 초기화
  React.useEffect(() => { setChecked({}); }, [phaseId]);

  const extra = Object.values(checked).filter(Boolean).length;
  const done = Math.min(phase.done + extra, phase.total);
  const pct = Math.round((done / phase.total) * 100);
  const p = RD.price;

  const ddayText = phase.dday >= 0 ? `D-${phase.dday}` : `입주 ${-phase.dday}일째`;

  return (
    <div className="app">
      {/* 커머스 검색어 → 탭 컨텍스트 검색 */}
      <AppBar placeholder="단지명, 업체, 시공 종류 검색"
              ann={{ kind: 'good', label: '탭 맥락에 맞는 검색으로 교체' }}/>

      <div className="scroll">

        {/* ═══ Layer 1 · 내 상태 + 전체 지도 (스크롤 0) ═══ */}
        <Ann kind="good" label="① 재방문 엔진 — 진행형 상태">
          <div style={{ padding: '14px 16px 18px' }}>
            {/* 주소 + 이사 예정일 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Icon name="pin" size={15} stroke={1.9} style={{ color: '#757575', flexShrink: 0 }}/>
              <span style={{
                fontSize: 12.5, color: '#757575', minWidth: 0,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{RD.complex}</span>
              <span style={{ color: '#DDD', fontSize: 11 }}>|</span>
              <span style={{ fontSize: 12.5, color: '#757575', flexShrink: 0 }}>10월 12일 이사</span>
              <Icon name="edit" size={13} stroke={1.9} style={{ color: '#BCBCBC', flexShrink: 0 }}/>
            </div>

            {/* D-day 상태 카드 */}
            <div style={{
              border: '1px solid #E7EDF5', borderRadius: 16, padding: '18px 17px 16px',
              background: 'linear-gradient(180deg,#F7FAFF 0%,#FFFFFF 62%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
                <span style={{
                  fontSize: 25, fontWeight: 800, color: 'var(--ohouse-blue)',
                  letterSpacing: '-0.045em', lineHeight: 1,
                }}>{ddayText}</span>
                <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.035em' }}>
                  지금은 {phase.stage}
                </span>
              </div>

              {/* 진행률 */}
              <div style={{ marginTop: 15 }}>
                <div style={{
                  height: 7, borderRadius: 4, background: '#E9EDF2', overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${pct}%`, height: '100%', borderRadius: 4,
                    background: 'var(--ohouse-blue)',
                    transition: 'width 420ms cubic-bezier(0.32,0.72,0,1)',
                  }}/>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginTop: 8,
                  fontSize: 12.5, color: 'var(--text-tertiary)',
                }}>
                  <span>이사 준비 <b style={{ color: '#141414' }}>{done}/{phase.total}</b> 완료</span>
                  <span style={{ fontWeight: 700, color: 'var(--ohouse-blue)' }}>{pct}%</span>
                </div>
              </div>

              <div style={{
                marginTop: 14, paddingTop: 13, borderTop: '1px solid #EDF1F6',
                display: 'flex', gap: 7, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 13, lineHeight: 1.35 }}>💡</span>
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {phase.blurb}
                </span>
              </div>
            </div>
          </div>
        </Ann>

        {/* 서비스 그리드 — 탭 전체 지도를 첫 화면으로 */}
        <Ann kind="good" label="② 탐색 엔진 — 12모듈 → 8목적지, 스크롤 0">
          <div style={{ padding: '8px 10px 20px' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
              rowGap: 18, columnGap: 4,
            }}>
              {RD.grid.map(g => (
                <div key={g.name} style={{ position: 'relative' }}>
                  <Tile glyph={g.glyph} name={g.name} badge={g.badge} size={50}/>
                  {g.recent && (
                    <span style={{
                      position: 'absolute', top: -5, left: '50%', marginLeft: -34,
                      fontSize: 9, fontWeight: 700, color: '#6B7684',
                      background: '#EDEFF2', border: '1.5px solid #fff',
                      borderRadius: 999, padding: '2px 6px', lineHeight: 1.15,
                    }}>최근</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Ann>

        <div className="divider" style={{ marginTop: 0 }}/>

        {/* ═══ Layer 2 · 지금 할 일 (D-day에 따라 내용이 바뀐다) ═══ */}
        <Ann kind="good" label="③ 개인화 — 다 펴놓지 않고 지금 것만">
          <div className="sec" style={{ paddingBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 13 }}>
              <h2 className="sec-h" style={{ margin: 0 }}>지금 하면 좋은 일</h2>
              <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>{ddayText} 기준</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {phase.tasks.map((t, i) => {
                const on = !!checked[i];
                return (
                  <button key={t.t} onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                            border: `1px solid ${on ? '#DCEAFB' : '#EDEDED'}`, borderRadius: 12,
                            padding: '14px 14px', textAlign: 'left',
                            background: on ? '#F6FAFF' : '#fff',
                            transition: 'background 180ms, border-color 180ms',
                          }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                      border: on ? '0' : '1.7px solid #D4D4D4',
                      background: on ? 'var(--ohouse-blue)' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', transition: 'background 180ms',
                    }}>
                      {on && <Icon name="check" size={13} stroke={3}/>}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{
                        display: 'block', fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.03em',
                        color: on ? '#9AA4AE' : '#141414',
                        textDecoration: on ? 'line-through' : 'none',
                      }}>{t.t}</span>
                      <span style={{
                        display: 'block', fontSize: 12.5, marginTop: 2,
                        color: on ? '#BFC6CD' : 'var(--text-tertiary)',
                      }}>{t.s}</span>
                    </span>
                    {!on && (
                      <span style={{
                        fontSize: 12, fontWeight: 700, color: 'var(--ohouse-blue)',
                        background: '#F0F7FF', borderRadius: 999, padding: '5px 10px', flexShrink: 0,
                      }}>{t.to}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </Ann>

        <div className="divider" style={{ marginTop: 0 }}/>

        {/* ═══ Layer 3 · 우리집 예상 견적 (계약 없이 매달 볼 이유) ═══ */}
        <Ann kind="good" label="④ 재방문 훅 — 최하단에서 끌어올린 가격 데이터">
          <div className="sec" style={{ paddingBottom: 20 }}>
            <h2 className="sec-h">우리집 예상 견적</h2>
            <p className="sec-sub">{p.scope} · 최근 {p.sampleN}건 기준</p>

            <div style={{ border: '1px solid #EDEDED', borderRadius: 14, padding: '17px 15px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 9 }}>
                <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1 }}>
                  {p.current.toLocaleString()}<span style={{ fontSize: 18, fontWeight: 700 }}>만원</span>
                </span>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 3, marginBottom: 2,
                  fontSize: 13, fontWeight: 700, color: '#12855B',
                }}>
                  <Icon name="trendDown" size={14} stroke={2.2}/>
                  {Math.abs(p.delta)}만
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 6 }}>
                전월 대비 · {p.insight}
              </div>

              <PriceSpark series={p.series}/>

              <div style={{
                marginTop: 6, borderTop: '1px solid #F1F1F1', paddingTop: 12,
                display: 'flex', alignItems: 'center', gap: 9,
              }}>
                <Icon name="bell" size={16} stroke={1.9} style={{ color: '#757575' }}/>
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>가격 바뀌면 알려드릴까요?</span>
                <span style={{
                  fontSize: 12.5, fontWeight: 700, color: 'var(--ohouse-blue)',
                  background: '#F0F7FF', borderRadius: 999, padding: '6px 13px',
                }}>알림 받기</span>
              </div>
            </div>
          </div>
        </Ann>

        <div className="divider" style={{ marginTop: 0 }}/>

        {/* ═══ Layer 4 · 우리 동네 소식 (항상 새로운 것) ═══ */}
        <Ann kind="good" label="⑤ 신선도 — '새로 생겼다'는 신호">
          <div className="sec" style={{ paddingBottom: 34 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h2 className="sec-h" style={{ margin: 0 }}>우리 동네 소식</h2>
              <span style={{
                background: '#FFF0F0', color: '#E5484D', fontSize: 11, fontWeight: 800,
                borderRadius: 999, padding: '3px 8px',
              }}>+{RD.feed.newReviews + RD.feed.newCases}</span>
            </div>
            <p className="sec-sub" style={{ marginTop: 6 }}>
              반경 4km · 새 리뷰 {RD.feed.newReviews}건, 새 사례 {RD.feed.newCases}건
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {RD.feed.items.map((it, i) => (
                <div key={it.title} style={{
                  display: 'flex', gap: 13, padding: '14px 0',
                  borderTop: i === 0 ? 'none' : '1px solid #F3F3F3',
                }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <Thumb id={it.thumb} style={{ width: 74, height: 74, borderRadius: 8 }}/>
                    {it.fresh && (
                      <span style={{
                        position: 'absolute', top: -4, left: -4, width: 9, height: 9,
                        borderRadius: 999, background: '#E5484D', border: '2px solid #fff',
                      }}/>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: '-0.02em',
                      color: it.fresh ? 'var(--ohouse-blue)' : '#9E9E9E',
                    }}>{it.kind}</span>
                    <div style={{
                      fontSize: 14.5, fontWeight: 700, marginTop: 3, letterSpacing: '-0.03em',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{it.title}</div>
                    <div style={{
                      fontSize: 13, color: '#4A4A4A', marginTop: 3, lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{it.body}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-quaternary)', marginTop: 5 }}>{it.meta}</div>
                  </div>
                </div>
              ))}
            </div>
            <MoreBtn label="동네 소식 더보기"/>
          </div>
        </Ann>
      </div>

      <BottomNav/>
    </div>
  );
}

window.RedesignScreen = RedesignScreen;
