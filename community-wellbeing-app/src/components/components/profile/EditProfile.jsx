import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function EditProfile({ user, onClose }) {
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    location: user.location || '',
    age: user.age || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    updateUser({
      name: formData.name,
      bio: formData.bio,
      location: formData.location,
      age: parseInt(formData.age),
    });

    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 500);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="card max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Profile
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 text-2xl transition-colors"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sage-500 focus:outline-none transition-colors"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sage-500 focus:outline-none transition-colors resize-none"
                placeholder="Tell us about yourself..."
                rows={4}
                maxLength={200}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {formData.bio.length}/200 characters
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sage-500 focus:outline-none transition-colors"
                placeholder="City, Country"
                required
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sage-500 focus:outline-none transition-colors"
                placeholder="Your age"
                min="18"
                max="100"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost flex-1"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}