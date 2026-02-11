import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Step1InterestSelector from '../components/components/onboarding/Step1InterestSelector';
import Step2AvailabilityForm from '../components/components/onboarding/Step2AvailabilityForm';
import Step3MoodCheckIn from '../components/components/onboarding/Step3MoodCheckIn';
import Step4Preferences from '../components/components/onboarding/Step4Preferences';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleting, setIsCompleting] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    interests: [],
    activityPreferences: {},
    timePreferences: {},
    personalityType: '',
    goals: [],
    interactionPreferences: {},
    preferredModes: [],
    initialMood: null,
    bio: '',
  });

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const updateData = (stepData) => {
    setOnboardingData({ ...onboardingData, ...stepData });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (isCompleting) return; // Prevent multiple clicks
    
    setIsCompleting(true);
    try {
      // Get signup data from localStorage
      const signupDataStr = localStorage.getItem('signupData');
      if (!signupDataStr) {
        console.error('No signup data found in localStorage');
        alert('Please complete sign up first');
        navigate('/signup');
        return;
      }
      
      const signupData = JSON.parse(signupDataStr);
      
      // Combine signup data with onboarding data
      const completeUserData = {
        ...signupData,
        ...onboardingData,
        pronouns: 'they/them', // Can add this to onboarding if needed
      };

      console.log('Completing onboarding with data:', completeUserData);

      // Create user account (signUp is now async)
      const result = await signUp(completeUserData);

      if (result.success) {
        localStorage.removeItem('signupData');
        navigate('/dashboard');
      } else {
        console.error('Sign up failed:', result.error);
        alert(result.error || 'Failed to complete setup. Please try again.');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('An error occurred while completing setup. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl">🌸</span>
            <span className="text-3xl font-bold text-gradient">MindfulCircles</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Let's personalize your experience
          </h1>
          <p className="text-gray-600">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm font-medium">
            <span className={currentStep >= 1 ? 'text-sage-600' : 'text-gray-400'}>
              Interests
            </span>
            <span className={currentStep >= 2 ? 'text-sage-600' : 'text-gray-400'}>
              Availability
            </span>
            <span className={currentStep >= 3 ? 'text-sage-600' : 'text-gray-400'}>
              First Check-In
            </span>
            <span className={currentStep >= 4 ? 'text-sage-600' : 'text-gray-400'}>
              Preferences
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="card animate-slide-up-fade">
          {currentStep === 1 && (
            <Step1InterestSelector 
              data={onboardingData}
              updateData={updateData}
              onNext={nextStep}
            />
          )}
          
          {currentStep === 2 && (
            <Step2AvailabilityForm 
              data={onboardingData}
              updateData={updateData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          
          {currentStep === 3 && (
            <Step3MoodCheckIn 
              data={onboardingData}
              updateData={updateData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          
          {currentStep === 4 && (
            <Step4Preferences 
              data={onboardingData}
              updateData={updateData}
              onComplete={handleComplete}
              onBack={prevStep}
              isCompleting={isCompleting}
            />
          )}
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                step === currentStep
                  ? 'bg-sage-600 w-8'
                  : step < currentStep
                  ? 'bg-sage-400'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}