import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useThemeStore from '../store/useThemeStore';
import { Toaster } from 'react-hot-toast';

const AppLayout = ({ showHeader = true }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <div className={`transition-colors duration-300 min-h-screen ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: isDarkMode ? '#1f2937' : '#fff',
            color: isDarkMode ? '#fff' : '#1f2937',
            borderRadius: '12px',
          },
        }}
      />
      {showHeader ? <Navbar /> : null}
      <Outlet />
    </div>
  );
};

export default AppLayout;
