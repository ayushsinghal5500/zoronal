import { useState } from 'react';
import { X, Star } from 'lucide-react';
import useThemeStore from '../store/useThemeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { addReview, addCommentToReview } from '../api/AppApi';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ReviewModal = ({ isOpen, onClose, onSuccess, hideRating = false, title = "Add Review", reviewId = null }) => {
  const { id: companyId } = useParams();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    subject: '',
    reviewText: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hideRating && rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setLoading(true);
    try {
      if (hideRating && reviewId) {
        // Comment mode
        const payload = {
          fullName: formData.fullName,
          commentText: formData.reviewText // Using reviewText field for comment
        };
        await addCommentToReview(reviewId, payload);
        toast.success('Comment added successfully!');
      } else {
        // Review mode
        const payload = {
          companyId,
          fullName: formData.fullName,
          subject: formData.subject,
          reviewText: formData.reviewText,
          rating
        };
        await addReview(payload);
        toast.success('Review added successfully!');
      }
      
      // Reset and close
      setFormData({ fullName: '', subject: '', reviewText: '' });
      setRating(0);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getRatingLabel = (val) => {
    if (val <= 1) return 'Poor';
    if (val <= 2) return 'Fair';
    if (val <= 3) return 'Good';
    if (val <= 4) return 'Satisfied';
    return 'Excellent';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className={`relative w-full max-w-sm overflow-hidden rounded-4xl shadow-2xl ${
            isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
          }`}
        >
          {/* Top Decorative Design */}
          <div className="absolute top-0 left-0 w-full h-24 overflow-hidden pointer-events-none">
            <div className="absolute top-7.5 left-7.5 w-32 h-32 bg-linear-to-br from-purple-600 to-purple-800 rounded-full opacity-90"></div>
            <div className="absolute top-2.5 left-12.5 w-16 h-16 bg-linear-to-r from-purple-200/40 to-transparent rounded-full blur-sm"></div>
          </div>

          {/* Close Button (Top Corner) */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1 rounded-full transition-colors z-10 cursor-pointer ${
              isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X size={18} />
          </button>

          <div className="relative pt-12 pb-8 px-6 md:px-8">
            <h2 className={`text-xl font-bold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter"
                  required
                  className={`w-full px-4 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-300'
                  }`}
                />
              </div>

              {/* Subject */}
              {!hideRating && (
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter"
                    required
                    className={`w-full px-4 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-300'
                    }`}
                  />
                </div>
              )}

              {/* Review Text */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {hideRating ? 'Enter your Comment' : 'Enter your Review'}
                </label>
                <textarea
                  name="reviewText"
                  value={formData.reviewText}
                  onChange={handleChange}
                  placeholder="Description"
                  rows={3}
                  required
                  className={`w-full px-4 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-300'
                  }`}
                />
              </div>

              {/* Star Rating */}
              {!hideRating && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className={`block text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Rating
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          disabled={loading}
                          className="transition-transform active:scale-110 cursor-pointer"
                          onClick={() => setRating(star)}
                        >
                          <Star
                            size={28}
                            className={`${
                              rating >= star
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {getRatingLabel(rating)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Footer Buttons Section */}
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95 cursor-pointer ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 hover:bg-200 text-gray-600'
                  }`}
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-2.5 bg-linear-to-r from-purple-500 to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95 text-sm ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewModal;
