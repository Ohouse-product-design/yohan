// Icon set — outline iconography matching Ohouse
const Icon = ({ name, size = 22, stroke = 2 }) => {
  const s = size;
  const w = stroke;
  const props = {
    width: s, height: s,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: w,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  const map = {
    back: <path d="M15 18l-6-6 6-6"/>,
    close: <><path d="M6 6l12 12"/><path d="M6 18L18 6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></>,
    bell: <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    bookmark: <path d="M6 3h12v18l-6-4-6 4V3z"/>,
    cart: <><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.5 12h12L22 7H6"/></>,
    menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    chevron: <path d="M9 6l6 6-6 6"/>,
    chevronDown: <path d="M6 9l6 6 6-6"/>,
    chevronUp: <path d="M6 15l6-6 6 6"/>,
    home: <><path d="M3 11l9-8 9 8"/><path d="M5 10v11h14V10"/></>,
    house: <><path d="M3 11l9-8 9 8v10H3z"/><path d="M9 21V14h6v7"/></>,
    shop: <><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9h16v11H4z"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 1 1 16 0v1"/></>,
    interior: <><path d="M4 10h16v9H4z"/><path d="M4 10l8-6 8 6"/><path d="M9 19v-5h6v5"/></>,
    map: <><path d="M9 4l-6 3v13l6-3 6 3 6-3V4l-6 3z"/><path d="M9 4v13"/><path d="M15 7v13"/></>,
    pin: <><path d="M12 22s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12z"/><circle cx="12" cy="10" r="3"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    heart: <path d="M12 21s-7-5-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6-7 11-7 11z"/>,
    heartFill: <path d="M12 21s-7-5-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6-7 11-7 11z" fill="currentColor"/>,
    share: <><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8 11l8-4"/><path d="M8 13l8 4"/></>,
    chat: <path d="M21 12a8 8 0 0 1-12 7l-5 1 1-5A8 8 0 1 1 21 12z"/>,
    plan: <><path d="M3 4h18v16H3z"/><path d="M3 10h12"/><path d="M9 10v10"/><path d="M15 4v12"/><path d="M15 16h6"/></>,
    photo: <><path d="M4 5h16v14H4z"/><circle cx="9" cy="10" r="2"/><path d="M4 17l5-5 5 5 3-3 3 3"/></>,
    location: <path d="M12 22s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12z"/>,
    locationFill: <><path d="M12 22s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12z" fill="currentColor" stroke="currentColor"/><circle cx="12" cy="10" r="2.5" fill="#fff" stroke="#fff"/></>,
    locationPin: <><path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.4"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.5" r="0.6" fill="currentColor"/></>,
    check: <path d="M5 12l5 5L20 7"/>,
    smile: <><circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/><path d="M8 14c1 2 3 3 4 3s3-1 4-3"/></>,
    sparkle: <><path d="M12 3v6"/><path d="M12 15v6"/><path d="M3 12h6"/><path d="M15 12h6"/><path d="M6 6l3 3"/><path d="M15 15l3 3"/><path d="M6 18l3-3"/><path d="M15 9l3-3"/></>,
    filter: <><path d="M3 6h18"/><path d="M6 12h12"/><path d="M10 18h4"/></>,
    layers: <><path d="M12 2L2 8l10 6 10-6-10-6z"/><path d="M2 14l10 6 10-6"/></>,
    pages: <><path d="M4 4h12v16H4z"/><path d="M8 8h12v12"/></>,
    apartment: <><path d="M5 21V8l7-5 7 5v13"/><path d="M9 21v-6h6v6"/><path d="M9 11h.01"/><path d="M12 11h.01"/><path d="M15 11h.01"/></>,
    chevDownThin: <path d="M6 9l6 6 6-6" strokeWidth="1.6"/>,
  };
  return <svg {...props}>{map[name]}</svg>;
};

window.Icon = Icon;
