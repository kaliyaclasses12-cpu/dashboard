import { connectDB } from './mongodb';
import { OTP } from '@/models/OTP';
import { User } from '@/models/User';
import { IUser } from '@/models/User';

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Normalize phone number (remove +)
export function normalizePhoneNumber(countryCode: string, phoneNumber: string): string {
  const cleanCountryCode = countryCode.replace('+', '');
  return `${cleanCountryCode}${phoneNumber}`;
}

// Store OTP in database
export async function storeOTP(phoneNumber: string, otp: string): Promise<void> {
  await connectDB();
  
  // Delete any existing OTP for this number
  await OTP.deleteMany({ phoneNumber });
  
  // Create new OTP
  await OTP.create({
    phoneNumber,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  });
  
  console.log('✅ OTP stored for:', phoneNumber);
}

// Verify OTP
export async function verifyOTP(phoneNumber: string, userOtp: string): Promise<boolean> {
  await connectDB();
  
  // Find valid OTP
  const otpRecord = await OTP.findOne({
    phoneNumber,
    otp: userOtp,
    expiresAt: { $gt: new Date() },
  });
  
  if (!otpRecord) {
    console.log('❌ Invalid or expired OTP for:', phoneNumber);
    return false;
  }
  
  // Delete used OTP
  await OTP.deleteOne({ _id: otpRecord._id });
  
  console.log('✅ OTP verified for:', phoneNumber);
  return true;
}

// Create or update user
export async function createOrUpdateUser(phoneNumber: string): Promise<IUser> {
  await connectDB();
  
  const user = await User.findOneAndUpdate(
    { phoneNumber },
    { 
      isVerified: true,
      lastLogin: new Date(),
    },
    { 
      upsert: true,
      new: true,
    }
  );
  
  return user as IUser;
}