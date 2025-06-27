import { Router } from 'express';
import { protect } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(protect);

// Placeholder for animal routes
router.get('/', (_req, res) => {
  res.json({ message: 'Get all animals' });
});

export default router;