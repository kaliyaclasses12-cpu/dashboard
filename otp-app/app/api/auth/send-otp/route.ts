import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, storeOTP, normalizePhoneNumber } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    console.log('========== SEND OTP API CALLED ==========');
    
    // Get request body
    const body = await request.json();
    console.log('Request body:', body);
    
    const { phoneNumber, countryCode, channel } = body;

    // Validate
    if (!phoneNumber || !countryCode) {
      console.log('❌ Missing fields:', { phoneNumber, countryCode });
      return NextResponse.json(
        { error: 'Phone number and country code are required' },
        { status: 400 }
      );
    }

    if (!channel) {
      console.log('❌ Missing channel');
      return NextResponse.json(
        { error: 'Channel (whatsapp or sms) is required' },
        { status: 400 }
      );
    }

    // Format phone number
    const fullPhoneNumber = normalizePhoneNumber(countryCode, phoneNumber);
    const otp = generateOTP();
    
    console.log('📱 Phone:', fullPhoneNumber);
    console.log('💬 Channel:', channel);
    console.log('🔢 OTP:', otp);
    
    // Save to database
    await storeOTP(fullPhoneNumber, otp);
    console.log('✅ OTP saved to database');

    // Send via channel
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    console.log('Base URL:', baseUrl);
    
    if (!baseUrl) {
      console.error('❌ NEXT_PUBLIC_APP_URL not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (channel === 'whatsapp') {
      console.log('📱 Sending via WhatsApp...');
      const webhookUrl = `${baseUrl}/api/auth/send-whatsapp`;
      console.log('Webhook URL:', webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, countryCode, otp }),
      });

      console.log('WhatsApp response status:', response.status);
      const responseText = await response.text();
      console.log('WhatsApp response:', responseText);

      if (!response.ok) {
        return NextResponse.json(
          { error: `WhatsApp failed: ${responseText}` },
          { status: response.status }
        );
      }
      
    } else if (channel === 'sms') {
      console.log('📱 Sending via SMS...');
      const webhookUrl = `${baseUrl}/api/auth/send-sms`;
      console.log('Webhook URL:', webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, countryCode, otp }),
      });

      console.log('SMS response status:', response.status);
      const responseText = await response.text();
      console.log('SMS response:', responseText);

      if (!response.ok) {
        return NextResponse.json(
          { error: `SMS failed: ${responseText}` },
          { status: response.status }
        );
      }
      
    } else {
      console.log('❌ Invalid channel:', channel);
      return NextResponse.json(
        { error: 'Invalid channel. Use whatsapp or sms' },
        { status: 400 }
      );
    }

    console.log('✅ OTP sent successfully!');
    return NextResponse.json({
      success: true,
      message: `Code sent via ${channel}`,
    });
    
  } catch (error) {
    console.error('❌ Send OTP error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}