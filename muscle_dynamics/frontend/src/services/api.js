import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

export const getExercises = async (filters = {}) => {
  const params = new URLSearchParams();
  
  // Add filters to params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.append(key, value.join(','));
        }
      } else {
        params.append(key, value);
      }
    }
  });

  return api.get(`/api/exercises?${params.toString()}`);
};

export const getExerciseById = async (id) => {
  return api.get(`/api/exercises/${id}`);
};

export const getRandomExercises = async (count = 10) => {
  return api.get(`/api/exercises/random/${count}`);
};

export const getEquipmentTypes = async () => {
  return api.get('/api/exercises/equipment');
};

export const getMuscleGroups = async () => {
  return api.get('/api/exercises/muscles');
};

export const getHealth = async () => {
  return api.get('/api/health');
};

export default api;