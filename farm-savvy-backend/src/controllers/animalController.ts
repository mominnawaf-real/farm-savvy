import { Response } from 'express';
import { validationResult } from 'express-validator';
import Animal from '../models/Animal';
import Farm from '../models/Farm';
import { AuthRequest } from '../middleware/auth';
import { createActivity } from './activityController';

export const createAnimal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { farmId, ...animalData } = req.body;

    // Check if user has access to the farm
    const farm = await Farm.findById(farmId);
    if (!farm) {
      res.status(404).json({ success: false, error: 'Farm not found' });
      return;
    }

    // Check if user is authorized (owner, manager, or admin)
    const userId = (req.user as any)._id.toString();
    const isAuthorized = 
      farm.owner.toString() === userId ||
      farm.managers.some(id => id.toString() === userId) ||
      req.user!.role === 'admin';

    if (!isAuthorized) {
      res.status(403).json({ success: false, error: 'Not authorized to add animals to this farm' });
      return;
    }

    const animal = new Animal({
      ...animalData,
      farm: farmId
    });

    await animal.save();

    // Log activity
    try {
      await createActivity({
        type: 'animal_added',
        action: 'added',
        description: `Added new animal ${animal.name} (#${animal.tagNumber})`,
        entityType: 'animal',
        entityId: (animal._id as any).toString(),
        entityName: animal.name,
        userId: userId,
        farmId: farmId,
        metadata: {
          tagNumber: animal.tagNumber,
          type: animal.type,
          breed: animal.breed
        }
      });
    } catch (activityError) {
      console.error('Failed to log activity:', activityError);
      // Don't fail the request if activity logging fails
    }

    res.status(201).json({
      success: true,
      animal: animal
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, error: 'Tag number already exists' });
      return;
    }
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export const getAnimals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farmId, type, status } = req.query;
    const query: any = {};

    if (farmId) {
      // Check if user has access to the farm
      const farm = await Farm.findById(farmId);
      if (!farm) {
        res.status(404).json({ success: false, error: 'Farm not found' });
        return;
      }

      const userId = (req.user as any)._id.toString();
      const isAuthorized = 
        farm.owner.toString() === userId ||
        farm.managers.some(id => id.toString() === userId) ||
        farm.workers.some(id => id.toString() === userId) ||
        req.user!.role === 'admin';

      if (!isAuthorized) {
        res.status(403).json({ success: false, error: 'Not authorized to view animals from this farm' });
        return;
      }

      query.farm = farmId;
    } else if (req.user!.role !== 'admin') {
      // Non-admin users must specify a farm
      res.status(400).json({ success: false, error: 'Farm ID is required' });
      return;
    }

    if (type) query.type = type;
    if (status) query.status = status;

    const animals = await Animal.find(query)
      .populate('farm', 'name')
      .populate('parentIds.mother', 'tagNumber name')
      .populate('parentIds.father', 'tagNumber name')
      .sort('-createdAt');

    res.json({
      success: true,
      count: animals.length,
      data: animals
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export const getAnimalStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farmId } = req.params;

    // Check if user has access to the farm
    const farm = await Farm.findById(farmId);
    if (!farm) {
      res.status(404).json({ success: false, error: 'Farm not found' });
      return;
    }

    const userId = (req.user as any)._id.toString();
    const isAuthorized = 
      farm.owner.toString() === userId ||
      farm.managers.some(id => id.toString() === userId) ||
      farm.workers.some(id => id.toString() === userId) ||
      req.user!.role === 'admin';

    if (!isAuthorized) {
      res.status(403).json({ success: false, error: 'Not authorized to view stats for this farm' });
      return;
    }

    // Get all animals for the farm
    const animals = await Animal.find({ farm: farmId });
    
    // Calculate statistics
    const totalAnimals = animals.length;
    const healthyAnimals = animals.filter(animal => animal.status === 'healthy').length;
    const sickAnimals = animals.filter(animal => animal.status === 'sick').length;
    const quarantineAnimals = animals.filter(animal => animal.status === 'quarantine').length;
    
    // Calculate health rate
    const healthRate = totalAnimals > 0 ? Math.round((healthyAnimals / totalAnimals) * 100) : 100;

    // Group by type
    const animalsByType = animals.reduce((acc, animal) => {
      acc[animal.type] = (acc[animal.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      stats: {
        total: totalAnimals,
        healthy: healthyAnimals,
        sick: sickAnimals,
        quarantine: quarantineAnimals,
        healthRate: healthRate,
        byType: animalsByType,
        lastUpdated: new Date()
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export const getAnimalById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const animal = await Animal.findById(req.params.id)
      .populate('farm', 'name')
      .populate('parentIds.mother', 'tagNumber name')
      .populate('parentIds.father', 'tagNumber name');

    if (!animal) {
      res.status(404).json({ success: false, error: 'Animal not found' });
      return;
    }

    // Check if user has access to the farm
    const farm = await Farm.findById(animal.farm);
    if (!farm) {
      res.status(404).json({ success: false, error: 'Associated farm not found' });
      return;
    }

    const userId = (req.user as any)._id.toString();
    const isAuthorized = 
      farm.owner.toString() === userId ||
      farm.managers.some(id => id.toString() === userId) ||
      farm.workers.some(id => id.toString() === userId) ||
      req.user!.role === 'admin';

    if (!isAuthorized) {
      res.status(403).json({ success: false, error: 'Not authorized to view this animal' });
      return;
    }

    res.json({
      success: true,
      data: animal
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export const updateAnimal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      res.status(404).json({ success: false, error: 'Animal not found' });
      return;
    }

    // Check if user has access to the farm
    const farm = await Farm.findById(animal.farm);
    if (!farm) {
      res.status(404).json({ success: false, error: 'Associated farm not found' });
      return;
    }

    const userId = (req.user as any)._id.toString();
    const isAuthorized = 
      farm.owner.toString() === userId ||
      farm.managers.some(id => id.toString() === userId) ||
      req.user!.role === 'admin';

    if (!isAuthorized) {
      res.status(403).json({ success: false, error: 'Not authorized to update this animal' });
      return;
    }

    // Don't allow changing the farm
    const { farm: farmUpdate, ...updateData } = req.body;

    const updatedAnimal = await Animal.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('farm', 'name')
     .populate('parentIds.mother', 'tagNumber name')
     .populate('parentIds.father', 'tagNumber name');

    // Log activity for significant updates
    if (updateData.weight || updateData.status || updateData.name) {
      try {
        let description = `Updated animal ${updatedAnimal!.name} (#${updatedAnimal!.tagNumber})`;
        if (updateData.weight) description += ` - weight: ${updateData.weight} lbs`;
        if (updateData.status) description += ` - status: ${updateData.status}`;
        
        await createActivity({
          type: 'animal_updated',
          action: 'updated',
          description,
          entityType: 'animal',
          entityId: (updatedAnimal!._id as any).toString(),
          entityName: updatedAnimal!.name,
          userId: userId,
          farmId: (farm._id as any).toString(),
          metadata: updateData
        });
      } catch (activityError) {
        console.error('Failed to log activity:', activityError);
      }
    }

    res.json({
      success: true,
      data: updatedAnimal
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, error: 'Tag number already exists' });
      return;
    }
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export const deleteAnimal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      res.status(404).json({ success: false, error: 'Animal not found' });
      return;
    }

    // Check if user has access to the farm
    const farm = await Farm.findById(animal.farm);
    if (!farm) {
      res.status(404).json({ success: false, error: 'Associated farm not found' });
      return;
    }

    const userId = (req.user as any)._id.toString();
    const isOwnerOrAdmin = 
      farm.owner.toString() === userId ||
      req.user!.role === 'admin';

    if (!isOwnerOrAdmin) {
      res.status(403).json({ success: false, error: 'Only farm owner or admin can delete animals' });
      return;
    }

    await animal.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export const addHealthRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      res.status(404).json({ success: false, error: 'Animal not found' });
      return;
    }

    // Check if user has access to the farm
    const farm = await Farm.findById(animal.farm);
    if (!farm) {
      res.status(404).json({ success: false, error: 'Associated farm not found' });
      return;
    }

    const userId = (req.user as any)._id.toString();
    const isAuthorized = 
      farm.owner.toString() === userId ||
      farm.managers.some(id => id.toString() === userId) ||
      req.user!.role === 'admin';

    if (!isAuthorized) {
      res.status(403).json({ success: false, error: 'Not authorized to add health records' });
      return;
    }

    animal.healthRecords.push(req.body);
    await animal.save();

    // Log health check activity
    try {
      await createActivity({
        type: 'health_check',
        action: 'recorded',
        description: `Health check recorded for ${animal.name} (#${animal.tagNumber}) - ${req.body.type}`,
        entityType: 'animal',
        entityId: (animal._id as any).toString(),
        entityName: animal.name,
        userId: userId,
        farmId: (farm._id as any).toString(),
        metadata: {
          healthType: req.body.type,
          veterinarian: req.body.veterinarian,
          cost: req.body.cost
        }
      });
    } catch (activityError) {
      console.error('Failed to log activity:', activityError);
    }

    res.json({
      success: true,
      data: animal
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};