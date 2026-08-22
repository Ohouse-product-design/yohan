// ===== 개편안 — "시공 리드 퍼널" → "이사·집 준비 홈" =====
//
// 재방문 엔진은 체크리스트가 아니라 견적이다.
// 이사플래너(~2024, 2025-08 sunset)는 "이사 일정에 맞춘 Action Item" 가설로
// 런칭했다가 70%+가 액션 없이 이탈했고, 회고 결론이 "일정 알림보다
// 업체 추천/견적 비교가 핵심이었다" 였다. 후속 온보딩 테스트(2025-05)도
// UXR 단계에서 유저가 체크리스트를 혼란스러워했고, 알림 activate는 8~9%,
// 가치 테스트(2025-06)에서 최고 value prop도 19%에 그쳐 롤백됐다.
// 그래서 진행률·D-day 체크리스트를 걷어내고 견적 트래커를 축으로 놓는다.
const RD = window.DATA;

const won = n => n.toLocaleString() + '만원';

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
  const act = hover === null ? series.length - 1 : hover;

  return (
    <div style={{ position: 'relative', marginTop: 4 }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A86FF" stopOpacity="0.16"/>
            <stop offset="100%" stopColor="#1A86FF" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <line x1={PL} y1={H - PB} x2={W - PR} y2={H - PB} stroke="#EDEEF0" strokeWidth="1"/>
        <path d={area} fill="url(#spark-fill)"/>
        <path d={line} fill="none" stroke="#1A86FF" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
        {series.map((d, i) => (
          <g key={d.m}>
            <circle cx={x(i)} cy={y(d.v)} r={i === act ? 5 : 2.6}
                    fill={i === act ? '#1A86FF' : '#9CC8FF'}
                    stroke="#fff" strokeWidth={i === act ? 2.5 : 0}/>
            <rect x={x(i) - 22} y={0} width={44} height={H - PB + 8} fill="transparent"
                  onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                  style={{ cursor: 'pointer' }}/>
            <text x={x(i)} y={H - 6} textAnchor="middle"
                  style={{ fontSize: 10.5, fill: i === act ? '#424242' : '#BCBCBC', fontWeight: i === act ? 700 : 500 }}>
              {d.m}
            </text>
          </g>
        ))}
        <text x={Math.min(Math.max(x(act), 26), W - 26)} y={y(series[act].v) - 11} textAnchor="middle"
              style={{ fontSize: 11.5, fontWeight: 700, fill: '#141414' }}>
          {series[act].v.toLocaleString()}만
        </text>
      </svg>
    </div>
  );
}

/* ── 견적 트래커 ───────────────────────────────────────
   재방문 이유가 억지 훅이 아니라 실제 대기 상태에서 나온다.
   업체 답이 오는 데 걸리는 시간은 실재하므로.            */
