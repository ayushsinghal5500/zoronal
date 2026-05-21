import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Star, Plus, ThumbsUp, ThumbsDown, Share2, MessageCircle, ChevronDown } from 'lucide-react';
import { useParams } from 'react-router-dom';
import useThemeStore from '../store/useThemeStore';
import ReviewModal from '../components/ReviewModal';
import { getSingleCompany, getReviews, likeReview, dislikeReview } from '../api/AppApi';
import PreciseStarRating from '../components/common/PreciseStarRating';
import { ReviewCardSkeleton, CompanyDetailHeaderSkeleton } from '../components/common/Skeletons';
import toast from 'react-hot-toast';

// Separate Review Card Component to handle local interactions
const ReviewCard = ({ review, isDarkMode, onCommentClick }) => {
  const [likes, setLikes] = useState(review.likes || 0);
  const [dislikes, setDislikes] = useState(review.dislikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      if (isLiked) {
        // Unlike action
        await likeReview(review._id, 'unlike');
        setLikes(prev => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        // Like action
        await likeReview(review._id, 'like');
        setLikes(prev => prev + 1);
        setIsLiked(true);
        // If it was disliked, undislike it locally
        if (isDisliked) {
          await dislikeReview(review._id, 'undislike');
          setDislikes(prev => Math.max(0, prev - 1));
          setIsDisliked(false);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDislike = async () => {
    try {
      if (isDisliked) {
        // Undislike action
        await dislikeReview(review._id, 'undislike');
        setDislikes(prev => Math.max(0, prev - 1));
        setIsDisliked(false);
      } else {
        // Dislike action
        await dislikeReview(review._id, 'dislike');
        setDislikes(prev => prev + 1);
        setIsDisliked(true);
        // If it was liked, unlike it locally
        if (isLiked) {
          await likeReview(review._id, 'unlike');
          setLikes(prev => Math.max(0, prev - 1));
          setIsLiked(false);
        }
      }
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: review.fullName || review.user || 'Company Review',
      text: review.reviewText || review.comment,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className={`p-6 md:p-8 rounded-3xl border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-50'}`}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
              {(review.fullName || review.user || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-lg leading-tight">{review.fullName || review.user}</h4>
              <p className={`text-xs font-semibold text-purple-600 mt-0.5`}>{review.subject}</p>
              <p className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {new Date(review.createdAt || review.date).toLocaleString('en-GB')}
              </p>
            </div>
          </div>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
        </div>
        <p className={`text-sm md:text-base leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {review.reviewText || review.comment}
        </p>

        {/* Interaction Buttons */}
        <div className="flex items-center gap-4 sm:gap-8 mt-2 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105 cursor-pointer ${isLiked ? 'text-purple-600' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
          >
            <ThumbsUp size={16} className={isLiked ? 'fill-purple-600' : ''} />
            <span>{likes} Like</span>
          </button>
          
          <button 
            onClick={handleDislike}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105 cursor-pointer ${isDisliked ? 'text-red-500' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
          >
            <ThumbsDown size={16} className={isDisliked ? 'fill-red-500' : ''} />
            <span>{dislikes} Dislike</span>
          </button>

          <button 
            onClick={onCommentClick}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105 hover:text-purple-600 cursor-pointer ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
          >
            <MessageCircle size={16} />
            <span>Comment</span>
          </button>

          <button 
            onClick={handleShare}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105 hover:text-purple-600 cursor-pointer ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>

        {/* Comments Section */}
        {review.comments && review.comments.length > 0 && (
          <div className="mt-4 space-y-3">
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`text-xs font-bold flex items-center gap-1 cursor-pointer ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              {showComments ? 'Hide Comments' : `Show ${review.comments.length} Comments`}
              <ChevronDown size={14} className={`transition-transform ${showComments ? 'rotate-180' : ''}`} />
            </button>
            
            {showComments && (
              <div className="pl-4 border-l-2 border-gray-100 dark:border-gray-800 space-y-4 mt-2">
                {review.comments.map((comment, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">{comment.fullName}</span>
                      <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(comment.createdAt).toLocaleString('en-GB')}
                      </span>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {comment.commentText}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CompanyDetail = () => {
  const { id } = useParams();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCommentMode, setIsCommentMode] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewSort, setReviewSort] = useState('Newest');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const observer = useRef();

  const fetchCompanyData = async () => {
    try {
      const response = await getSingleCompany(id);
      setCompany(response.data.data);
    } catch (error) {
      console.error('Error fetching company:', error);
    }
  };

  const fetchReviewsData = async (pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) setLoadingReviews(true);
    try {
      const response = await getReviews(id, pageNum, 10);
      const { data, totalPages } = response.data;
      
      let newList = data || [];
      
      if (isLoadMore) {
        setReviews(prev => [...prev, ...newList]);
      } else {
        setReviews(newList);
      }
      
      setHasMore(pageNum < totalPages);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const lastReviewRef = useCallback(node => {
    if (loading || loadingReviews) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          fetchReviewsData(nextPage, true);
          return nextPage;
        });
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingReviews, hasMore, id]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchCompanyData(),
      fetchReviewsData(1, false)
    ]);
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchData();
  }, [id]);

  useEffect(() => {
    // Note: In a real app with server-side pagination, 
    // sorting would ideally be handled by the backend.
    // For now, we'll keep the current list but maybe re-fetch if sort changes.
    setPage(1);
    fetchReviewsData(1, false);
  }, [reviewSort]);

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-360 mx-auto px-4 sm:px-6 py-8">
          <CompanyDetailHeaderSkeleton />
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <p>Company not found</p>
      </div>
    );
  }

  // Map API fields
  const name = company.companyName || company.name;
  const address = company.location ? `${company.location}${company.city ? `, ${company.city}` : ''}` : company.address;
  const foundedDate = company.foundedOn ? new Date(company.foundedOn).toLocaleDateString('en-GB') : (company.foundedDate || 'N/A');
  const rating = company.averageRating !== undefined ? company.averageRating : (company.rating || 0);
  const totalReviews = company.totalReviews !== undefined ? company.totalReviews : (company.reviews || 0);
  const logo = company.logo;
  const isImageLogo = logo && (logo.startsWith('http') || logo.includes('/') || logo.includes('.'));

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-360 mx-auto px-4 sm:px-6 py-8">
        {/* Company Header Card */}
        <div className={`p-6 md:p-8 rounded-3xl border shadow-sm mb-8 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0 mx-auto md:mx-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-[#0f172a] flex items-center justify-center text-white text-5xl md:text-6xl font-bold overflow-hidden">
                {isImageLogo ? (
                  <img src={logo.startsWith('http') ? logo : `http://localhost:5002${logo}`} alt={name} className="w-full h-full object-cover" />
                ) : (
                  logo || name.charAt(0).toUpperCase()
                )}
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center md:text-left w-full md:w-auto">
                  {name}
                </h1>
                <span className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} whitespace-nowrap self-center md:self-auto`}>
                  Founded on {foundedDate}
                </span>
              </div>

              <div className="flex items-start gap-1.5 mb-4 justify-center md:justify-start">
                <MapPin size={16} className="mt-0.5 text-purple-500 shrink-0" />
                <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} leading-relaxed text-center md:text-left`}>
                  {address}
                </p>
              </div>

              {/* Company Description */}
              {company.description && (
                <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center md:text-left`}>
                  {company.description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-xl md:text-2xl">{rating}</span>
                  <PreciseStarRating rating={rating} size={20} />
                  <span className={`text-sm md:text-base font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {totalReviews} Reviews
                  </span>
                </div>

                <button 
                  onClick={() => {
                    setIsCommentMode(false);
                    setSelectedReviewId(null);
                    setIsReviewModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-6 py-2 bg-linear-to-r from-purple-500 to-purple-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Plus size={16} />
                  Add Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter and Sort */}
        <div className="flex justify-between items-center mb-6 px-2">
          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Result Found: {reviews.length}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Sort:</span>
            <div className="relative">
              <select
                value={reviewSort}
                onChange={(e) => setReviewSort(e.target.value)}
                className={`pl-2 pr-8 py-1 rounded-lg border appearance-none text-xs transition-all focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                  isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-900'
                }`}
              >
                <option value="Newest">Newest</option>
                <option value="Rating">Rating</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review, index) => {
              if (reviews.length === index + 1) {
                return (
                  <div ref={lastReviewRef} key={review._id || review.id}>
                    <ReviewCard 
                      review={review} 
                      isDarkMode={isDarkMode} 
                      onCommentClick={() => {
                        setIsCommentMode(true);
                        setSelectedReviewId(review._id);
                        setIsReviewModalOpen(true);
                      }}
                    />
                  </div>
                );
              } else {
                return (
                  <ReviewCard 
                    key={review._id || review.id} 
                    review={review} 
                    isDarkMode={isDarkMode} 
                    onCommentClick={() => {
                      setIsCommentMode(true);
                      setSelectedReviewId(review._id);
                      setIsReviewModalOpen(true);
                    }}
                  />
                );
              }
            })
          ) : (
            <div className={`text-center py-10 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              No reviews yet. Be the first to review!
            </div>
          )}
        </div>

        {/* Loading More Indicator */}
        {loadingReviews && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        )}
      </div>

      {/* Review/Comment Modal */}
      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => {
          setIsReviewModalOpen(false);
          setIsCommentMode(false);
          setSelectedReviewId(null);
        }} 
        onSuccess={fetchData}
        hideRating={isCommentMode}
        title={isCommentMode ? "Add Comment" : "Add Review"}
        reviewId={selectedReviewId}
      />
    </div>
  );
};

export default CompanyDetail;
