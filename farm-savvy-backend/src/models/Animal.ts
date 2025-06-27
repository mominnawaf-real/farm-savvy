import mongoose, { Document, Schema } from 'mongoose';

export interface IAnimal extends Document {
  farm: mongoose.Types.ObjectId;
  tagNumber: string;
  name?: string;
  type: 'cattle' | 'sheep' | 'goat' | 'pig' | 'chicken' | 'duck' | 'turkey' | 'other';
  breed: string;
  gender: 'male' | 'female';
  dateOfBirth: Date;
  weight: number; // in kg
  status: 'healthy' | 'sick' | 'quarantine' | 'sold' | 'deceased';
  healthRecords: {
    date: Date;
    type: 'vaccination' | 'treatment' | 'checkup';
    description: string;
    veterinarian?: string;
    nextDue?: Date;
  }[];
  parentIds?: {
    mother?: mongoose.Types.ObjectId;
    father?: mongoose.Types.ObjectId;
  };
  purchaseInfo?: {
    date: Date;
    price: number;
    supplier: string;
  };
  saleInfo?: {
    date: Date;
    price: number;
    buyer: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const animalSchema = new Schema<IAnimal>({
  farm: {
    type: Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  tagNumber: {
    type: String,
    required: [true, 'Please provide a tag number'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please specify animal type'],
    enum: ['cattle', 'sheep', 'goat', 'pig', 'chicken', 'duck', 'turkey', 'other']
  },
  breed: {
    type: String,
    required: [true, 'Please specify breed']
  },
  gender: {
    type: String,
    required: [true, 'Please specify gender'],
    enum: ['male', 'female']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please provide date of birth']
  },
  weight: {
    type: Number,
    required: [true, 'Please provide weight'],
    min: [0, 'Weight cannot be negative']
  },
  status: {
    type: String,
    enum: ['healthy', 'sick', 'quarantine', 'sold', 'deceased'],
    default: 'healthy'
  },
  healthRecords: [{
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['vaccination', 'treatment', 'checkup']
    },
    description: {
      type: String,
      required: true
    },
    veterinarian: String,
    nextDue: Date
  }],
  parentIds: {
    mother: {
      type: Schema.Types.ObjectId,
      ref: 'Animal'
    },
    father: {
      type: Schema.Types.ObjectId,
      ref: 'Animal'
    }
  },
  purchaseInfo: {
    date: Date,
    price: Number,
    supplier: String
  },
  saleInfo: {
    date: Date,
    price: Number,
    buyer: String
  }
}, {
  timestamps: true
});

// Compound index for farm and status queries
animalSchema.index({ farm: 1, status: 1 });
animalSchema.index({ farm: 1, type: 1 });

// Virtual for age calculation
animalSchema.virtual('age').get(function() {
  const ageDiffMs = Date.now() - this.dateOfBirth.getTime();
  const ageDate = new Date(ageDiffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

export default mongoose.model<IAnimal>('Animal', animalSchema);