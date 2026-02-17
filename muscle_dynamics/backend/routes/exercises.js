const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');

// GET all exercises with filters
router.get('/', async (req, res) => {
  try {
    const { 
      muscles, 
      equipment, 
      category, 
      search,
      limit = 50,
      page = 1 
    } = req.query;

    let filter = {};

    // Filter by muscles (search in primary or secondary muscles)
    if (muscles) {
      const muscleArray = Array.isArray(muscles) ? muscles : muscles.split(',');
      filter.$or = [
        { primaryMuscles: { $in: muscleArray } },
        { secondaryMuscles: { $in: muscleArray } }
      ];
    }

    // Filter by equipment
    if (equipment) {
      const equipmentArray = Array.isArray(equipment) ? equipment : equipment.split(',');
      filter.equipment = { $in: equipmentArray };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Search by name
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const exercises = await Exercise.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });

    const total = await Exercise.countDocuments(filter);

    res.json({
      exercises,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ message: 'Error fetching exercises', error: error.message });
  }
});

// GET unique equipment types
router.get('/equipment', async (req, res) => {
  try {
    const equipment = await Exercise.distinct('equipment');
    res.json(equipment.filter(e => e)); // Remove null/empty values
  } catch (error) {
    res.status(500).json({ message: 'Error fetching equipment', error: error.message });
  }
});

// GET unique muscle groups
router.get('/muscles', async (req, res) => {
  try {
    const primaryMuscles = await Exercise.distinct('primaryMuscles');
    const secondaryMuscles = await Exercise.distinct('secondaryMuscles');
    
    // Combine and deduplicate
    const allMuscles = [...new Set([...primaryMuscles, ...secondaryMuscles])].filter(m => m);
    
    res.json(allMuscles.sort());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching muscles', error: error.message });
  }
});

// GET exercise by ID
router.get('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.status(500).json({ message: 'Error fetching exercise', error: error.message });
  }
});

// GET random exercises
router.get('/random/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const exercises = await Exercise.aggregate([
      { $sample: { size: count } }
    ]);
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching random exercises', error: error.message });
  }
});

module.exports = router;