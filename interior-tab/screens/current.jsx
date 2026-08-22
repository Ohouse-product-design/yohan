// ===== 현재안 재현 — 12개 모듈이 세로로 쌓인 구조 =====
const D = window.DATA;

function CurrentScreen() {
  const [caseFilter, setCaseFilter] = React.useState('전체');
  const [budgetTab, setBudgetTab] = React.useState('20평대');
  const ranks = D.budgetRanks[budgetTab];
  const maxPct = Math.max(...ranks.map(r => r.pct));

  return (
    <div className="app">
      <AppBar placeholder="집요한세일 ~91% 절대 혜택의…"
              ann={{ kind: 'bad', label: '커머스 검색 — 이 탭과 무관' }}/>

      <div className="scroll">
        {/* ① 주소 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '13px 16px',
          borderBottom: '1px solid #F2F2F2',
        }}>
          <Icon name="pin" size={17} stroke={1.8} style={{ color: '#2B2B2B', flexShrink: 0 }}/>
          <span style={{
            fontSize: 13.5, color: '#2B2B2B', flex: 1, minWidth: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{D.address}</span>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ohouse-blue)', flexShrink: 0 }}>주소변경</span>
        </div>

        {/* ② 견적계산기 배너 */}
        <div style={{ padding: '16px 16px 0' }}>
          <Ann kind="bad" label="견적계산기 진입 ①/④">
            <div style={{
              height: 106, borderRadius: 12, background: 'linear-gradient(100deg,#1A86FF,#3F9BFF)',
              padding: '20px 18px', position: 'relative', overflow: 'hidden', color: '#fff',
            }}>
              <div style={{ fontSize: 11.5, opacity: 0.85, marginBottom: 4 }}>오늘의집 직접시공</div>
              <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.035em' }}>주방 3D견적계산기 오픈!</div>
              <div style={{
                position: 'absolute', right: 16, bottom: 12,
                background: 'rgba(0,0,0,0.32)', borderRadius: 999,
                fontSize: 10.5, fontWeight: 600, padding: '3px 9px',
              }}>1/8</div>
            </div>
          </Ann>
        </div>

        {/* ③ 전체 시공 업체 찾기 */}
        <div className="sec">
          <h2 className="sec-h">인테리어 시공이 필요할 때</h2>
          <Ann kind="bad" label="업체찾기 진입 ①/③">
            <div style={{
              border: '1px solid #EDEDED', borderRadius: 12, padding: '16px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: 27 }}>🛠️</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 700 }}>전체 시공 업체 찾기</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 2 }}>오늘의집이 시공하자, A/S 보장</div>
              </div>
              <Icon name="chevron" size={17} style={{ color: '#BDBDBD' }}/>
            </div>
          </Ann>

          {/* ④ 직영 부분시공 */}
          <Ann kind="bad" label="직영시공 ①/③ · 견적계산기 ②/④ · 업체찾기 ②/③" style={{ marginTop: 12 }}>
            <div style={{
              border: '1px solid #EDEDED', borderRadius: 12, padding: '17px 14px 14px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 15, paddingLeft: 2 }}>오늘의집이 직접하는 부분 시공</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                {D.partialServices.map(s => (
                  <Tile key={s.name} glyph={{'주방':'🚰','도배':'🧻','마루':'🪵','장판':'🧾'}[s.name]}
                        name={s.name} badge={s.badge} size={50}/>
                ))}
                <Tile glyph="›" name="자세히" size={50}/>
              </div>
              <div style={{
                background: '#F2F8FF', borderRadius: 10, padding: '13px 14px',
                display: 'flex', alignItems: 'center', gap: 11,
              }}>
                <div style={{ fontSize: 21 }}>🧮</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>우리집 주방, 얼마 들까요?</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>상담 없이 예상 견적 확인</div>
                </div>
                <Icon name="chevron" size={16} style={{ color: '#9FB8D8' }}/>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 14 }}>
                <div style={{ fontSize: 20 }}>👷</div>
                <div style={{ flex: 1, fontSize: 14.5, fontWeight: 600 }}>부분 시공 업체 찾기</div>
                <Icon name="chevron" size={16} style={{ color: '#BDBDBD' }}/>
              </div>
            </div>
          </Ann>
        </div>

        <div className="divider"/>

        {/* ⑤ 이사 계획 중이라면 — 이 탭의 '생활'은 여기 칩 3개가 전부 */}
        <div className="sec">
          <h2 className="sec-h">이사 계획 중이라면</h2>
          <Ann kind="bad" label="'생활'의 전부 — 모듈 12개 중 1개">
            <div className="rail">
              {D.movingChips.map(c => (
                <div key={c.name} style={{
                  flexShrink: 0, border: '1px solid #E8E8E8', borderRadius: 11,
                  padding: '15px 20px 15px 16px', display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 15, fontWeight: 700, background: '#fff',
                }}>
                  <span style={{ fontSize: 20 }}>{c.glyph}</span>{c.name}
                </div>
              ))}
            </div>
          </Ann>
        </div>

        <div className="divider"/>

        {/* ⑥ 우리 단지 추천 업체 */}
        <div className="sec">
          <h2 className="sec-h">{D.complex} … 추천 업체 둘러보기</h2>
          <Ann kind="bad" label="업체찾기 진입 ③/③">
            <div className="rail">
              {D.vendors.map(v => (
                <div key={v.name} style={{ flexShrink: 0, width: 292 }}>
                  <div style={{ display: 'flex', gap: 3, height: 172, borderRadius: 4, overflow: 'hidden' }}>
                    <Thumb id={v.thumb} style={{ width: 196, height: '100%' }}/>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                      <Thumb id={String(Number(v.thumb) + 1).padStart(2, '0')} style={{ width: '100%', flex: 1 }}/>
                      <Thumb id={String(Number(v.thumb) + 2).padStart(2, '0')} style={{ width: '100%', flex: 1 }}/>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 5, marginTop: 11, flexWrap: 'wrap' }}>
                    {v.tags.map((t, i) => (
                      <span key={t} style={{
                        fontSize: 11.5, fontWeight: 600, padding: '4px 8px', borderRadius: 4,
                        background: i === 0 ? '#F4F4F4' : '#EAF8F1',
                        color: i === 0 ? '#616161' : '#12855B',
                      }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 9 }}>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{v.name}</span>
                    {v.std && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ohouse-blue)' }}>✓ 오늘의집 스탠다드</span>}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 5 }}>
                    <span style={{ color: 'var(--ohouse-blue)' }}>★</span>{' '}
                    <b style={{ color: '#141414' }}>{v.rating}</b> · 리뷰 <b style={{ color: '#141414' }}>{v.reviews}</b> · 최근계약 <b style={{ color: '#141414' }}>{v.deals}</b>
                  </div>
                </div>
              ))}
            </div>
          </Ann>
          <MoreBtn/>
        </div>

        <div className="divider"/>

        {/* ⑦ 이런 시공 서비스는 어떠세요 */}
        <div className="sec">
          <h2 className="sec-h">이런 시공 서비스는 어떠세요?</h2>
          <Ann kind="bad" label="탭 전체 지도가 4번째 스크롤에 · 견적계산기 ③/④">
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 6px 0' }}>
              {D.serviceIcons.map(s => <Tile key={s.name} glyph={s.glyph} name={s.name} size={56}/>)}
            </div>
          </Ann>
          <Ann kind="bad" label="견적계산기 진입 ④/④" style={{ marginTop: 14 }}>
            <div style={{
              background: '#F5F6F7', borderRadius: 10, padding: '14px 14px',
              display: 'flex', alignItems: 'center', gap: 9,
            }}>
              <span style={{
                background: '#FF6B6B', color: '#fff', fontSize: 11, fontWeight: 800,
                borderRadius: 5, padding: '3px 7px',
              }}>NEW</span>
              <span style={{ flex: 1, fontSize: 14.5, fontWeight: 700 }}>주방 견적, 3D로 미리 계산해보세요</span>
              <Icon name="chevron" size={16} style={{ color: '#9E9E9E' }}/>
            </div>
          </Ann>
        </div>

        <div className="divider"/>

        {/* ⑧ 최신 주변 리뷰 */}
        <div className="sec">
          <h2 className="sec-h">최신 {D.region} 주변 리뷰</h2>
          <p className="sec-sub">설정된 주소지 반경 4km 내 리뷰를 보여드려요.</p>
          <div className="rail">
            {D.nearbyReviews.map(r => (
              <div key={r.title} style={{ flexShrink: 0, width: 188 }}>
                <Thumb id={r.thumb} style={{ width: '100%', height: 188, borderRadius: 4 }}/>
                <div style={{ fontSize: 14.5, fontWeight: 700, marginTop: 10, letterSpacing: '-0.03em' }}>{r.title}</div>
                <div style={{
                  fontSize: 13, color: '#3D3D3D', marginTop: 6, lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{r.body}</div>
                <div style={{ fontSize: 12, color: 'var(--text-quaternary)', marginTop: 8 }}>{r.vendor}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="divider"/>

        {/* ⑨ 직영 시공 서비스 */}
        <div className="sec">
          <h2 className="sec-h">오늘의집이 직접하는 시공 서비스</h2>
          <Ann kind="bad" label="직영시공 ②/③">
            <div className="rail">
              {D.directServices.map(s => (
                <div key={s.name} style={{
                  flexShrink: 0, width: 222, height: 235, borderRadius: 8,
                  overflow: 'hidden', position: 'relative',
                }}>
                  <Thumb id={s.thumb} style={{ width: '100%', height: '100%' }}/>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.42))',
                  }}/>
                  <div style={{ position: 'absolute', left: 14, bottom: 13, color: '#fff' }}>
                    <div style={{ fontSize: 12, opacity: 0.9 }}>{s.cat}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>{s.name}</div>
                    <div style={{ fontSize: 12.5, opacity: 0.92, marginTop: 3 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Ann>
        </div>

        {/* ⑩ 직영 시공 리뷰 */}
        <div className="sec">
          <h2 className="sec-h">실제 리뷰로 확인하는 오늘의집 직영 시공</h2>
          <Ann kind="bad" label="직영시공 ③/③">
            <div>
              <div className="chiprow" style={{ marginBottom: 14 }}>
                {['전체', '주방', '도배', '장판/마루'].map((c, i) => (
                  <span key={c} className={`chip ${i === 0 ? 'on' : ''}`}>{c}</span>
                ))}
              </div>
              <div className="rail">
                {D.beforeAfter.map(b => (
                  <div key={b.spec} style={{ flexShrink: 0, width: 268 }}>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[['전', b.before, '#4A4A4A'], ['후', b.after, '#1A86FF']].map(([lb, id, bg]) => (
                        <div key={lb} style={{ position: 'relative', flex: 1 }}>
                          <Thumb id={id} style={{ width: '100%', height: 148, borderRadius: 3 }}/>
                          <span style={{
                            position: 'absolute', top: 0, left: 0, background: bg, color: '#fff',
                            fontSize: 12, fontWeight: 700, padding: '4px 10px',
                          }}>{lb}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 14.5, fontWeight: 700, marginTop: 10 }}>{b.spec}</div>
                    <div style={{
                      fontSize: 13, color: '#3D3D3D', marginTop: 6, lineHeight: 1.5,
                      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{b.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </Ann>
          <MoreBtn/>
        </div>

        <div className="divider"/>

        {/* ⑪ 주변 인기 시공사례 */}
        <div className="sec">
          <h2 className="sec-h">{D.region} 주변 인기 시공사례</h2>
          <div className="chiprow" style={{ marginBottom: 14 }}>
            {D.caseFilters.map(c => (
              <button key={c} className={`chip ${caseFilter === c ? 'on' : ''}`}
                      onClick={() => setCaseFilter(c)}>{c}</button>
            ))}
          </div>
          <div className="rail">
            {D.cases.map(c => (
              <div key={c.title} style={{ flexShrink: 0, width: 188 }}>
                <Thumb id={c.thumb} style={{ width: '100%', height: 188, borderRadius: 4 }}/>
                <div style={{
                  fontSize: 15, fontWeight: 700, marginTop: 10, lineHeight: 1.35, letterSpacing: '-0.03em',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{c.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 6 }}>{c.meta}</div>
              </div>
            ))}
          </div>
          <MoreBtn/>
        </div>

        <div className="divider"/>

        {/* ⑫ 아파트 전체시공 견적 순위 — 재방문 자산이 최하단 */}
        <div className="sec" style={{ paddingBottom: 30 }}>
          <h2 className="sec-h">아파트 전체시공 견적 순위</h2>
          <div className="chiprow" style={{ marginBottom: 26 }}>
            {D.budgetTabs.map(t => (
              <button key={t} className={`chip ${budgetTab === t ? 'on' : ''}`}
                      onClick={() => setBudgetTab(t)}>{t}</button>
            ))}
          </div>
          <Ann kind="bad" label="재방문을 만들 유일한 데이터 — 최하단">
            <div style={{
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              gap: 16, height: 190, padding: '14px 8px 0',
            }}>
              {ranks.map((r, i) => (
                <div key={r.label} style={{ flex: 1, maxWidth: 96, textAlign: 'center' }}>
                  {r.top && <div style={{ fontSize: 15, color: '#C9CDD2', marginBottom: 2 }}>♛</div>}
                  <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 7 }}>{r.label}</div>
                  <div style={{
                    height: (r.pct / maxPct) * 108, borderRadius: '4px 4px 0 0',
                    background: r.top ? 'var(--ohouse-blue)' : '#EEEFF1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      fontSize: 16, fontWeight: 700,
                      color: r.top ? '#fff' : '#5A5F66',
                    }}>{r.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Ann>
        </div>
      </div>

      <BottomNav/>
    </div>
  );
}

window.CurrentScreen = CurrentScreen;
