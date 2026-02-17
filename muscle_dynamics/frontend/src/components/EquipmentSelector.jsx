import React from 'react';
import {
  DumbbellIcon,
  CheckIcon,
  TargetIcon,
  UsersIcon,
  SparklesIcon,
  TrophyIcon,
  ListIcon,
  FlameIcon
} from '../utils/icons';

const equipmentData = [
  { id: 'barbell', name: 'Barbell', icon: <DumbbellIcon className="w-6 h-6" />, color: 'from-red-500 to-orange-500' },
  { id: 'dumbbell', name: 'Dumbbells', icon: <DumbbellIcon className="w-6 h-6" />, color: 'from-blue-500 to-cyan-500' },
  { id: 'kettlebell', name: 'Kettlebell', icon: <TrophyIcon className="w-6 h-6" />, color: 'from-green-500 to-emerald-500' },
  { id: 'body only', name: 'Bodyweight', icon: <UsersIcon className="w-6 h-6" />, color: 'from-purple-500 to-pink-500' },
  { id: 'cable', name: 'Cable Machine', icon: <ListIcon className="w-6 h-6" />, color: 'from-yellow-500 to-amber-500' },
  { id: 'machine', name: 'Machines', icon: <SparklesIcon className="w-6 h-6" />, color: 'from-indigo-500 to-purple-500' },
  { id: 'bands', name: 'Resistance Bands', icon: <FlameIcon className="w-6 h-6" />, color: 'from-teal-500 to-green-500' },
  { id: 'ez curl bar', name: 'EZ Curl Bar', icon: <TargetIcon className="w-6 h-6" />, color: 'from-rose-500 to-pink-500' },
];

function EquipmentSelector({ selectedEquipment, onSelect }) {
  const toggleEquipment = (equipmentId) => {
    const newSelection = selectedEquipment.includes(equipmentId)
      ? selectedEquipment.filter(id => id !== equipmentId)
      : [...selectedEquipment, equipmentId];
    onSelect(newSelection);
  };

  const handleContinue = () => {
    if (selectedEquipment.length > 0) {
      onSelect(selectedEquipment);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {equipmentData.map((item) => {
          const isSelected = selectedEquipment.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleEquipment(item.id)}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300
                ${isSelected 
                  ? 'border-primary-500 bg-gradient-to-br from-dark-800 to-dark-900 shadow-xl shadow-primary-500/10' 
                  : 'border-dark-700 bg-dark-800/50 hover:border-dark-600 hover:bg-dark-800'
                }
                transform hover:scale-[1.02] active:scale-[0.98]
              `}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                <div className="text-white">
                  {item.icon}
                </div>
              </div>
              
              <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
              <p className="text-sm text-gray-400">
                {isSelected ? 'Selected' : 'Click to select'}
              </p>
            </button>
          );
        })}
      </div>

      <div className="bg-dark-800/30 rounded-xl p-6 border border-dark-700">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-1">Selected Equipment</h3>
            <p className="text-gray-400 text-sm">
              {selectedEquipment.length > 0 
                ? selectedEquipment.map(id => equipmentData.find(e => e.id === id)?.name).join(', ')
                : 'No equipment selected'
              }
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => onSelect([])}
              className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
              disabled={selectedEquipment.length === 0}
            >
              Clear All
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedEquipment.length === 0}
              className={`
                px-8 py-2.5 rounded-lg font-medium transition-all
                ${selectedEquipment.length > 0
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white'
                  : 'bg-dark-700 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Continue to Muscles
            </button>
          </div>
        </div>
      </div>

      {/* Quick Select Buttons */}
      <div className="mt-8">
        <h4 className="text-sm font-medium text-gray-400 mb-3">QUICK SELECT</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelect(['barbell', 'dumbbell', 'bench'])}
            className="px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm transition-colors"
          >
            Gym Standard
          </button>
          <button
            onClick={() => onSelect(['dumbbell', 'kettlebell', 'bands'])}
            className="px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm transition-colors"
          >
            Home Gym
          </button>
          <button
            onClick={() => onSelect(['body only', 'bands'])}
            className="px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm transition-colors"
          >
            No Equipment
          </button>
          <button
            onClick={() => onSelect(equipmentData.map(e => e.id))}
            className="px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm transition-colors"
          >
            Select All
          </button>
        </div>
      </div>
    </div>
  );
}

export default EquipmentSelector;