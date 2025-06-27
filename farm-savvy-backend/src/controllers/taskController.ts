import { Response } from 'express';
import { validationResult } from 'express-validator';
import Task from '../models/Task';
import Farm from '../models/Farm';
import { AuthRequest } from '../middleware/auth';
import { createActivity } from './activityController';

// Create a new task
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { farmId, ...taskData } = req.body;
    const userId = (req.user as any)._id.toString();

    // Check if user has access to the farm
    const farm = await Farm.findById(farmId);
    if (!farm) {
      res.status(404).json({ success: false, error: 'Farm not found' });
      return;
    }

    // Check authorization
    const isAuthorized = 
      farm.owner.toString() === userId ||
      farm.managers.some(id => id.toString() === userId) ||
      req.user!.role === 'admin';

    if (!isAuthorized) {
      res.status(403).json({ success: false, error: 'Not authorized to create tasks for this farm' });
      return;
    }

    const task = new Task({
      ...taskData,
      farm: farmId,
      createdBy: userId
    });

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    // Log activity
    try {
      await createActivity({
        type: 'task_completed',
        action: 'created',
        description: `Created task: ${task.title}`,
        entityType: 'task',
        entityId: (task._id as any).toString(),
        entityName: task.title,
        userId: userId,
        farmId: farmId,
        metadata: {
          category: task.category,
          priority: task.priority,
          dueDate: task.dueDate
        }
      });
    } catch (activityError) {
      console.error('Failed to log activity:', activityError);
    }

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

// Get tasks for a farm
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farmId } = req.params;
    const { status, category, priority, assignedTo, dateFrom, dateTo } = req.query;
    const userId = (req.user as any)._id.toString();

    // Check if user has access to the farm
    const farm = await Farm.findById(farmId);
    if (!farm) {
      res.status(404).json({ success: false, error: 'Farm not found' });
      return;
    }

    const isAuthorized = 
      farm.owner.toString() === userId ||
      farm.managers.some(id => id.toString() === userId) ||
      farm.workers.some(id => id.toString() === userId) ||
      req.user!.role === 'admin';

    if (!isAuthorized) {
      res.status(403).json({ success: false, error: 'Not authorized to view tasks for this farm' });
      return;
    }

    // Build query
    const query: any = { farm: farmId };
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    
    if (dateFrom || dateTo) {
      query.dueDate = {};
      if (dateFrom) query.dueDate.$gte = new Date(dateFrom as string);
      if (dateTo) query.dueDate.$lte = new Date(dateTo as string);
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('completedBy', 'name email')
      .sort({ dueDate: 1, priority: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

// Get today's tasks for dashboard
export const getTodayTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farmId } = req.params;
    const userId = (req.user as any)._id.toString();

    // Check if user has access to the farm
    const farm = await Farm.findById(farmId);
    if (!farm) {
      res.status(404).json({ success: false, error: 'Farm not found' });
      return;
    }

    const isAuthorized = 
      farm.owner.toString() === userId ||
      farm.managers.some(id => id.toString() === userId) ||
      farm.workers.some(id => id.toString() === userId) ||
      req.user!.role === 'admin';

    if (!isAuthorized) {
      res.status(403).json({ success: false, error: 'Not authorized to view tasks for this farm' });
      return;
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
      farm: farmId,
      dueDate: { $gte: today, $lt: tomorrow }
    })
      .populate('assignedTo', 'name email')
      .populate('completedBy', 'name email')
      .sort({ priority: -1, status: 1 }); // Sort by priority first, then status (completed last)

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

// Get task by ID
export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('completedBy', 'name email')
      .populate('farm', 'name');

    if (!task) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }

    // Check if user has access to the farm
    const userId = (req.user as any)._id.toString();
    const farm = await Farm.findById(task.farm);
    
    if (!farm) {
      res.status(404).json({ success: false, error: 'Associated farm not found' });
      return;
    }

    const isAuthorized = 
      farm.owner.toString() === userId ||
      farm.managers.some(id => id.toString() === userId) ||
      farm.workers.some(id => id.toString() === userId) ||
      req.user!.role === 'admin';

    if (!isAuthorized) {
      res.status(403).json({ success: false, error: 'Not authorized to view this task' });
      return;
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

// Update task
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }

    const userId = (req.user as any)._id.toString();
    const farm = await Farm.findById(task.farm);
    
    if (!farm) {
      res.status(404).json({ success: false, error: 'Associated farm not found' });
      return;
    }

    // Check authorization
    const isAuthorized = 
      farm.owner.toString() === userId ||
      farm.managers.some(id => id.toString() === userId) ||
      req.user!.role === 'admin';

    if (!isAuthorized) {
      res.status(403).json({ success: false, error: 'Not authorized to update this task' });
      return;
    }

    // Don't allow changing the farm
    const { farm: farmUpdate, ...updateData } = req.body;

    // If marking as completed, set completedBy
    if (updateData.status === 'completed' && task.status !== 'completed') {
      updateData.completedBy = userId;
      updateData.completedAt = new Date();
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('completedBy', 'name email');

    // Log activity for task completion
    if (updateData.status === 'completed' && task.status !== 'completed') {
      try {
        await createActivity({
          type: 'task_completed',
          action: 'completed',
          description: `Completed task: ${updatedTask!.title}`,
          entityType: 'task',
          entityId: (updatedTask!._id as any).toString(),
          entityName: updatedTask!.title,
          userId: userId,
          farmId: (farm._id as any).toString(),
          metadata: {
            category: updatedTask!.category,
            priority: updatedTask!.priority
          }
        });
      } catch (activityError) {
        console.error('Failed to log activity:', activityError);
      }
    }

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

// Delete task
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }

    const userId = (req.user as any)._id.toString();
    const farm = await Farm.findById(task.farm);
    
    if (!farm) {
      res.status(404).json({ success: false, error: 'Associated farm not found' });
      return;
    }

    // Only owner or admin can delete
    const isOwnerOrAdmin = 
      farm.owner.toString() === userId ||
      req.user!.role === 'admin';

    if (!isOwnerOrAdmin) {
      res.status(403).json({ success: false, error: 'Only farm owner or admin can delete tasks' });
      return;
    }

    await task.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

