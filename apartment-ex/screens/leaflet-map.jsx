// ===== Leaflet 기반 실제 지도 컴포넌트 =====
// - OpenStreetMap 타일
// - 아파트마다 마커: 작은 썸네일 + 단지명 + 사례 수
// - 가운데에 가장 가까운 단지는 "featured" 큰 팝업 (당근 새소식 스타일)
const LeafletMap = ({ apartments, getLatestCase, onSelect, selectedId, onCenterChange }) => {
  const containerRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const [pixelPos, setPixelPos] = React.useState({});
  const [featuredId, setFeaturedId] = React.useState(apartments[0]?.id);

  // Initialize map ONCE
  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const L = window.L;
    if (!L) { console.warn('Leaflet not loaded'); return; }

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
      tap: true,
    }).setView([37.5145, 127.0840], 15.5); // 잠실엘스 중심, 가까운 줌

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    const update = () => {
      const pos = {};
      apartments.forEach((a) => {
        const p = map.latLngToContainerPoint([a.lat, a.lng]);
        pos[a.id] = { x: p.x, y: p.y };
      });
      setPixelPos(pos);

      // pick nearest to center
      const c = map.getCenter();
      let closest = apartments[0];
      let bestDist = Infinity;
      apartments.forEach((a) => {
        const dx = a.lat - c.lat;
        const dy = a.lng - c.lng;
        const d = dx * dx + dy * dy;
        if (d < bestDist) { bestDist = d; closest = a; }
      });
      setFeaturedId(closest.id);
    };

    map.on('move', update);
    map.on('zoom', update);
    map.whenReady(update);

    mapRef.current = map;

    // Invalidate size after layout to ensure proper tile loading
    setTimeout(() => {
      map.invalidateSize();
      update();
    }, 100);

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Programmatic move when selected outside
  React.useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const apt = apartments.find((a) => a.id === selectedId);
    if (apt) mapRef.current.panTo([apt.lat, apt.lng], { animate: true });
  }, [selectedId]);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
      {/* Leaflet container */}
      <div ref={containerRef} style={{
        position: 'absolute', inset: 0,
        background: '#F2EFEA',
      }}/>

      {/* React-rendered marker overlays */}
      {apartments.map((a) => {
        const p = pixelPos[a.id];
        if (!p) return null;
        const isFeatured = a.id === featuredId;
        const latest = getLatestCase(a.id);

        if (isFeatured && latest) {
          return (
            <FeaturedPopup
              key={a.id}
              apt={a}
              c={latest}
              x={p.x} y={p.y}
              onClick={() => onSelect(a.id)}
            />
          );
        }
        return (
          <SmallPin
            key={a.id}
            apt={a}
            latest={latest}
            x={p.x} y={p.y}
            onClick={() => onSelect(a.id)}
          />
        );
      })}
    </div>
  );
};

// ===== Small pin (썸네일 + 단지명 + 사례수) =====
const SmallPin = ({ apt, latest, x, y, onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: 'absolute',
      left: x, top: y,
      transform: 'translate(-50%, -100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      pointerEvents: 'auto',
      zIndex: 5,
      padding: 0, background: 'transparent', border: 0,
    }}
  >
    <div style={{
      background: '#fff',
      borderRadius: 999,
      padding: '4px 10px 4px 4px',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      boxShadow: '0 4px 12px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.06)',
      fontSize: 12, fontWeight: 700, color: '#181818',
      whiteSpace: 'nowrap',
      border: '1.5px solid #fff',
    }}>
      <span style={{
        width: 24, height: 24, borderRadius: '50%',
        overflow: 'hidden', flexShrink: 0,
        background: '#eee',
      }}>
        {latest && <img src={latest.photo} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        }}/>}
      </span>
      <span>{apt.name}</span>
      <span style={{ color: '#1A86FF', fontWeight: 800 }}>{apt.cases}</span>
    </div>
    <div style={{
      width: 8, height: 8, borderRadius: '50%',
      background: '#fff',
      marginTop: -1,
      boxShadow: '0 2px 3px rgba(0,0,0,0.2)',
    }}/>
  </button>
);

// ===== Featured popup (당근 새소식 스타일) =====
const FeaturedPopup = ({ apt, c, x, y, onClick }) => {
  const ago = c.daysAgo === 1 ? '1일 전' : `${c.daysAgo}일 전`;
  const authorLabel = c.author === 'contractor' ? '시공업체' : '집들이';
  const authorColor = c.author === 'contractor' ? '#FF7900' : '#1A86FF';
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        left: x, top: y,
        transform: 'translate(-50%, calc(-100% - 8px))',
        background: '#fff',
        borderRadius: 16,
        padding: 10,
        boxShadow: '0 8px 24px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.06)',
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        width: 240,
        textAlign: 'left',
        pointerEvents: 'auto',
        zIndex: 6,
        border: 0,
        cursor: 'pointer',
      }}
    >
      <img src={c.photo} alt="" style={{
        width: 60, height: 60, borderRadius: 10, objectFit: 'cover', flexShrink: 0,
      }}/>
      <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{
            fontSize: 10, fontWeight: 800, color: authorColor,
            background: authorColor + '1a',
            padding: '2px 6px', borderRadius: 4,
          }}>{authorLabel}</span>
          <span style={{ fontSize: 11, color: '#9D9D9D', fontWeight: 500 }}>{ago}</span>
        </div>
        <div style={{
          fontSize: 13, fontWeight: 700, color: '#181818',
          letterSpacing: '-0.02em', lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{c.title}</div>
        <div style={{ fontSize: 11, color: '#1A86FF', fontWeight: 700, marginTop: 4 }}>
          {apt.name} · 사례 {apt.cases}
        </div>
      </div>
      {/* tail pointer */}
      <div style={{
        position: 'absolute', left: '50%', bottom: -7,
        transform: 'translateX(-50%) rotate(45deg)',
        width: 14, height: 14, background: '#fff',
        boxShadow: '3px 3px 4px rgba(0,0,0,0.06)',
        zIndex: -1,
      }}/>
      {/* my-location pin underneath */}
      <div style={{
        position: 'absolute', left: '50%', bottom: -22,
        transform: 'translateX(-50%)',
        width: 14, height: 14, borderRadius: '50%',
        background: '#1A86FF',
        boxShadow: '0 0 0 4px rgba(26,134,255,0.2), 0 0 0 2px #fff',
      }}/>
    </button>
  );
};

window.LeafletMap = LeafletMap;
