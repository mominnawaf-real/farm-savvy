import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Placeholder for user routes
router.use(protect);

// Admin only routes
router.get('/', authorize('admin'), (_req, res) => {
  res.json({ message: 'Get all users - Admin only' });
});

export default router;