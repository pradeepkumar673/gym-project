import React, { useState, useEffect } from 'react';
import EquipmentSelector from './components/EquipmentSelector';
import MuscleSelector from './components/MuscleSelector';
import ExerciseList from './components/ExerciseList';
import ExerciseDetailModal from './components/ExerciseDetailModal';
import { getExercises } from './services/api';
import {
  DumbbellIcon,
  CheckIcon,
  ChevronRightIcon,
  ShuffleIcon,
  TrashIcon,
  ExternalLinkIcon,
  FilterIcon,
  SparklesIcon,
  TrophyIcon,
  TargetIcon,
  UsersIcon,
  ClockIcon,
  FlameIcon,
  ListIcon
} from './utils/icons';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [workoutGenerated, setWorkoutGenerated] = useState(false);
  const [workoutStats, setWorkoutStats] = useState({
    totalExercises: 0,
    totalSets: 0,
    estimatedTime: 0,
    calories: 0
  });

  const steps = [
    { id: 1, name: 'Equipment', icon: <DumbbellIcon className="w-5 h-5" /> },
    { id: 2, name: 'Muscles', icon: <TargetIcon className="w-5 h-5" /> },
    { id: 3, name: 'Exercises', icon: <ListIcon className="w-5 h-5" /> },
  ];

  useEffect(() => {
    if (selectedMuscles.length > 0 && selectedEquipment.length > 0) {
      loadExercises();
    }
  }, [selectedMuscles, selectedEquipment]);

  const loadExercises = async () => {
    setLoading(true);
    try {
      const data = await getExercises({
        muscles: selectedMuscles,
        equipment: selectedEquipment,
        limit: 50
      });
      setExercises(data.exercises || []);
    } catch (error) {
      console.error('Error loading exercises:', error);
      // Fallback data for development
      setExercises([
        { _id: '1', name: 'Push Ups', equipment: 'body only', primaryMuscles: ['chest'], category: 'strength' },
        { _id: '2', name: 'Pull Ups', equipment: 'body only', primaryMuscles: ['back'], category: 'strength' },
        { _id: '3', name: 'Squats', equipment: 'body only', primaryMuscles: ['quadriceps'], category: 'strength' },
        { _id: '4', name: 'Bench Press', equipment: 'barbell', primaryMuscles: ['chest'], category: 'strength' },
        { _id: '5', name: 'Deadlift', equipment: 'barbell', primaryMuscles: ['back'], category: 'strength' },
        { _id: '6', name: 'Bicep Curls', equipment: 'dumbbell', primaryMuscles: ['biceps'], category: 'strength' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEquipmentSelect = (equipment) => {
    setSelectedEquipment(equipment);
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleMuscleSelect = (muscles) => {
    setSelectedMuscles(muscles);
    if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleDeleteExercise = (id) => {
    setExercises(prev => prev.filter(ex => ex._id !== id));
  };

  const handleShuffleExercises = () => {
    const shuffled = [...exercises].sort(() => Math.random() - 0.5);
    setExercises(shuffled);
  };

  const handleGenerateWorkout = () => {
    const totalExercises = exercises.length;
    const totalSets = totalExercises * 3;
    const estimatedTime = totalExercises * 10;
    const calories = Math.round(totalExercises * 50);

    setWorkoutStats({
      totalExercises,
      totalSets,
      estimatedTime,
      calories
    });
    setWorkoutGenerated(true);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedEquipment([]);
    setSelectedMuscles([]);
    setExercises([]);
    setWorkoutGenerated(false);
    setSelectedExercise(null);
  };

  const getMuscleInitial = (muscle) => {
    const muscleInitials = {
      'chest': 'C',
      'back': 'B',
      'shoulders': 'S',
      'biceps': 'BI',
      'triceps': 'TRI',
      'quadriceps': 'Q',
      'hamstrings': 'H',
      'calves': 'CA',
      'abdominals': 'AB',
      'glutes': 'G',
      'forearms': 'F',
      'lats': 'L',
      'traps': 'TR'
    };
    
    const key = muscle?.toLowerCase();
    return muscleInitials[key] || muscle?.charAt(0)?.toUpperCase() || 'F';
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-red-600 to-red-800 rounded-lg">
                <DumbbellIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Muscle Dynamics
                </h1>
                <p className="text-sm text-gray-400">Your AI-Powered Workout Generator</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleReset}
                className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium py-2.5 px-6 rounded-lg transition-all duration-200 border border-gray-700 hover:border-gray-600 flex items-center space-x-2"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>New Workout</span>
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="p-1.5 bg-gray-800 rounded">
                  <UsersIcon className="w-4 h-4" />
                </div>
                <span>1.2k Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-700 -z-10">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold transition-all duration-300
                  ${currentStep > step.id ? 'border-green-500 bg-green-500 text-white' : ''}
                  ${currentStep === step.id ? 'border-red-500 bg-red-500 text-white' : ''}
                  ${currentStep < step.id ? 'border-gray-600 bg-gray-800 text-gray-400' : ''}
                `}>
                  {currentStep > step.id ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <span className={`mt-3 text-sm font-medium ${currentStep >= step.id ? 'text-white' : 'text-gray-500'}`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 1 && (
            <div>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-3">Select Your Equipment</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Choose the equipment available to you. We'll customize workouts based on your selections.
                </p>
              </div>
              <EquipmentSelector
                selectedEquipment={selectedEquipment}
                onSelect={handleEquipmentSelect}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-3">Target Your Muscles</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Select the muscles you want to work on. Choose multiple for full-body workouts.
                </p>
              </div>
              <MuscleSelector
                selectedMuscles={selectedMuscles}
                onSelect={handleMuscleSelect}
                onBack={() => setCurrentStep(1)}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Your Custom Workout</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <FilterIcon className="w-4 h-4" />
                      <span>{selectedEquipment.length} equipment</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TargetIcon className="w-4 h-4" />
                      <span>{selectedMuscles.length} muscle groups</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DumbbellIcon className="w-4 h-4" />
                      <span>{exercises.length} exercises</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleShuffleExercises}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium py-2.5 px-6 rounded-lg transition-all duration-200 border border-gray-700 hover:border-gray-600 flex items-center space-x-2"
                  >
                    <ShuffleIcon className="w-4 h-4" />
                    <span>Shuffle</span>
                  </button>
                  <button
                    onClick={handleGenerateWorkout}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center space-x-2"
                    disabled={exercises.length === 0}
                  >
                    <TrophyIcon className="w-4 h-4" />
                    <span>Generate Workout</span>
                  </button>
                </div>
              </div>

              {workoutGenerated && (
                <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transition-all duration-300 hover:border-red-500/30">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <TargetIcon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Exercises</p>
                        <p className="text-2xl font-bold">{workoutStats.totalExercises}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transition-all duration-300 hover:border-red-500/30">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <DumbbellIcon className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Total Sets</p>
                        <p className="text-2xl font-bold">{workoutStats.totalSets}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transition-all duration-300 hover:border-red-500/30">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <ClockIcon className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Est. Time</p>
                        <p className="text-2xl font-bold">{workoutStats.estimatedTime} min</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transition-all duration-300 hover:border-red-500/30">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <FlameIcon className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Calories</p>
                        <p className="text-2xl font-bold">{workoutStats.calories}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                  <p className="mt-4 text-gray-400">Loading exercises...</p>
                </div>
              ) : exercises.length > 0 ? (
                <ExerciseList
                  exercises={exercises}
                  onExerciseClick={handleExerciseClick}
                  onDelete={handleDeleteExercise}
                  onShuffle={handleShuffleExercises}
                  getMuscleInitial={getMuscleInitial}
                />
              ) : (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                    <DumbbellIcon className="w-12 h-12 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Exercises Found</h3>
                  <p className="text-gray-400 mb-6">Try selecting different equipment or muscle groups.</p>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Adjust Selections
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <DumbbellIcon className="w-6 h-6 text-red-500" />
                <span className="text-xl font-bold">Muscle Dynamics</span>
              </div>
              <p className="text-gray-500 text-sm mt-2">Build strength. Transform your body.</p>
            </div>
            <div className="text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} Muscle Dynamics. All rights reserved.</p>
              <p className="mt-1">Powered by AI • 1000+ Exercises • Personalized Workouts</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;