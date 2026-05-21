import { Star } from 'lucide-react';

const PreciseStarRating = ({ rating, size = 16 }) => {
  return (
    <div className="flex gap-0.5 items-center">
      {[...Array(5)].map((_, i) => {
        // Calculate how much of this specific star should be filled (0 to 100)
        const fillPercent = Math.max(0, Math.min(100, (rating - i) * 100));
        
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            {/* Background Gray Star */}
            <Star 
              size={size} 
              className="text-gray-300 absolute top-0 left-0" 
            />
            
            {/* Foreground Yellow Star with precise clipping */}
            <div 
              className="absolute top-0 left-0 overflow-hidden transition-all duration-300" 
              style={{ width: `${fillPercent}%` }}
            >
              <Star 
                size={size} 
                className="fill-yellow-400 text-yellow-400" 
                style={{ minWidth: size }} // Ensure star doesn't shrink when container narrows
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PreciseStarRating;
