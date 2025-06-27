import { Router } from 'express';
import { body } from 'express-validator';
import {
  createTask,
  getTasks,
  getTodayTasks,
  getTaskById,
  getTaskStats,
  updateTask,
  deleteTask,
  completeTask,
  uncompleteTask
} from '../controllers/taskController';
import { protect } from '../middleware/auth';

const router = Router();

// Validation for creating/updating tasks
const taskValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['feeding', 'cleaning', 'health', 'maintenance', 'harvest', 'other'])
    .withMessage('Invalid task category'),
  body('priority').isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('assignedTo').optional().isArray().withMessage('AssignedTo must be an array'),
  body('assignedTo.*').optional().isMongoId().withMessage('Invalid user ID in assignedTo')
];

// All routes require authentication
router.use(protect);

// Get all tasks for a farm
router.get('/farms/:farmId', getTasks);

// Get today's tasks for a farm
router.get('/farms/:farmId/today', getTodayTasks);

// Get task statistics for a farm
router.get('/farms/:farmId/stats', getTaskStats);

// Get a specific task
router.get('/:id', getTaskById);

// Create a new task
router.post('/', [
  body('farmId').isMongoId().withMessage('Valid farm ID is required'),
  ...taskValidation
], createTask);

// Update a task
router.put('/:id', taskValidation, updateTask);

// Mark task as complete (convenience endpoint)
router.patch('/:id/complete', completeTask);

// Mark task as pending (undo complete)
router.patch('/:id/uncomplete', uncompleteTask);

// Delete a task
router.delete('/:id', deleteTask);

export default router;