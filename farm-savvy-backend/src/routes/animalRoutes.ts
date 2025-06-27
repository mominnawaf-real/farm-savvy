import { Router } from 'express';
import { body } from 'express-validator';
import {
  createAnimal,
  getAnimals,
  getAnimalById,
  getAnimalStats,
  updateAnimal,
  deleteAnimal,
  addHealthRecord
} from '../controllers/animalController';
import { protect as auth } from '../middleware/auth';

const router = Router();

// Validation for creating/updating animals
const animalValidation = [
  body('tagNumber').notEmpty().withMessage('Tag number is required'),
  body('type').isIn(['cattle', 'sheep', 'goat', 'pig', 'chicken', 'duck', 'turkey', 'other'])
    .withMessage('Invalid animal type'),
  body('breed').notEmpty().withMessage('Breed is required'),
  body('gender').isIn(['male', 'female']).withMessage('Gender must be male or female'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('weight').isFloat({ min: 0 }).withMessage('Weight must be a positive number')
];

// Validation for health records
const healthRecordValidation = [
  body('date').isISO8601().withMessage('Valid date is required'),
  body('type').isIn(['vaccination', 'treatment', 'checkup']).withMessage('Invalid health record type'),
  body('description').notEmpty().withMessage('Description is required'),
  body('veterinarian').optional().isString(),
  body('nextDue').optional().isISO8601()
];

// All routes require authentication
router.use(auth);

// Get all animals (with optional filters)
router.get('/', getAnimals);

// Get animal statistics for a farm
router.get('/farms/:farmId/stats', getAnimalStats);

// Get a specific animal
router.get('/:id', getAnimalById);

// Create a new animal
router.post('/', [
  body('farmId').isMongoId().withMessage('Valid farm ID is required'),
  ...animalValidation
], createAnimal);

// Update an animal
router.put('/:id', animalValidation, updateAnimal);

// Delete an animal
router.delete('/:id', deleteAnimal);

// Add health record to an animal
router.post('/:id/health-records', healthRecordValidation, addHealthRecord);

export default router;