import mongoose, { Schema, Document } from 'mongoose';
import { ILead } from '../types';
import { LEAD_STATUSES, LEAD_SOURCES, LeadStatus, LeadSource } from '../constants';

export interface ILeadDocument extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  toSafeLead(): ILead;
}

const LeadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      minlength: [2, 'Lead name must be at least 2 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    status: {
      type: String,
      enum: Object.values(LEAD_STATUSES),
      default: LEAD_STATUSES.NEW,
      required: true,
      index: true,
    },
    source: {
      type: String,
      enum: Object.values(LEAD_SOURCES),
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee lead email uniqueness per user
LeadSchema.index({ email: 1, createdBy: 1 }, { unique: true });

// Individual index on createdAt for sorting
LeadSchema.index({ createdAt: -1 });

// Text index for optimized text search operations
LeadSchema.index({ name: 'text', email: 'text' });

// Instance method to map the lead details safely
LeadSchema.methods.toSafeLead = function (): ILead {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    status: this.status,
    source: this.source,
    createdBy: this.createdBy.toString(),
    notes: this.notes,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const Lead = mongoose.model<ILeadDocument>('Lead', LeadSchema);
export default Lead;
