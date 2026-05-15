// Shared bottom navigation — uses Ohouse design system SVG assets
const BottomNav = ({ active = '집구경' }) => {
  const items = [
    { name: '홈', src: 'assets/icons/icon-home.svg' },
    { name: '집구경', src: 'assets/icons/icon-home-tour.svg' },
    { name: '쇼핑', src: 'assets/icons/icon-shopping.svg' },
    { name: '인테리어/생활', src: 'assets/icons/icon-interior.svg' },
    { name: '마이페이지', src: 'assets/icons/icon-user.svg' },
  ];
  return (
    <div className="bottomnav">
      {items.map((it) => {
        const isActive = active === it.name;
        return (
          <button key={it.name} className={isActive ? 'active' : ''}>
            <img
              src={it.src}
              alt=""
              width={24}
              height={24}
              style={{
                opacity: isActive ? 1 : 0.55,
                display: 'block',
              }}
            />
            <span style={{
              fontSize: 10,
              marginTop: 2,
              letterSpacing: '-0.02em',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#141414' : '#9D9D9D',
            }}>{it.name}</span>
          </button>
        );
      })}
    </div>
  );
};

window.BottomNav = BottomNav;
