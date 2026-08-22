// Outline icon set matching Ohouse iconography
const Icon = ({ name, size = 22, stroke = 1.9, style }) => {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: stroke,
    strokeLinecap: 'round', strokeLinejoin: 'round', style,
  };
  const map = {
    menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></>,
    bell: <><path d="M6 9a6 6 0 1 1 12 0c0 6 2.5 6 2.5 8h-17C3.5 15 6 15 6 9z"/><path d="M10 20a2 2 0 0 0 4 0"/></>,
    bookmark: <path d="M6.5 3.5h11v17l-5.5-3.8-5.5 3.8v-17z"/>,
    cart: <><circle cx="9.5" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M3 4.5h2.2l2.4 11.2h11L21 8H6"/></>,
    chevron: <path d="M9.5 5.5l6.5 6.5-6.5 6.5"/>,
    chevronDown: <path d="M6 9.5l6 6 6-6"/>,
    pin: <><path d="M12 21.5s-6.5-6-6.5-11.5a6.5 6.5 0 0 1 13 0c0 5.5-6.5 11.5-6.5 11.5z"/><circle cx="12" cy="10" r="2.4"/></>,
    check: <path d="M5 12.5l4.6 4.6L19 7.5"/>,
    plus: <><path d="M12 5.5v13"/><path d="M5.5 12h13"/></>,
    calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17"/><path d="M8 3v4"/><path d="M16 3v4"/></>,
    trendDown: <><path d="M3.5 7.5l6.5 6.5 4-4 6.5 6.5"/><path d="M20.5 12v4.5H16"/></>,
    sparkle: <><path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9-1.9 5.1-1.9-5.1L5 10.5l5.1-1.9z"/><path d="M18.5 16.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></>,
    edit: <><path d="M4 20h4.5L19 9.5a2.5 2.5 0 0 0-3.5-3.5L5 16.5V20z"/><path d="M14.5 7L17 9.5"/></>,
  };
  return <svg {...props}>{map[name]}</svg>;
};
window.Icon = Icon;
