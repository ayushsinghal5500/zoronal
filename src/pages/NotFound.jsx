import { Link } from 'react-router-dom';
import useThemeStore from '../store/useThemeStore';

const NotFound = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <main className={`min-h-[calc(100vh-96px)] flex items-center justify-center px-4 ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-md w-full text-center">
        <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
          404 Error
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Page not found
        </h1>
        <p className={`text-sm md:text-base leading-relaxed mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-linear-to-r from-purple-500 to-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
