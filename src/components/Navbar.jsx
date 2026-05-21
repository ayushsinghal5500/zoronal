import { useState } from 'react';
import { Menu, X, Search, Sun, Moon } from 'lucide-react';
import useThemeStore from '../store/useThemeStore';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const performSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className={`w-full transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-900 border-b border-gray-800' 
          : 'bg-white border-b border-gray-100'
      } shadow-sm`}>
        <div className="px-4 sm:px-8 md:px-16 py-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Logo Circle */}
              <div className="shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>

              {/* Logo Text */}
              <div className="block cursor-pointer" onClick={() => navigate('/')}>
                <div className="flex items-baseline gap-0.5">
                  <span className={`text-lg font-medium transition-colors ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Review
                  </span>
                  <span className="text-lg font-bold bg-linear-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                    &
                  </span>
                  <span className={`text-lg font-bold transition-colors ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    RATE
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Search, Auth Buttons & Theme Toggle */}
            <div className="flex items-center gap-4">
              {/* Mobile Search Bar */}
              <div className="md:hidden flex">
                <div className="relative w-28 flex items-center">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchSubmit}
                    className={`w-full px-3 py-2 pr-10 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <button 
                    onClick={performSearch}
                    className="absolute right-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                  >
                    <Search
                      size={16}
                      className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}
                    />
                  </button>
                </div>
              </div>

              {/* Desktop Search Bar */}
              <div className="hidden md:flex">
                <div className="relative w-80 flex items-center">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchSubmit}
                    className={`w-full px-4 py-2.5 pr-12 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <button 
                    onClick={performSearch}
                    className="absolute right-3 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                  >
                    <Search
                      size={18}
                      className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}
                    />
                  </button>
                </div>
              </div>             
              {/* Desktop Auth Buttons */}
              <div className="hidden sm:flex items-center gap-6">
                <button
                  className={`font-medium transition-colors hover:opacity-80 cursor-pointer ${
                    isDarkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  SignUp
                </button>
                <button
                  className={`px-6 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  } shadow-md hover:shadow-lg`}
                >
                  Login
                </button>
                 {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className={`sm:hidden p-2 rounded-lg transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className={`sm:hidden border-t transition-colors ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  className={`w-full py-2.5 font-medium rounded-lg transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  SignUp
                </button>
                <button
                  className={`w-full py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  } shadow-md hover:shadow-lg`}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