function QuoteTracker({ q, market }) {
  const [picks, setPicks] = React.useState(
    () => (q.picks || []).reduce((a, p, i) => (a[i] = p.on, a), {})
  );
  React.useEffect(() => {
    setPicks((q.picks || []).reduce((a, p, i) => (a[i] = p.on, a), {}));
  }, [q.id]);

  const card = { border: '1px solid #E7EDF5', borderRadius: 16, padding: '18px 16px 16px', background: '#fff' };

  // ── 빈 상태 — 차이님이 말한 "한 번에 견적 받기"가 여기
  if (q.kind === 'empty') {
    const n = Object.values(picks).filter(Boolean).length;
    return (
      <div style={{ ...card, background: 'linear-gradient(180deg,#F7FAFF 0%,#FFFFFF 62%)' }}>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.035em' }}>{q.title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 4, lineHeight: 1.45 }}>{q.sub}</div>
        <div style={{ display: 'flex', gap: 7, marginTop: 15 }}>
          {q.picks.map((p, i) => {
            const on = !!picks[i];
            return (
              <button key={p.name} onClick={() => setPicks(s => ({ ...s, [i]: !s[i] }))}
                      style={{
                        flex: 1, minWidth: 0, padding: '11px 4px 9px', borderRadius: 11,
                        border: on ? '1.5px solid var(--ohouse-blue)' : '1.5px solid #E6E8EB',
                        background: on ? '#F2F8FF' : '#fff',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                        transition: 'border-color 150ms, background 150ms',
                      }}>
                <span style={{ fontSize: 19, lineHeight: 1 }}>{p.glyph}</span>
                <span style={{
                  fontSize: 11.5, fontWeight: on ? 700 : 500,
                  color: on ? 'var(--ohouse-blue)' : '#5A6068', letterSpacing: '-0.03em',
                }}>{p.name}</span>
              </button>
            );
          })}
        </div>
        <div style={{
          marginTop: 14, height: 46, borderRadius: 11,
          background: n ? 'var(--ohouse-blue)' : '#E9EDF2',
          color: n ? '#fff' : '#A9B0B8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 700, letterSpacing: '-0.03em',
          transition: 'background 180ms',
        }}>
          {n ? `선택한 ${n}개 견적 요청하기` : '받을 견적을 골라주세요'}
        </div>
      </div>
    );
  }

  // ── 계약 후 — 남은 항목으로 자연스럽게 확장
  if (q.kind === 'contracted') {
    return (
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{
            fontSize: 11, fontWeight: 800, color: '#12855B', background: '#EAF8F1',
            borderRadius: 999, padding: '3px 8px',
          }}>계약 완료</span>
          <span style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: '-0.035em' }}>{q.title}</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>{q.sub}</div>
        <div style={{ marginTop: 15, paddingTop: 14, borderTop: '1px solid #EDF1F6' }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>아직 안 받은 견적</div>
          {q.remaining.map(r => (
            <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 0' }}>
              <span style={{
                width: 36, height: 36, borderRadius: 11, background: '#F4F5F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
              }}>{r.glyph}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 14, fontWeight: 600 }}>{r.name}</span>
                <span style={{ display: 'block', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>{r.hint}</span>
              </span>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 12, height: 44, borderRadius: 11, background: '#F0F7FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14.5, fontWeight: 700, color: 'var(--ohouse-blue)',
        }}>{q.cta}</div>
      </div>
    );
  }

  // ── 요청/응답 트래킹 — 대기 중이 곧 돌아올 이유
  const got = q.rows.filter(r => r.status === 'in');
  const amounts = got.map(r => r.amount);
  const lo = Math.min(...amounts), hi = Math.max(...amounts);
  const span = Math.max(hi - lo, 1);
  const allIn = got.length === q.rows.length;

  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.035em' }}>{q.title}</span>
        <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>{q.category}</span>
      </div>
      <div style={{ fontSize: 12.5, color: allIn ? 'var(--ohouse-blue)' : 'var(--text-tertiary)', marginTop: 4, fontWeight: allIn ? 600 : 400 }}>
        {q.sub}
      </div>

      <div style={{ marginTop: 14 }}>
        {q.rows.map((r, i) => (
          <div key={r.vendor} style={{
            padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid #F3F3F3',
            opacity: r.status === 'wait' ? 0.72 : 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.03em' }}>{r.vendor}</span>
              {r.std && <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--ohouse-blue)' }}>✓스탠다드</span>}
              {r.fresh && <span style={{ width: 6, height: 6, borderRadius: 999, background: '#E5484D' }}/>}
              <span style={{ flex: 1 }}/>
              {r.status === 'in' ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {r.tag && (
                    <span style={{
                      fontSize: 10.5, fontWeight: 700, color: '#12855B',
                      background: '#EAF8F1', borderRadius: 999, padding: '2px 7px',
                    }}>{r.tag}</span>
                  )}
                  <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.03em' }}>{won(r.amount)}</span>
                </span>
              ) : (
                <span style={{ fontSize: 12.5, color: '#9AA4AE', fontWeight: 600 }}>대기중</span>
              )}
            </div>
            {r.status === 'in' ? (got.length < 2 ? null : (
              <div style={{ marginTop: 7, height: 5, borderRadius: 3, background: '#F0F2F4', overflow: 'hidden' }}>
                <div style={{
                  width: `${28 + ((r.amount - lo) / span) * 72}%`, height: '100%', borderRadius: 3,
                  background: r.tag === '최저' ? '#12855B' : 'var(--ohouse-blue)',
                }}/>
              </div>
            )) : (
              <div style={{ fontSize: 11.5, color: '#A9B0B8', marginTop: 4 }}>{r.note}</div>
            )}
          </div>
        ))}
      </div>

      {allIn && (
        <div style={{
          marginTop: 4, background: '#F7F9FA', borderRadius: 10, padding: '11px 12px',
          fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5,
        }}>
          최저 <b style={{ color: '#141414' }}>{won(lo)}</b> · 최고 <b style={{ color: '#141414' }}>{won(hi)}</b>
          <br/>우리 단지 시세 {won(market)} 대비 <b style={{ color: '#12855B' }}>{won(market - lo)} 낮게</b> 받을 수 있어요
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 13 }}>
        <div style={{
          flex: 1, height: 44, borderRadius: 11, background: '#F0F7FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, color: 'var(--ohouse-blue)',
        }}>{q.cta}</div>
        <div style={{
          width: 92, height: 44, borderRadius: 11, border: '1px solid #E6E8EB',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 600, color: '#2B2B2B',
        }}>채팅</div>
      </div>
    </div>
  );
}

function RedesignScreen({ quoteId }) {
  const q = RD.quotes.find(x => x.id === quoteId) || RD.quotes[0];
  const p = RD.price;

  return (
    <div className="app">
      <AppBar placeholder="단지명, 업체, 시공 종류 검색"
              ann={{ kind: 'good', label: '탭 맥락에 맞는 검색으로 교체' }}/>

      <div className="scroll">

        {/* ═══ Layer 1 · 견적 트래커 (재방문 엔진) ═══ */}
        <Ann kind="good" label="① 재방문 엔진 — 체크리스트가 아니라 견적">
          <div style={{ padding: '14px 16px 18px' }}>
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
            <QuoteTracker q={q} market={p.current}/>
          </div>
        </Ann>

        {/* 서비스 그리드 — 탭 전체 지도를 첫 화면으로 */}
        <Ann kind="good" label="② 탐색 엔진 — 12모듈 → 8목적지, 스크롤 0">
          <div style={{ padding: '8px 10px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', rowGap: 18, columnGap: 4 }}>
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

        {/* ═══ Layer 2 · 우리 단지 시세 (내 견적의 판단 기준) ═══ */}
        <Ann kind="good" label="③ 내 견적을 판단할 기준 — 시세">
          <div className="sec" style={{ paddingBottom: 20 }}>
            <h2 className="sec-h">우리 단지 시세</h2>
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
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>시세 바뀌면 알려드릴까요?</span>
                <span style={{
                  fontSize: 12.5, fontWeight: 700, color: 'var(--ohouse-blue)',
                  background: '#F0F7FF', borderRadius: 999, padding: '6px 13px',
                }}>알림 받기</span>
              </div>
            </div>
          </div>
        </Ann>

        <div className="divider" style={{ marginTop: 0 }}/>

        {/* ═══ Layer 3 · 우리 동네 소식 (보조) ═══ */}
        <Ann kind="good" label="④ 신선도 — 보조 훅">
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
