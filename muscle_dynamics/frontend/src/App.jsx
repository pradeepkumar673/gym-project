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
  };

  const handleMuscleSelect = (muscles) => {
    setSelectedMuscles(muscles);
  };

  const goToNextStep = () => {
    if (currentStep === 1 && selectedEquipment.length === 0) {
      alert('Please select at least one equipment type.');
      return;
    }
    if (currentStep === 2 && selectedMuscles.length === 0) {
      alert('Please select at least one muscle group.');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const goToPrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedEquipment([]);
    setSelectedMuscles([]);
    setExercises([]);
    setWorkoutGenerated(false);
    setSelectedExercise(null);
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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
          <button
            onClick={handleReset}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium py-2 px-4 rounded-lg transition border border-gray-700 flex items-center space-x-2"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>New Workout</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress Steps */}
        <div className="mb-12">
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
                  w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold
                  ${currentStep > step.id ? 'border-green-500 bg-green-500 text-white' : ''}
                  ${currentStep === step.id ? 'border-red-500 bg-red-500 text-white' : ''}
                  ${currentStep < step.id ? 'border-gray-600 bg-gray-800 text-gray-400' : ''}
                `}>
                  {currentStep > step.id ? <CheckIcon className="w-5 h-5" /> : step.id}
                </div>
                <span className={`mt-3 text-sm font-medium ${currentStep >= step.id ? 'text-white' : 'text-gray-500'}`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <EquipmentSelector
            selectedEquipment={selectedEquipment}
            onSelect={handleEquipmentSelect}
          />
        )}
        {currentStep === 2 && (
          <MuscleSelector
            selectedMuscles={selectedMuscles}
            onSelect={handleMuscleSelect}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Your Custom Workout</h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span className="flex items-center space-x-1"><FilterIcon className="w-4 h-4" /> {selectedEquipment.length} equipment</span>
                  <span className="flex items-center space-x-1"><TargetIcon className="w-4 h-4" /> {selectedMuscles.length} muscle groups</span>
                  <span className="flex items-center space-x-1"><DumbbellIcon className="w-4 h-4" /> {exercises.length} exercises</span>
                </div>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <button
                  onClick={handleShuffleExercises}
                  className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition border border-gray-700"
                >
                  <ShuffleIcon className="w-4 h-4" />
                  <span>Shuffle</span>
                </button>
                <button
                  onClick={handleGenerateWorkout}
                  disabled={exercises.length === 0}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition disabled:opacity-50"
                >
                  <TrophyIcon className="w-4 h-4" />
                  <span>Generate Workout</span>
                </button>
              </div>
            </div>

            {workoutGenerated && (
              <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={<TargetIcon className="w-5 h-5 text-blue-400" />} label="Exercises" value={workoutStats.totalExercises} />
                <StatCard icon={<DumbbellIcon className="w-5 h-5 text-green-400" />} label="Total Sets" value={workoutStats.totalSets} />
                <StatCard icon={<ClockIcon className="w-5 h-5 text-yellow-400" />} label="Est. Time" value={`${workoutStats.estimatedTime} min`} />
                <StatCard icon={<FlameIcon className="w-5 h-5 text-red-400" />} label="Calories" value={workoutStats.calories} />
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
                  className="bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-lg"
                >
                  Adjust Selections
                </button>
              </div>
            )}
          </>
        )}

        {/* Navigation Buttons (shown only on steps 1 and 2) */}
        {currentStep < 3 && (
          <div className="mt-12 flex justify-between">
            <button
              onClick={goToPrevStep}
              disabled={currentStep === 1}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-40 flex items-center space-x-2"
            >
              <ChevronRightIcon className="w-4 h-4 rotate-180" />
              <span>Previous</span>
            </button>
            <button
              onClick={goToNextStep}
              disabled={(currentStep === 1 && selectedEquipment.length === 0) || (currentStep === 2 && selectedMuscles.length === 0)}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-40 flex items-center space-x-2"
            >
              <span>{currentStep === 2 ? 'Generate Exercises' : 'Continue'}</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}
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
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Muscle Dynamics. All rights reserved.</p>
          <p className="mt-1">Powered by AI • 1000+ Exercises • Personalized Workouts</p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-red-500/30 transition">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-700/50 rounded-lg">{icon}</div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default App;