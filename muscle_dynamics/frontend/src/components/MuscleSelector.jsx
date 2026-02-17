import React, { useState } from 'react';
import MuscleSvg from './MuscleSvg';
import { CheckIcon, TargetIcon, ChevronRightIcon } from '../utils/icons';

// Quick‑select presets (optional – you can keep or remove them)
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
    id: 'full', 
    name: 'Full Body', 
    muscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quadriceps', 'hamstrings', 'glutes', 'calves'],
    description: 'Complete body workout'
  },
];

function MuscleSelector({ selectedMuscles, onSelect, onBack }) {
  const [activeTab, setActiveTab] = useState('all'); // not used by SVG, but kept for compatibility

  const toggleMuscle = (muscleId) => {
    const newSelection = selectedMuscles.includes(muscleId)
      ? selectedMuscles.filter(id => id !== muscleId)
      : [...selectedMuscles, muscleId];
    onSelect(newSelection);
  };

  const selectPreset = (presetMuscles) => {
    onSelect(presetMuscles);
  };

  return (
    <div>
      {/* Back button and title */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>← Back to Equipment</span>
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Select Target Muscles</h2>
          <p className="text-gray-400 text-sm">Click on the diagram to choose muscle groups</p>
        </div>
        <div className="w-24"></div> {/* spacer */}
      </div>

      {/* Quick Select Presets (optional) */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TargetIcon className="w-5 h-5 mr-2 text-primary-500" />
          Quick Select Presets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {musclePresets.map(preset => {
            const isActive = preset.muscles.every(m => selectedMuscles.includes(m)) && 
                           preset.muscles.length === selectedMuscles.length;
            return (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset.muscles)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isActive
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-700 bg-dark-800/50 hover:border-dark-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{preset.name}</h4>
                  {isActive && <CheckIcon className="w-5 h-5 text-primary-500" />}
                </div>
                <p className="text-sm text-gray-400 mb-3">{preset.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {preset.muscles.slice(0, 3).map(m => (
                    <span key={m} className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                      {m}
                    </span>
                  ))}
                  {preset.muscles.length > 3 && (
                    <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                      +{preset.muscles.length - 3}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive SVG Muscle Diagram */}
      <div className="mb-8 bg-dark-800/30 rounded-xl p-6 border border-dark-700">
        <MuscleSvg
          selectedMuscles={selectedMuscles}
          onToggleMuscle={toggleMuscle}
        />
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
                {selectedMuscles.map(muscle => (
                  <div
                    key={muscle}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-dark-700 rounded-lg"
                  >
                    <span className="text-sm">{muscle}</span>
                    <button
                      onClick={() => toggleMuscle(muscle)}
                      className="text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 mt-2">No muscles selected yet – click on the diagram above.</p>
            )}
          </div>
          <button
            onClick={() => onSelect(selectedMuscles)}
            disabled={selectedMuscles.length === 0}
            className={`px-8 py-2.5 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              selectedMuscles.length > 0
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white'
                : 'bg-dark-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>Generate Exercises</span>
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MuscleSelector;