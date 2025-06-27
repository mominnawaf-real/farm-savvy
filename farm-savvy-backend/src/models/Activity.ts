import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  type: 'animal_added' | 'animal_updated' | 'task_completed' | 'health_check' | 'weight_recorded' | 'farm_created' | 'user_joined';
  action: string;
  description: string;
  entityType: 'animal' | 'task' | 'farm' | 'user' | 'health' | 'weight';
  entityId: mongoose.Types.ObjectId;
  entityName?: string;
  user: mongoose.Types.ObjectId;
  farm: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['animal_added', 'animal_updated', 'task_completed', 'health_check', 'weight_recorded', 'farm_created', 'user_joined']
  },
  action: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  entityType: {
    type: String,
    required: true,
    enum: ['animal', 'task', 'farm', 'user', 'health', 'weight']
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'entityType'
  },
  entityName: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farm: {
    type: Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for efficient queries
activitySchema.index({ farm: 1, createdAt: -1 });
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ entityType: 1, entityId: 1 });

export default mongoose.model<IActivity>('Activity', activitySchema);