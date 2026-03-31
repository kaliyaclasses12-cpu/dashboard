import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, countryCode, otp } = await request.json();

    if (!phoneNumber || !countryCode || !otp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format phone number
    const cleanCountryCode = countryCode.replace('+', '');
    const fullPhoneNumber = `${cleanCountryCode}${phoneNumber}`;
    const message = `🔐 Your verification code is: *${otp}*\n\nThis code expires in 5 minutes.`;

    // Get API key
    const apiKey = process.env.WHAPI_API_KEY;
    
    console.log('========== WHATSAPP API ==========');
    console.log('API Key exists:', !!apiKey);
    console.log('API Key value:', apiKey);
    console.log('Sending to:', fullPhoneNumber);
    
    if (!apiKey) {
      console.error('❌ WHAPI_API_KEY not found in .env.local');
      return NextResponse.json(
        { error: 'API key not configured. Add WHAPI_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    // Send WhatsApp message
    const response = await fetch('https://gate.whapi.cloud/messages/text', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: fullPhoneNumber,
        body: message,
      }),
    });

    const responseText = await response.text();
    console.log('Whapi response status:', response.status);
    console.log('Whapi response body:', responseText);

    if (response.ok) {
      console.log('✅ WhatsApp message sent!');
      return NextResponse.json({ success: true });
    } else if (response.status === 401) {
      console.error('❌ Invalid API key');
      return NextResponse.json(
        { error: 'Invalid API key. Please check WHAPI_API_KEY in .env.local' },
        { status: 401 }
      );
    } else {
      return NextResponse.json(
        { error: `WhatsApp API error: ${responseText}` },
        { status: response.status }
      );
    }
    
  } catch (error) {
    console.error('WhatsApp error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send' },
      { status: 500 }
    );
  }
}