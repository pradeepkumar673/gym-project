import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlayCircle, 
  PauseCircle, 
  Clock, 
  Target, 
  Dumbbell,
  TrendingUp,
  Flame,
  Repeat,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Bookmark
} from 'lucide-react';

function ExerciseDetailModal({ exercise, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Generate image URLs
  const imageUrls = exercise.images?.map(img => 
    `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${img}`
  ) || [];

  // Add default images if none exist
  if (imageUrls.length === 0) {
    imageUrls.push(
      'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1549060279-7e168fce7090?w=800&h=600&fit=crop&crop=center'
    );
  }

  // Auto-play through steps
  useEffect(() => {
    let interval;
    if (isPlaying && exercise.instructions?.length > 0) {
      interval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % exercise.instructions.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, exercise.instructions]);

  // Auto-cycle through images
  useEffect(() => {
    let imageInterval;
    if (isPlaying && imageUrls.length > 1) {
      imageInterval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % imageUrls.length);
      }, 2000);
    }
    return () => clearInterval(imageInterval);
  }, [isPlaying, imageUrls.length]);

  const handlePrevStep = () => {
    setCurrentStep(prev => prev > 0 ? prev - 1 : exercise.instructions.length - 1);
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev < exercise.instructions.length - 1 ? prev + 1 : 0);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : imageUrls.length - 1);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => prev < imageUrls.length - 1 ? prev + 1 : 0);
  };

  // Get difficulty color
  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'expert': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  // Get equipment icon
  const getEquipmentIcon = (equipment) => {
    const icons = {
      'barbell': '🏋️',
      'dumbbell': '💪',
      'kettlebell': '⚖️',
      'cable': '🔄',
      'machine': '🏗️',
      'body only': '👤',
      'bands': '🌀',
      'ez curl bar': '📊'
    };
    return icons[equipment?.toLowerCase()] || '🏋️';
  };

  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-dark-900 rounded-2xl w-full max-w-6xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-dark-900/90 backdrop-blur-lg border-b border-dark-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold">{exercise.name}</h2>
                <span className={`badge ${getDifficultyColor(exercise.level)}`}>
                  {exercise.level || 'All Levels'}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="p-2 hover:bg-dark-800 rounded-lg transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-dark-800 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-dark-800 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left Column - Images & Instructions */}
            <div>
              {/* Image Carousel */}
              <div className="relative mb-8">
                <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-dark-800 to-dark-900">
                  <img
                    src={imageUrls[currentImageIndex]}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=800&h=600&fit=crop&crop=center';
                    }}
                  />
                </div>
                
                {/* Image Navigation */}
                {imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-dark-800/80 hover:bg-dark-700 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-dark-800/80 hover:bg-dark-700 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {imageUrls.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex 
                              ? 'bg-primary-500 w-8' 
                              : 'bg-dark-600 hover:bg-dark-500'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-primary-500" />
                    Step-by-Step Instructions
                  </h3>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-400">
                      Step {currentStep + 1} of {exercise.instructions?.length || 0}
                    </span>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 bg-dark-700 hover:bg-primary-600 rounded-lg transition-colors"
                    >
                      {isPlaying ? (
                        <PauseCircle className="w-5 h-5" />
                      ) : (
                        <PlayCircle className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {exercise.instructions?.length > 0 ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full" />
                      <div className="ml-6">
                        <div className="text-lg font-medium mb-2">
                          Step {currentStep + 1}
                        </div>
                        <p className="text-gray-300">
                          {exercise.instructions[currentStep]}
                        </p>
                      </div>
                    </div>

                    {/* Step Navigation */}
                    <div className="flex items-center justify-between pt-6 border-t border-dark-700">
                      <button
                        onClick={handlePrevStep}
                        className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>
                      
                      <div className="flex space-x-2">
                        {exercise.instructions.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentStep(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentStep 
                                ? 'bg-primary-500 w-8' 
                                : 'bg-dark-600 hover:bg-dark-500'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <button
                        onClick={handleNextStep}
                        className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    No instructions available for this exercise.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {exercise.primaryMuscles?.length || 1}
                      </div>
                      <div className="text-sm text-gray-400">Primary Muscles</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Target className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {exercise.secondaryMuscles?.length || 0}
                      </div>
                      <div className="text-sm text-gray-400">Secondary Muscles</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Equipment */}
              <div className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Dumbbell className="w-5 h-5 mr-2 text-primary-500" />
                  Equipment Required
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">
                    {getEquipmentIcon(exercise.equipment)}
                  </div>
                  <div>
                    <div className="text-xl font-semibold">
                      {exercise.equipment || 'Bodyweight Only'}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {exercise.equipment ? 'Required for this exercise' : 'No equipment needed'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Muscle Groups */}
              <div className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                <h3 className="text-lg font-semibold mb-4">Target Muscles</h3>
                <div className="space-y-4">
                  {/* Primary Muscles */}
                  {exercise.primaryMuscles?.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Primary</div>
                      <div className="flex flex-wrap gap-2">
                        {exercise.primaryMuscles.map(muscle => (
                          <span
                            key={muscle}
                            className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-sm border border-blue-500/30"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Secondary Muscles */}
                  {exercise.secondaryMuscles?.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Secondary</div>
                      <div className="flex flex-wrap gap-2">
                        {exercise.secondaryMuscles.map(muscle => (
                          <span
                            key={muscle}
                            className="px-3 py-1.5 bg-green-500/20 text-green-300 rounded-lg text-sm border border-green-500/30"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Category & Mechanics */}
              <div className="grid grid-cols-2 gap-4">
                {exercise.category && (
                  <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
                    <div className="text-sm text-gray-400 mb-1">Category</div>
                    <div className="text-lg font-semibold capitalize">
                      {exercise.category}
                    </div>
                  </div>
                )}
                
                {exercise.mechanic && (
                  <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
                    <div className="text-sm text-gray-400 mb-1">Mechanic</div>
                    <div className="text-lg font-semibold capitalize">
                      {exercise.mechanic}
                    </div>
                  </div>
                )}
              </div>

              {/* Add to Workout Button */}
              <button className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3">
                <Flame className="w-5 h-5" />
                <span>Add to My Workout</span>
              </button>

              {/* Tips */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start">
                  <Target className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-300 mb-1">Pro Tips</h4>
                    <ul className="text-sm text-blue-400/80 space-y-1">
                      <li>• Focus on form over weight</li>
                      <li>• Breathe out during exertion</li>
                      <li>• Keep core engaged throughout</li>
                      <li>• Control the movement both ways</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExerciseDetailModal;
