import express from 'express';
import { protect } from '../middleware/auth';
import {
  getRecentActivities,
  getUserActivities,
  getActivityStats
} from '../controllers/activityController';

const router = express.Router();

// Get recent activities for a specific farm
router.get('/farms/:farmId/activities', protect, getRecentActivities);

// Get activities for the current user
router.get('/user/activities', protect, getUserActivities);

// Get activity statistics for a farm
router.get('/farms/:farmId/activities/stats', protect, getActivityStats);

export default router;