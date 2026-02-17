import React, { useState } from 'react';
import { 
  Shuffle, 
  Trash2, 
  ExternalLink, 
  PlayCircle,
  TrendingUp,
  Clock,
  Flame,
  Star,
  ChevronRight
} from 'lucide-react';

import { 
  ShuffleIcon, 
  TrashIcon, 
  ExternalLinkIcon, 
  ChevronRightIcon 
} from '../utils/icons';

function ExerciseCard({ exercise, onSelect, onDelete, getMuscleInitial }) {
  const [isHovered, setIsHovered] = useState(false);

  const primaryMuscle = exercise.primaryMuscles?.[0] || 'full';
  const muscleInitial = getMuscleInitial(primaryMuscle);

  // Get equipment icon
  const getEquipmentIcon = (equipment) => {
    const equipmentIcons = {
      'barbell': '🏋️',
      'dumbbell': '💪',
      'kettlebell': '⚖️',
      'cable': '🔄',
      'machine': '🏗️',
      'body only': '👤',
      'bands': '🌀',
      'ez curl bar': '📊'
    };
    return equipmentIcons[equipment.toLowerCase()] || '🏋️';
  };

  // Get difficulty color
  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-300';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300';
      case 'expert': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'strength': return 'bg-red-500/20 text-red-300';
      case 'stretching': return 'bg-blue-500/20 text-blue-300';
      case 'plyometrics': return 'bg-purple-500/20 text-purple-300';
      case 'cardio': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  // Generate image URL
  const imageUrl = exercise.images?.[0] 
    ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exercise.images[0]}`
    : `https://images.unsplash.com/photo-1536922246289-88c42f957773?w=400&h=300&fit=crop&crop=center`;

  return (
    <div
      className="exercise-card group relative bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Muscle initial badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">{muscleInitial}</span>
        </div>
      </div>

      {/* Action buttons overlay */}
      <div className={`
        absolute top-4 right-4 z-10 flex space-x-2 transition-all duration-300
        ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
      `}>
        <button
          onClick={() => onSelect(exercise)}
          className="p-2 bg-dark-800 hover:bg-primary-600 rounded-lg transition-colors"
          title="View Details"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(exercise._id);
          }}
          className="p-2 bg-dark-800 hover:bg-red-600 rounded-lg transition-colors"
          title="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Exercise image */}
      <div className="h-48 overflow-hidden bg-gradient-to-br from-dark-800 to-dark-900">
        <div 
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1 group-hover:text-primary-400 transition-colors line-clamp-1">
              {exercise.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>{exercise.equipment || 'Bodyweight'}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Flame className="w-3 h-3" />
                <span>{exercise.level || 'All Levels'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {exercise.category && (
            <span className={`badge ${getCategoryColor(exercise.category)}`}>
              {exercise.category}
            </span>
          )}
          {exercise.primaryMuscles?.slice(0, 2).map(muscle => (
            <span key={muscle} className="badge bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {muscle}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-dark-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">
              {exercise.primaryMuscles?.length || 1}
            </div>
            <div className="text-xs text-gray-400">Primary Muscles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {exercise.secondaryMuscles?.length || 0}
            </div>
            <div className="text-xs text-gray-400">Secondary Muscles</div>
          </div>
        </div>

        {/* View button */}
        <button
          onClick={() => onSelect(exercise)}
          className="mt-4 w-full py-2.5 bg-dark-700 hover:bg-dark-600 rounded-lg flex items-center justify-center space-x-2 transition-colors group"
        >
          <span>View Exercise</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Hover gradient overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent pointer-events-none" />
      )}
    </div>
  );
}

function ExerciseList({ exercises, onExerciseClick, onDelete, onShuffle, getMuscleInitial }) {
  const [filter, setFilter] = useState('all');

  // Filter exercises by category
  const filteredExercises = filter === 'all' 
    ? exercises 
    : exercises.filter(ex => ex.category?.toLowerCase() === filter.toLowerCase());

  // Get unique categories
  const categories = ['all', ...new Set(exercises.map(ex => ex.category).filter(Boolean))];

  return (
    <div>
      {/* Filters and Actions */}
      <div className="mb-8 bg-dark-800/30 rounded-xl p-4 border border-dark-700">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold">{filteredExercises.length} Exercises</h3>
            
            {/* Category Filters */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Filter:</span>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 5).map(category => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm transition-colors capitalize
                      ${filter === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-700 text-gray-400 hover:text-white'
                      }
                    `}
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onShuffle}
              className="flex items-center space-x-2 px-4 py-2.5 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle Order</span>
            </button>
            
            <div className="text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <PlayCircle className="w-4 h-4" />
                <span>Click exercise to view details</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exercises Grid */}
      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExercises.map(exercise => (
            <ExerciseCard
              key={exercise._id}
              exercise={exercise}
              onSelect={onExerciseClick}
              onDelete={onDelete}
              getMuscleInitial={getMuscleInitial}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-dark-800 rounded-full flex items-center justify-center">
            <TrendingUp className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Exercises Match Filter</h3>
          <p className="text-gray-400 mb-6">Try changing the filter or select different muscles.</p>
          <button
            onClick={() => setFilter('all')}
            className="btn-primary"
          >
            Show All Exercises
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {filteredExercises.length > 0 && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-dark-800/50 rounded-xl">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-400">
              Showing <span className="text-white font-medium">{filteredExercises.length}</span> exercises
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400">
              Suggested: <span className="text-white font-medium">8-12</span> exercises per workout
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExerciseList;