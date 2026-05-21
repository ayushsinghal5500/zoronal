import { useState } from 'react';
import { X, MapPin, Calendar } from 'lucide-react';
import useThemeStore from '../store/useThemeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { createCompany } from '../api/AppApi';
import toast from 'react-hot-toast';

const Modal = ({ isOpen, onClose, onSuccess }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [formData, setFormData] = useState({
    companyName: '',
    location: '',
    foundedOn: '',
    city: '',
    description: '',
    logo: null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo') {
      setFormData(prev => ({
        ...prev,
        logo: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Date validation - foundedOn should not be in the future
    const foundedDate = new Date(formData.foundedOn);
    const today = new Date();
    if (foundedDate > today) {
      toast.error("Foundation date cannot be in the future");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('companyName', formData.companyName);
      data.append('location', formData.location);
      data.append('foundedOn', formData.foundedOn);
      data.append('city', formData.city);
      data.append('description', formData.description);
      if (formData.logo) {
        data.append('logo', formData.logo);
      }

      const response = await createCompany(data);
      toast.success('Company created successfully!');
      
      // Trigger refresh in parent
      if (onSuccess) onSuccess();

      // Reset form and close modal
      setFormData({
        companyName: '',
        location: '',
        foundedOn: '',
        city: '',
        description: '',
        logo: null
      });
      onClose();
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error('Failed to add company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
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
            {/* Visual circle from the image */}
            <div className="absolute top-7.4 left-7.5 w-32 h-32 bg-linear-to-br from-purple-600 to-purple-800 rounded-full opacity-90"></div>
            <div className="absolute top-2.5 left-12.6 w-16 h-16 bg-purple-200/40 rounded-full blur-sm"></div>
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

          <div className="relative pt-12 pb-8 px-6">
            <h2 className="text-xl font-bold text-center mb-6">Add Company</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Company Name */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Company name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter..."
                  required
                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-300'
                  }`}
                />
              </div>

              {/* Location */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Select Location"
                    required
                    className={`w-full px-3 py-2 pr-9 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-300'
                    }`}
                  />
                  <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Founded On and City Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Founded on
                  </label>
                  <input
                    type="date"
                    name="foundedOn"
                    value={formData.foundedOn}
                    onChange={handleChange}
                    onClick={(e) => e.target.showPicker?.()}
                    max={new Date().toISOString().split("T")[0]}
                    required
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                    style={{
                      colorScheme: isDarkMode ? 'dark' : 'light'
                    }}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter City"
                    required
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-300'
                    }`}
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Logo Image (Optional)
                </label>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleChange}
                  className={`w-full px-3 py-1.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Company Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about the company..."
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-300'
                  }`}
                />
              </div>

              {/* Buttons Section */}
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95 cursor-pointer ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
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

export default Modal;
