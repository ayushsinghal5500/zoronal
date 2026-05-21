import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useThemeStore from '../../store/useThemeStore';

export const CompanyCardSkeleton = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <SkeletonTheme
      baseColor={isDarkMode ? '#1f2937' : '#f3f4f6'}
      highlightColor={isDarkMode ? '#374151' : '#e5e7eb'}
    >
      <div className={`w-full p-5 mb-6 rounded-2xl border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="shrink-0 mx-auto sm:mx-0">
            <Skeleton width={80} height={80} borderRadius={16} className="md:w-24 md:h-24" />
          </div>
          <div className="flex-1 w-full flex flex-col gap-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1">
              <Skeleton width={150} height={24} />
              <Skeleton width={100} height={14} />
            </div>
            <Skeleton width="80%" height={16} />
            <Skeleton count={2} height={12} />
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto pt-2">
              <Skeleton width={180} height={40} borderRadius={12} />
              <Skeleton width={120} height={40} borderRadius={12} />
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export const ReviewCardSkeleton = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <SkeletonTheme
      baseColor={isDarkMode ? '#1f2937' : '#f3f4f6'}
      highlightColor={isDarkMode ? '#374151' : '#e5e7eb'}
    >
      <div className={`p-6 md:p-8 rounded-3xl border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-50'}`}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Skeleton circle width={48} height={48} />
              <div>
                <Skeleton width={120} height={18} />
                <Skeleton width={80} height={12} />
                <Skeleton width={60} height={10} />
              </div>
            </div>
            <Skeleton width={80} height={16} />
          </div>
          <Skeleton count={3} height={14} />
          <div className="flex items-center gap-8 mt-2 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Skeleton width={60} height={16} />
            <Skeleton width={60} height={16} />
            <Skeleton width={60} height={16} />
            <Skeleton width={60} height={16} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export const CompanyDetailHeaderSkeleton = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <SkeletonTheme
      baseColor={isDarkMode ? '#1f2937' : '#f3f4f6'}
      highlightColor={isDarkMode ? '#374151' : '#e5e7eb'}
    >
      <div className={`p-6 md:p-8 rounded-3xl border shadow-sm mb-8 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="shrink-0 mx-auto md:mx-0">
            <Skeleton width={96} height={96} borderRadius={16} className="md:w-28 md:h-28" />
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
              <Skeleton width={200} height={32} />
              <Skeleton width={120} height={14} />
            </div>
            <Skeleton width="60%" height={20} className="mb-4" />
            <Skeleton count={2} height={14} className="mb-6" />
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <Skeleton width={150} height={24} />
              </div>
              <Skeleton width={140} height={40} borderRadius={8} />
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};
