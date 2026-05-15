// ===== App root with stack navigation =====
const SCREENS = {
  feed: window.FeedScreen,
  map: window.MapScreen,
  complex: window.ComplexScreen,
  cdp: window.CdpScreen,
  compose: window.ComposeScreen,
  aptPicker: window.AptPickerScreen,
  publishDone: window.PublishDoneScreen,
  room3d: window.Room3dScreen,
};

function App() {
  const [stack, setStack] = React.useState([
    { id: 's0', screen: 'feed', params: {} },
  ]);

  const nav = React.useMemo(() => ({
    push: (screen, params = {}) => {
      setStack((s) => [...s, { id: 's' + Date.now() + Math.random(), screen, params }]);
    },
    pop: () => {
      setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
    },
    replace: (screen, params = {}) => {
      setStack((s) => [...s.slice(0, -1), { id: 's' + Date.now() + Math.random(), screen, params }]);
    },
    reset: (screen, params = {}) => {
      setStack([{ id: 's0', screen, params }]);
    },
  }), []);

  // Expose for debugging / global access
  React.useEffect(() => { window.__nav = nav; }, [nav]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {stack.map((entry, i) => {
        const ScreenComp = SCREENS[entry.screen];
        if (!ScreenComp) return null;
        const isTop = i === stack.length - 1;
        return (
          <div
            key={entry.id}
            className={`stack ${isTop ? '' : 'behind'}`}
            style={{ zIndex: 10 + i }}
          >
            <ScreenComp nav={nav} params={entry.params}/>
          </div>
        );
      })}
    </div>
  );
}

// Mount inside iOS frame
function Root() {
  // Scale device to fit viewport
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const compute = () => {
      const dw = 402;
      const dh = 874;
      const margin = 40;
      const sx = (window.innerWidth - margin) / dw;
      const sy = (window.innerHeight - margin) / dh;
      setScale(Math.min(1.05, Math.min(sx, sy)));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#2a2a2e',
      overflow: 'hidden',
    }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <IOSDevice width={402} height={874}>
          <App/>
        </IOSDevice>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root/>);
