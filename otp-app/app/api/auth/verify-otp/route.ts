import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, createOrUpdateUser, normalizePhoneNumber } from '@/lib/otp';
import { VerifyOTPRequest, VerifyOTPResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: VerifyOTPRequest = await request.json();
    const { phoneNumber, countryCode, otp } = body;

    if (!phoneNumber || !countryCode || !otp) {
      return NextResponse.json<VerifyOTPResponse>(
        { success: false, error: 'Phone number, country code, and OTP are required' },
        { status: 400 }
      );
    }

    // Normalize phone number
    const fullPhoneNumber = normalizePhoneNumber(countryCode, phoneNumber);
    
    // Verify OTP
    const isValid = await verifyOTP(fullPhoneNumber, otp);

    if (isValid) {
      // Create or update user
      const user = await createOrUpdateUser(fullPhoneNumber);
      
      return NextResponse.json<VerifyOTPResponse>({
        success: true,
        message: 'OTP verified successfully',
        user: {
          phoneNumber: fullPhoneNumber,
          verified: user.isVerified,
          createdAt: user.createdAt,
        },
      });
    } else {
      return NextResponse.json<VerifyOTPResponse>(
        { success: false, error: 'Invalid or expired code' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json<VerifyOTPResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}