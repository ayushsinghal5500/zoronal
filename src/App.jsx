import { useEffect } from 'react';
import useThemeStore from './store/useThemeStore';
import AppRoutes from './routes/AppRoutes';

function App() {
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return <AppRoutes />;
}

export default App;
