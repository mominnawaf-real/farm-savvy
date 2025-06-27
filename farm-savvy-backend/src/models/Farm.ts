import mongoose, { Document, Schema } from 'mongoose';

export interface IFarm extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  managers: mongoose.Types.ObjectId[];
  workers: mongoose.Types.ObjectId[];
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  size: number; // in acres
  type: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const farmSchema = new Schema<IFarm>({
  name: {
    type: String,
    required: [true, 'Please provide a farm name'],
    trim: true,
    maxlength: [100, 'Farm name cannot be more than 100 characters']
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  managers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  workers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  location: {
    address: {
      type: String,
      required: [true, 'Please provide a farm address']
    },
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Please provide latitude']
      },
      longitude: {
        type: Number,
        required: [true, 'Please provide longitude']
      }
    }
  },
  size: {
    type: Number,
    required: [true, 'Please provide farm size'],
    min: [0, 'Farm size cannot be negative']
  },
  type: [{
    type: String,
    enum: ['dairy', 'poultry', 'crop', 'mixed', 'livestock', 'organic']
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for geospatial queries
farmSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model<IFarm>('Farm', farmSchema);