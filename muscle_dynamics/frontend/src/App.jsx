import React, { useState, useEffect } from 'react';
import EquipmentSelector from './components/EquipmentSelector';
import MuscleSelector from './components/MuscleSelector';
import ExerciseList from './components/ExerciseList';
import ExerciseDetailModal from './components/ExerciseDetailModal';
import DeveloperModal from './components/DeveloperModal';
import SplashScreen from './components/SplashScreen';
import { getExercises, getHealth } from './services/api';
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
  ListIcon,
  SearchIcon
} from './utils/icons';

function App() {
  const [splashVisible, setSplashVisible] = useState(true);
  const [backendReady, setBackendReady] = useState(false);
  const [windowLoaded, setWindowLoaded] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [workoutGenerated, setWorkoutGenerated] = useState(false);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
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

  // Splash screen logic
  useEffect(() => {
    // Minimum 5 seconds timer
    const timer = setTimeout(() => setMinTimePassed(true), 5000);

    // Check backend health repeatedly until success
    const checkBackend = async () => {
      try {
        await getHealth();
        setBackendReady(true);
      } catch (error) {
        // Retry after 500ms
        setTimeout(checkBackend, 500);
      }
    };
    checkBackend();

    // Wait for window load (images, videos, etc.)
    if (document.readyState === 'complete') {
      setWindowLoaded(true);
    } else {
      window.addEventListener('load', () => setWindowLoaded(true));
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', () => setWindowLoaded(true));
    };
  }, []);

  // When all conditions are met, start final step: wait 0.6s then hide splash
  useEffect(() => {
    if (minTimePassed && backendReady && windowLoaded) {
      const hideTimer = setTimeout(() => setSplashVisible(false), 600);
      return () => clearTimeout(hideTimer);
    }
  }, [minTimePassed, backendReady, windowLoaded]);

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
        { _id: '1', name: 'Push Ups', equipment: 'body only', primaryMuscles: ['chest'], category: 'strength', level: 'beginner' },
        { _id: '2', name: 'Pull Ups', equipment: 'body only', primaryMuscles: ['back'], category: 'strength', level: 'intermediate' },
        { _id: '3', name: 'Squats', equipment: 'body only', primaryMuscles: ['quadriceps'], category: 'strength', level: 'beginner' },
        { _id: '4', name: 'Bench Press', equipment: 'barbell', primaryMuscles: ['chest'], category: 'strength', level: 'intermediate' },
        { _id: '5', name: 'Deadlift', equipment: 'barbell', primaryMuscles: ['back'], category: 'strength', level: 'expert' },
        { _id: '6', name: 'Bicep Curls', equipment: 'dumbbell', primaryMuscles: ['biceps'], category: 'strength', level: 'beginner' },
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
    <>
      {splashVisible && <SplashScreen loadingComplete={minTimePassed && backendReady && windowLoaded} />}
      <div className="min-h-screen bg-gray-900 text-gray-100">
        {/* Header */}
        <header className=" top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg">
                <img src="/light.svg" alt="Muscle Dynamics" className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 bg-clip-text text-transparent">
                  Muscle Dynamics
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowDeveloperModal(true)}
                className="text-gray-300 hover:text-white transition px-3 py-2 rounded-lg hover:bg-gray-800"
              >
                About Developer
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium py-2 px-4 rounded-lg transition border border-gray-700 flex items-center space-x-2"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>New Workout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section with Video Background */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container mx-auto px-4 py-20 md:py-28 max-w-6xl relative z-10">
            <div className="text-center">
              <span className="inline-block px-4 py-1 bg-primary-600/20 text-primary-300 rounded-full text-sm font-semibold mb-6 border border-primary-600/30">
                workoutworthy
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 bg-clip-text text-transparent">
                  Worth Breaking
                </span>
                <br />
                <span className="text-white">a Sweat For</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                One website for all your fitness needs. From personalized workouts to nutrition guidance,
                I make group workouts fun and results-driven. #BeBetterEveryDay
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-20">
              {[
                { label: 'EXERCISES at my DB', value: '1000+' },
                { label: 'EQUIPMENT', value: '15+' },
                { label: 'MUSCLE GROUPS', value: '13' },
                { label: 'included', value: 'tutorial steps' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400 tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 border-t border-gray-800">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                  One Membership
                </span>
                <br />
                <span className="text-white">For All Your Fitness Needs</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                At Muscle Dynamics, I make workouts fun, nutrition simple, and results inevitable.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 hover:border-primary-400 transition group">
                <div className="w-16 h-16 bg-primary-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <UsersIcon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Trainer-Led</h3>
                <p className="text-gray-400 mb-4">Expert guidance in every workout, just like a personal coach by your side.</p>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 hover:border-primary-400 transition group">
                <div className="w-16 h-16 bg-primary-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <FlameIcon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">1000+ exercises</h3>
                <p className="text-gray-400 mb-4">stored in my databases.</p>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 hover:border-primary-400 transition group">
                <div className="w-16 h-16 bg-primary-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <TargetIcon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Personalized</h3>
                <p className="text-gray-400 mb-4">Workouts tailored to your equipment, goals, and target muscles.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Full-width Banner Image */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/cideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container mx-auto px-4 py-20 md:py-28 max-w-6xl relative z-10">
            <div className="text-center">
              <span className="inline-block px-4 py-1 bg-primary-600/20 text-primary-300 rounded-full text-sm font-semibold mb-6 border border-primary-600/30">
                joinwithme
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 bg-clip-text text-transparent">
                  join my journey
                </span>
                <br />
                <span className="text-white">of transformation</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                its a shame for a man to avoid what his body is capable of<br></br>
                -pradeepkumar673atyt@instagram.com . #BeBetterEveryDay
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-20">
              {[
                { label: 'EXERCISES at my DB', value: '1000+' },
                { label: 'EQUIPMENT', value: '15+' },
                { label: 'MUSCLE GROUPS', value: '13' },
                { label: 'included', value: 'tutorial steps' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400 tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 border-t border-gray-800 bg-gray-900/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                What Our <span className="text-primary-600">Users Say</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Join thousands of satisfied athletes who transformed their fitness.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'PradeepKumar.S.', quote: 'The personalized workouts saved me hours of planning. I’ve never been stronger!', role: 'Strength trainee, developer' },
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-primary-300 transition">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                  <div className="flex mt-3 text-primary-300">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Workflow */}
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-700 -z-10">
                <div
                  className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold
                    ${currentStep > step.id ? 'border-green-500 bg-green-500 text-white' : ''}
                    ${currentStep === step.id ? 'border-primary-600 bg-primary-600 text-white' : ''}
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
                    className="bg-primary-600 hover:bg-primary-500 px-4 py-2 rounded-lg flex items-center space-x-2 transition disabled:opacity-50"
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
                  <StatCard icon={<FlameIcon className="w-5 h-5 text-primary-600" />} label="Calories" value={workoutStats.calories} />
                </div>
              )}

              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
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
                    className="bg-primary-600 hover:bg-primary-500 px-6 py-2.5 rounded-lg"
                  >
                    Adjust Selections
                  </button>
                </div>
              )}
            </>
          )}

          {/* Navigation Buttons */}
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
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 rounded-lg disabled:opacity-40 flex items-center space-x-2"
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

        {/* Developer Modal */}
        {showDeveloperModal && (
          <DeveloperModal onClose={() => setShowDeveloperModal(false)} />
        )}

        {/* Footer */}
        <footer className="border-t border-gray-800 py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-1 bg-primary-600 rounded">
                    <img src="/light.svg" alt="Muscle Dynamics" className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg">Muscle Dynamics</span>
                </div>
                <p className="text-gray-400 text-sm">one fitness website for all the needs.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">About</a></li>
                  <li><a href="#" className="hover:text-white transition">Features</a></li>
                  <li><a href="#" onClick={() => setShowDeveloperModal(true)} className="hover:text-white transition">Developer</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Connect</h4>
                <div className="flex space-x-3">
                  <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition text-sm">f</a>
                  <a href="https://www.instagram.com/pradeepkumar673atyt/" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition text-sm">i</a>
                  <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition text-sm">t</a>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} Muscle Dynamics. All rights reserved. Developed by Pradeep Kumar</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-primary-400 transition">
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