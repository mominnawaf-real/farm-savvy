import { Router } from 'express';
import { protect } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(protect);

// Placeholder for farm routes
router.get('/', (_req, res) => {
  res.json({ message: 'Get all farms' });
});

export default router;