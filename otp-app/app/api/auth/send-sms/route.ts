import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, countryCode, otp } = await request.json();

    if (!phoneNumber || !countryCode || !otp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format India number correctly
    const cleanCountryCode = countryCode.replace('+', '');
    const fullPhoneNumber = `+${cleanCountryCode}${phoneNumber}`;
    
    // Clean message (plain text for India SMS)
    const message = `Your verification code is: ${otp}\n\nThis code expires in 5 minutes.\n\nOTP: ${otp}`;

    // Get Twilio credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFromNumber = process.env.TWILIO_PHONE_NUMBER;

    console.log('========== SENDING SMS TO INDIA ==========');
    console.log('From (Twilio):', twilioFromNumber);
    console.log('To (India):', fullPhoneNumber);
    console.log('OTP:', otp);

    // Validate credentials
    if (!accountSid || !authToken || !twilioFromNumber) {
      console.error('❌ Missing Twilio credentials');
      return NextResponse.json(
        { error: 'SMS service not configured' },
        { status: 500 }
      );
    }

    // Validate India number format
    if (!fullPhoneNumber.match(/^\+91[0-9]{10}$/)) {
      console.error('❌ Invalid India number format:', fullPhoneNumber);
      return NextResponse.json(
        { error: 'Invalid India phone number. Must be +91 followed by 10 digits' },
        { status: 400 }
      );
    }

    // Create Twilio client
    const client = twilio(accountSid, authToken);

    // Send SMS
    const response = await client.messages.create({
      body: message,
      to: fullPhoneNumber,
      from: twilioFromNumber,
    });

    console.log('✅ SMS sent to India!');
    console.log('   SID:', response.sid);
    console.log('   Status:', response.status);

    return NextResponse.json({ 
      success: true, 
      message: 'SMS sent successfully',
      sid: response.sid
    });
    
  } catch (error: any) {
    console.error('❌ SMS error:', error);
    
    // India-specific error messages
    if (error.code === 21212) {
      return NextResponse.json(
        { error: 'Invalid Twilio number. Use a US or verified Indian number' },
        { status: 400 }
      );
    }
    
    if (error.code === 21211) {
      return NextResponse.json(
        { error: 'Invalid India phone number. Use format: +91XXXXXXXXXX' },
        { status: 400 }
      );
    }
    
    if (error.code === 21608) {
      return NextResponse.json(
        { error: 'Trial account restriction. Verify your number in Twilio dashboard first.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to send SMS' },
      { status: 500 }
    );
  }
}