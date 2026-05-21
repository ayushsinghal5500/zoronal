import { useState, useEffect } from 'react';
import { MapPin, Plus, Search, ChevronDown } from 'lucide-react';
import useThemeStore from '../store/useThemeStore';
import Modal from './Modal';

const Hero = ({ onCompanyAdded, onSearch, onSort, initialSearch = '' }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('Name');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    if (onSort) onSort(value);
  };

  return (
    <div className={`w-full pt-5 pb-0 px-4 sm:px-8 md:px-24 ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}>
      <div className="max-w-360 mx-auto">
        <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between gap-4 w-full">
          
          {/* Left Side: Search and Add Group */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch md:items-end gap-3 md:gap-4 flex-1">
            
            {/* Mobile Row 1: Search Input + Find Button */}
            <div className="flex items-end gap-2 flex-1 md:flex-[0.8] lg:flex-[0.6]">
              <div className="flex-1">
                <label className={`block mb-1.5 text-xs md:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Search Company or Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, city, location..."
                    className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                  <MapPin
                    size={16}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="h-10.5 px-6 bg-linear-to-r from-purple-500 to-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap text-sm flex items-center justify-center cursor-pointer"
              >
                <span className="hidden sm:inline">Find Company</span>
                <Search size={18} className="sm:hidden" />
              </button>
            </div>

            {/* Mobile Row 2: Add + Sort (Mobile) / Add Button (Desktop) */}
            <div className="flex items-end gap-3 md:gap-4 flex-1 md:flex-none">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex-1 md:flex-none px-6 py-2.5 bg-linear-to-r from-purple-500 to-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap text-sm h-10.5 cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Company</span>
              </button>

              {/* Sort Dropdown (Visible only on Mobile here) */}
              <div className="md:hidden w-32 shrink-0">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className={`w-full px-3 py-2.5 rounded-xl border appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm h-10.5 cursor-pointer ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="Name">Name</option>
                    <option value="Rating">Rating</option>
                    <option value="Newest">Newest</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Sort Dropdown (Visible only on Desktop here) */}
          <div className="hidden md:block w-40">
            <label className={`block mb-1.5 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sort:
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className={`w-full px-4 py-2.5 rounded-xl border appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm h-10.5 cursor-pointer ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <option value="Name">Name</option>
                <option value="Rating">Rating</option>
                <option value="Newest">Newest</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
            </div>
          </div>

        </div>
        
        {/* Bottom Border Line */}
        <div className={`mt-12 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}></div>
      </div>

      {/* Add Company Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={onCompanyAdded}
      />
    </div>
  );
};

export default Hero;
