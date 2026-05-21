import { MapPin } from 'lucide-react';
import useThemeStore from '../store/useThemeStore';
import { Link } from 'react-router-dom';
import PreciseStarRating from './common/PreciseStarRating';
import { companies } from '../data/companies';

const CompanyCard = ({ company }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  
  if (!company) return null;

  // Map API fields to internal variables with fallbacks
  const name = company.companyName || company.name || 'Unknown Company';
  const address = company.location ? `${company.location}${company.city ? `, ${company.city}` : ''}` : (company.address || 'No address provided');
  
  // Format Date
  const rawDate = company.foundedOn || company.foundedDate;
  const foundedDate = rawDate ? new Date(rawDate).toLocaleDateString('en-GB') : 'N/A';
  
  const rating = company.averageRating !== undefined ? company.averageRating : (company.rating || 0);
  const reviewsCount = company.totalReviews !== undefined ? company.totalReviews : (company.reviews || 0);
  const logo = company.logo;
  const id = company._id || company.id;

  // Helper to determine if logo is an image or text
  const isImageLogo = logo && (logo.startsWith('http') || logo.includes('/') || logo.includes('.'));

  return (
    <div className={`w-full p-5 mb-6 rounded-2xl border shadow-sm transition-all hover:shadow-md ${
      isDarkMode 
        ? 'bg-gray-900 border-gray-800 text-white' 
        : 'bg-white border-gray-100 text-gray-900'
    }`}>
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        
        {/* Company Logo Section - Adaptive size */}
        <div className="shrink-0 mx-auto sm:mx-0">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#0f172a] flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-inner overflow-hidden">
            {isImageLogo ? (
              <img src={logo.startsWith('http') ? logo : `http://localhost:5002${logo}`} alt={name} className="w-full h-full object-cover" />
            ) : (
              logo || name.charAt(0).toUpperCase()
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 w-full flex flex-col gap-2">
          {/* Top Header: Name and Foundation Date */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1">
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-center sm:text-left w-full md:w-auto">
              {name}
            </h3>
            <span className={`text-[10px] md:text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} whitespace-nowrap self-center md:self-auto`}>
              Founded on {foundedDate}
            </span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-1.5 mb-2">
            <MapPin size={14} className="mt-0.5 text-purple-500 shrink-0" />
            <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} leading-relaxed`}>
              {address}
            </p>
          </div>

          {/* Description */}
          {company.description && (
            <p className={`text-xs line-clamp-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {company.description}
            </p>
          )}

          {/* Bottom Footer: Ratings and Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto">
            {/* Rating and Reviews Group */}
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-xl w-full sm:w-auto justify-center sm:justify-start">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base md:text-lg">{rating}</span>
                <PreciseStarRating rating={rating} size={16} />
              </div>
              <div className={`h-4 w-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <span className={`text-xs md:text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {reviewsCount} Reviews
              </span>
            </div>

            {/* Detail Review Button - Full width on small mobile */}
            <Link 
              to={`/company/${id}`}
              className={`w-full sm:w-auto px-8 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg flex items-center justify-center cursor-pointer ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white shadow-black/20' 
                  : 'bg-[#1a1a1a] hover:bg-black text-white shadow-gray-200'
              }`}
            >
              Detail Review
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
