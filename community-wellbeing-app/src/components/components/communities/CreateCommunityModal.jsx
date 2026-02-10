import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { connectionService } from '../../../services/connectionService';
import { INTEREST_OPTIONS } from '../../../utils/mockData';

export default function CreateCommunityModal({ isOpen, onClose, onCommunityCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    interests: [],
    verified: false
  });
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [step, setStep] = useState(1); // 1: Create form, 2: Invite users

  useEffect(() => {
    if (isOpen && step === 2 && user?.id) {
      loadConnectedUsers();
    }
  }, [isOpen, step, user?.id]);

  const loadConnectedUsers = async () => {
    setLoadingConnections(true);
    try {
      // Get user's connections from backend
      const response = await connectionService.getConnections(user.id);
      const connectionIds = response.connections || [];
      
      // Fetch user details for each connection
      const { searchService } = await import('../../../services/searchService');
      const usersPromises = connectionIds.map(id => searchService.getUserById(id));
      const users = await Promise.all(usersPromises);
      
      setConnectedUsers(users.filter(u => u !== null));
    } catch (error) {
      console.error('Error loading connected users:', error);
      setConnectedUsers([]);
    } finally {
      setLoadingConnections(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.interests.length === 0) {
      alert('Please select at least one interest');
      return;
    }

    setLoading(true);
    try {
      const { communityService } = await import('../../../services/communityService');
      const newCommunity = await communityService.createCommunity({
        ...formData,
        creatorId: user.id,
        creatorName: user.name
      });

      // Move to invitation step
      setStep(2);
      // Store community ID and data for invitations and callback
      window.newCommunityId = newCommunity.id;
      window.newCommunityData = newCommunity;
    } catch (error) {
      console.error('Error creating community:', error);
      alert('Failed to create community. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitations = async () => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user to invite');
      return;
    }

    setLoading(true);
    try {
      const { communityService } = await import('../../../services/communityService');
      await communityService.sendCommunityInvitations(window.newCommunityId, selectedUsers, user.id);
      
      alert(`Invitations sent to ${selectedUsers.length} user(s)! They will receive them shortly.`);
      onCommunityCreated();
      handleClose();
    } catch (error) {
      console.error('Error sending invitations:', error);
      alert('Failed to send invitations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ name: '', description: '', interests: [], verified: false });
    setSelectedUsers([]);
    setConnectedUsers([]);
    window.newCommunityId = null;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 ? 'Create New Community' : 'Invite People to Join'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            // Step 1: Create Community Form
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Community Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Book Club, Running Group"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what your community is about..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Interests * (Select at least one)
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest.value}
                      type="button"
                      onClick={() => toggleInterest(interest.value)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        formData.interests.includes(interest.value)
                          ? 'bg-sage-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="mr-2">{interest.icon}</span>
                      {interest.label}
                    </button>
                  ))}
                </div>
                {formData.interests.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {formData.interests.join(', ')}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="verified"
                  id="verified"
                  checked={formData.verified}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-sage-600 border-gray-300 rounded focus:ring-sage-500"
                />
                <label htmlFor="verified" className="ml-2 text-sm text-gray-700">
                  Mark as verified community
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading || !formData.name.trim() || !formData.description.trim() || formData.interests.length === 0}
                  className="flex-1 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Community'}
                </button>
              </div>
            </div>
          ) : (
            // Step 2: Invite Users
            <div className="space-y-6">
              <p className="text-gray-600">
                Select people from your connections to invite to join your new community.
              </p>

              {loadingConnections ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-sage-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-2 text-gray-600">Loading connections...</p>
                </div>
              ) : connectedUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You don't have any connections yet.</p>
                  <p className="text-sm text-gray-500">
                    Connect with people first, then you can invite them to your community!
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {connectedUsers.map((connectedUser) => (
                    <div
                      key={connectedUser.id}
                      onClick={() => toggleUserSelection(connectedUser.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedUsers.includes(connectedUser.id)
                          ? 'border-sage-500 bg-sage-50'
                          : 'border-gray-200 hover:border-sage-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white font-bold">
                          {connectedUser.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{connectedUser.name}</h3>
                          <p className="text-sm text-gray-600">{connectedUser.email}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedUsers.includes(connectedUser.id)
                            ? 'border-sage-500 bg-sage-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedUsers.includes(connectedUser.id) && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSendInvitations}
                  disabled={loading || selectedUsers.length === 0}
                  className="flex-1 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : `Send Invitations (${selectedUsers.length})`}
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Skip
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
