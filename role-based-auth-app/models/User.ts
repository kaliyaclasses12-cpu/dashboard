import mongoose from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isVerified: boolean;
  otp?: {
    code: string;
    expiresAt: Date;
  };
  createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    code: String,
    expiresAt: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure only one admin exists
userSchema.pre('save', async function(next) {
  if (this.role === 'admin') {
    const adminExists = await mongoose.model('User').findOne({ role: 'admin' });
    if (adminExists && adminExists._id.toString() !== this._id.toString()) {
      next(new Error('Admin user already exists'));
    }
  }
  next();
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;