// Get task statistics for a farm
export const getTaskStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farmId } = req.params;
    const userId = (req.user as any)._id.toString();

    // Check if user has access to the farm
    const farm = await Farm.findById(farmId);
    if (!farm) {
      res.status(404).json({ success: false, error: 'Farm not found' });
      return;
    }

    const isAuthorized = 
      farm.owner.toString() === userId ||
      farm.managers.some(id => id.toString() === userId) ||
      farm.workers.some(id => id.toString() === userId) ||
      req.user!.role === 'admin';

    if (!isAuthorized) {
      res.status(403).json({ success: false, error: 'Not authorized to view task stats for this farm' });
      return;
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's tasks
    const todayTasks = await Task.find({
      farm: farmId,
      dueDate: { $gte: today, $lt: tomorrow }
    });

    const todayTotal = todayTasks.length;
    const todayCompleted = todayTasks.filter(task => task.status === 'completed').length;
    const todayPending = todayTasks.filter(task => task.status === 'pending' || task.status === 'in-progress').length;

    res.json({
      success: true,
      stats: {
        today: {
          total: todayTotal,
          completed: todayCompleted,
          pending: todayPending
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

// Mark task as complete
export const completeTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }

    const userId = (req.user as any)._id.toString();
    const farm = await Farm.findById(task.farm);
    
    if (!farm) {
      res.status(404).json({ success: false, error: 'Associated farm not found' });
      return;
    }

    // Check if user is assigned to task or is a manager/owner
    const isAssigned = task.assignedTo.some(id => id.toString() === userId);
    const isManagerOrOwner = 
      farm.owner.toString() === userId ||
      farm.managers.some(id => id.toString() === userId) ||
      req.user!.role === 'admin';

    if (!isAssigned && !isManagerOrOwner) {
      res.status(403).json({ success: false, error: 'Not authorized to complete this task' });
      return;
    }

    task.status = 'completed';
    task.completedBy = userId as any;
    task.completedAt = new Date();

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');
    await task.populate('completedBy', 'name email');

    // Log activity
    try {
      await createActivity({
        type: 'task_completed',
        action: 'completed',
        description: `Completed task: ${task.title}`,
        entityType: 'task',
        entityId: (task._id as any).toString(),
        entityName: task.title,
        userId: userId,
        farmId: (farm._id as any).toString(),
        metadata: {
          category: task.category,
          priority: task.priority
        }
      });
    } catch (activityError) {
      console.error('Failed to log activity:', activityError);
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

// Mark task as pending (undo completion)
export const uncompleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }

    const userId = (req.user as any)._id.toString();
    const farm = await Farm.findById(task.farm);
    
    if (!farm) {
      res.status(404).json({ success: false, error: 'Associated farm not found' });
      return;
    }

    // Check if user is assigned to task or is a manager/owner
    const isAssigned = task.assignedTo.some(id => id.toString() === userId);
    const isManagerOrOwner = 
      farm.owner.toString() === userId ||
      farm.managers.some(id => id.toString() === userId) ||
      req.user!.role === 'admin';

    if (!isAssigned && !isManagerOrOwner) {
      res.status(403).json({ success: false, error: 'Not authorized to modify this task' });
      return;
    }

    task.status = 'pending';
    task.completedBy = undefined;
    task.completedAt = undefined;

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.json({
      success: true,
      data: task
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};