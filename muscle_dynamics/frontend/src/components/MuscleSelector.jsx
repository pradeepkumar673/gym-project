import React, { useState, useEffect } from 'react';/*
import { ChevronLeft, Target, Check, X, AlertCircle } from 'lucide-react';*/
import { CheckIcon, TargetIcon, ChevronRightIcon } from '../utils/icons';
// Remove any lucide-react imports

// Simplified muscle groups for frontend display
const muscleGroups = [
  { id: 'chest', name: 'Chest', color: 'bg-blue-500', group: 'upper' },
  { id: 'back', name: 'Back', color: 'bg-green-500', group: 'upper' },
  { id: 'shoulders', name: 'Shoulders', color: 'bg-purple-500', group: 'upper' },
  { id: 'biceps', name: 'Biceps', color: 'bg-red-500', group: 'arms' },
  { id: 'triceps', name: 'Triceps', color: 'bg-orange-500', group: 'arms' },
  { id: 'forearms', name: 'Forearms', color: 'bg-yellow-500', group: 'arms' },
  { id: 'abdominals', name: 'Abs', color: 'bg-teal-500', group: 'core' },
  { id: 'quadriceps', name: 'Quads', color: 'bg-indigo-500', group: 'legs' },
  { id: 'hamstrings', name: 'Hamstrings', color: 'bg-pink-500', group: 'legs' },
  { id: 'calves', name: 'Calves', color: 'bg-cyan-500', group: 'legs' },
  { id: 'glutes', name: 'Glutes', color: 'bg-rose-500', group: 'legs' },
  { id: 'traps', name: 'Traps', color: 'bg-lime-500', group: 'upper' },
];

// Quick select presets
const musclePresets = [
  { 
    id: 'push', 
    name: 'Push Day', 
    muscles: ['chest', 'shoulders', 'triceps'],
    description: 'Focus on pushing movements'
  },
  { 
    id: 'pull', 
    name: 'Pull Day', 
    muscles: ['back', 'biceps', 'traps'],
    description: 'Focus on pulling movements'
  },
  { 
    id: 'legs', 
    name: 'Leg Day', 
    muscles: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
    description: 'Complete lower body workout'
  },
  { 
    id: 'upper', 
    name: 'Upper Body', 
    muscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
    description: 'Full upper body focus'
  },
  { 
    id: 'core', 
    name: 'Core Focus', 
    muscles: ['abdominals'],
    description: 'Abs and core strength'
  },
  { 
    id: 'full', 
    name: 'Full Body', 
    muscles: muscleGroups.map(m => m.id),
    description: 'Complete body workout'
  },
];

function MuscleSelector({ selectedMuscles, onSelect, onBack }) {
  const [activeTab, setActiveTab] = useState('all');

  const toggleMuscle = (muscleId) => {
    const newSelection = selectedMuscles.includes(muscleId)
      ? selectedMuscles.filter(id => id !== muscleId)
      : [...selectedMuscles, muscleId];
    
    onSelect(newSelection);
  };

  const selectPreset = (presetMuscles) => {
    onSelect(presetMuscles);
  };

  const filteredMuscles = activeTab === 'all' 
    ? muscleGroups 
    : muscleGroups.filter(m => m.group === activeTab);

  return (
    <div>
      {/* Back button and title */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Equipment</span>
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold">Select Target Muscles</h2>
          <p className="text-gray-400 text-sm">Choose 1 or more muscle groups</p>
        </div>
        
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      {/* Quick Select Presets */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary-500" />
          Quick Select Presets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {musclePresets.map(preset => {
            const isActive = preset.muscles.every(m => selectedMuscles.includes(m)) && 
                           preset.muscles.length === selectedMuscles.length;
            
            return (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset.muscles)}
                className={`
                  p-4 rounded-xl border-2 text-left transition-all
                  ${isActive
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-700 bg-dark-800/50 hover:border-dark-600'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{preset.name}</h4>
                  {isActive && (
                    <Check className="w-5 h-5 text-primary-500" />
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-3">{preset.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {preset.muscles.map(muscleId => {
                    const muscle = muscleGroups.find(m => m.id === muscleId);
                    return muscle ? (
                      <span
                        key={muscleId}
                        className={`px-2 py-1 rounded-full text-xs ${muscle.color} bg-opacity-20 text-${muscle.color.split('-')[1]}-300`}
                      >
                        {muscle.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Muscle Group Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 p-1 bg-dark-800 rounded-lg inline-flex">
          {[
            { id: 'all', name: 'All Muscles' },
            { id: 'upper', name: 'Upper Body' },
            { id: 'arms', name: 'Arms' },
            { id: 'core', name: 'Core' },
            { id: 'legs', name: 'Legs' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? 'bg-dark-700 text-white'
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Muscle Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {filteredMuscles.map(muscle => {
          const isSelected = selectedMuscles.includes(muscle.id);
          
          return (
            <button
              key={muscle.id}
              onClick={() => toggleMuscle(muscle.id)}
              className={`
                p-4 rounded-xl border-2 transition-all duration-300
                ${isSelected
                  ? 'border-primary-500 bg-gradient-to-br from-dark-800 to-dark-900'
                  : 'border-dark-700 bg-dark-800/50 hover:border-dark-600'
                }
                transform hover:scale-[1.02]
              `}
            >
              <div className={`w-12 h-12 ${muscle.color} rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                <Target className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="font-semibold text-center mb-1">{muscle.name}</h3>
              
              <div className="flex items-center justify-center">
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${isSelected ? 'border-primary-500 bg-primary-500' : 'border-dark-600'}
                `}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Muscles Summary */}
      <div className="bg-dark-800/30 rounded-xl p-6 border border-dark-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <h3 className="font-semibold text-lg">Selected Muscle Groups</h3>
              <span className="ml-3 px-2.5 py-0.5 bg-primary-500/20 text-primary-300 rounded-full text-xs font-medium">
                {selectedMuscles.length} selected
              </span>
            </div>
            
            {selectedMuscles.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedMuscles.map(muscleId => {
                  const muscle = muscleGroups.find(m => m.id === muscleId);
                  return muscle ? (
                    <div
                      key={muscleId}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-dark-700 rounded-lg"
                    >
                      <div className={`w-3 h-3 ${muscle.color} rounded-full`}></div>
                      <span className="text-sm">{muscle.name}</span>
                      <button
                        onClick={() => toggleMuscle(muscleId)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="flex items-center text-gray-400 mt-2">
                <AlertCircle className="w-4 h-4 mr-2" />
                <p className="text-sm">No muscles selected yet</p>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => onSelect([])}
              className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
              disabled={selectedMuscles.length === 0}
            >
              Clear All
            </button>
            <button
              onClick={() => onSelect(selectedMuscles)}
              disabled={selectedMuscles.length === 0}
              className={`
                px-8 py-2.5 rounded-lg font-medium transition-all flex items-center space-x-2
                ${selectedMuscles.length > 0
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white'
                  : 'bg-dark-700 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <span>Generate Exercises</span>
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <div className="flex items-start">
          <Target className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-300 mb-1">Pro Tip</h4>
            <p className="text-sm text-blue-400/80">
              For balanced development, select opposing muscle groups (e.g., Chest + Back, Biceps + Triceps).
              Most effective workouts target 2-4 muscle groups per session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MuscleSelector;