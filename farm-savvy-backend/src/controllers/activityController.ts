import { Response } from 'express';
import mongoose from 'mongoose';
import Activity from '../models/Activity';
import { AuthRequest } from '../middleware/auth';

// Get recent activities for a farm
export const getRecentActivities = async (req: AuthRequest, res: Response) => {
  try {
    const { farmId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    // Verify user has access to this farm
    // TODO: Add proper farm access validation

    const activities = await Activity.find({ farm: farmId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(offset));

    const total = await Activity.countDocuments({ farm: farmId });

    res.json({
      success: true,
      activities,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activities'
    });
  }
};

// Get activities for the current user
export const getUserActivities = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { limit = 10, offset = 0 } = req.query;

    const activities = await Activity.find({ user: userId })
      .populate('farm', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(offset));

    const total = await Activity.countDocuments({ user: userId });

    res.json({
      success: true,
      activities,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user activities'
    });
  }
};

// Create activity (usually called internally by other controllers)
export const createActivity = async (data: {
  type: string;
  action: string;
  description: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  userId: string;
  farmId: string;
  metadata?: Record<string, any>;
}) => {
  try {
    const activity = await Activity.create({
      type: data.type,
      action: data.action,
      description: data.description,
      entityType: data.entityType,
      entityId: data.entityId,
      entityName: data.entityName,
      user: data.userId,
      farm: data.farmId,
      metadata: data.metadata
    });

    return activity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

// Get activity statistics for a farm
export const getActivityStats = async (req: AuthRequest, res: Response) => {
  try {
    const { farmId } = req.params;
    const { days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const stats = await Activity.aggregate([
      {
        $match: {
          farm: new mongoose.Types.ObjectId(farmId),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      stats,
      period: {
        start: startDate,
        end: new Date(),
        days: Number(days)
      }
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity statistics'
    });
  }
};