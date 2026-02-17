import React, { useState } from 'react';
import { Shuffle, Trash2, ExternalLink, PlayCircle, TrendingUp, Flame, Star, ChevronRight } from 'lucide-react';

function ExerciseCard({ exercise, onSelect, onDelete, getMuscleInitial }) {
  const [isHovered, setIsHovered] = useState(false);
  const primaryMuscle = exercise.primaryMuscles?.[0] || 'full';
  const muscleInitial = getMuscleInitial(primaryMuscle);
  const imageUrl = exercise.images?.[0]
    ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exercise.images[0]}`
    : `https://images.unsplash.com/photo-1536922246289-88c42f957773?w=400&h=300&fit=crop&crop=center`;

  return (
    <div
      className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-red-500/50 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-4 left-4 z-10">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">{muscleInitial}</span>
        </div>
      </div>
      <div className={`
        absolute top-4 right-4 z-10 flex space-x-2 transition-all duration-300
        ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
      `}>
        <button onClick={() => onSelect(exercise)} className="p-2 bg-gray-800 hover:bg-red-600 rounded-lg transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(exercise._id)} className="p-2 bg-gray-800 hover:bg-red-600 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="h-40 overflow-hidden bg-gray-800">
        <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
             style={{ backgroundImage: `url(${imageUrl})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1 group-hover:text-red-400 transition-colors line-clamp-1">{exercise.name}</h3>
        <div className="flex items-center space-x-2 text-xs text-gray-400 mb-3">
          <span>{exercise.equipment || 'Bodyweight'}</span>
          <span>•</span>
          <span>{exercise.level || 'All Levels'}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {exercise.category && (
            <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">{exercise.category}</span>
          )}
          {exercise.primaryMuscles?.slice(0, 2).map(muscle => (
            <span key={muscle} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">
              {muscle}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700">
          <div className="text-center">
            <div className="text-xl font-bold text-red-400">{exercise.primaryMuscles?.length || 1}</div>
            <div className="text-xs text-gray-400">Primary</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400">{exercise.secondaryMuscles?.length || 0}</div>
            <div className="text-xs text-gray-400">Secondary</div>
          </div>
        </div>
        <button
          onClick={() => onSelect(exercise)}
          className="mt-3 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center space-x-2 text-sm transition"
        >
          <span>View Exercise</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ExerciseList({ exercises, onExerciseClick, onDelete, onShuffle, getMuscleInitial }) {
  const [filter, setFilter] = useState('all');
  const categories = ['all', ...new Set(exercises.map(ex => ex.category).filter(Boolean))];
  const filtered = filter === 'all' ? exercises : exercises.filter(ex => ex.category?.toLowerCase() === filter.toLowerCase());

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
        <div className="flex items-center space-x-4">
          <h3 className="font-semibold">{filtered.length} Exercises</h3>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-lg text-sm capitalize transition ${
                  filter === cat ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={onShuffle}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
        >
          <Shuffle className="w-4 h-4" />
          <span>Shuffle</span>
        </button>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(ex => (
            <ExerciseCard
              key={ex._id}
              exercise={ex}
              onSelect={onExerciseClick}
              onDelete={onDelete}
              getMuscleInitial={getMuscleInitial}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
            <TrendingUp className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Exercises Match Filter</h3>
          <p className="text-gray-400 mb-6">Try changing the filter.</p>
          <button onClick={() => setFilter('all')} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg">
            Show All
          </button>
        </div>
      )}
    </div>
  );
}

export default ExerciseList;