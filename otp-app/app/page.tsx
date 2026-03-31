'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import PhoneInput from '@/components/PhoneInput';
import OTPForm from '@/components/OTPForm';

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone'); // 👈 Add type
  const [phoneNumber, setPhoneNumber] = useState<string>(''); // 👈 Add type
  const [countryCode, setCountryCode] = useState<string>(''); // 👈 Add type
  const [selectedChannel, setSelectedChannel] = useState<string>('whatsapp'); // 👈 Add type
  const [loading, setLoading] = useState<boolean>(false); // 👈 Add type

  // Send OTP via selected channel
  const handleSendOTP = async (phone: string, code: string, channel: string) => { // 👈 Add types
    setLoading(true);
    setSelectedChannel(channel);
    
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phone,
          countryCode: code,
          channel: channel,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPhoneNumber(phone);
        setCountryCode(code);
        setStep('otp');
        toast.success(`Code sent via ${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}!`);
      } else {
        toast.error(data.error || 'Failed to send code');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (otp: string) => { // 👈 Add type
    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, countryCode, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Login successful!');
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Invalid code');
      }
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'phone' ? 'Login with OTP' : 'Enter Code'}
          </h1>
          <p className="text-gray-600">
            {step === 'phone' 
              ? 'Choose how to receive your code' 
              : `Code sent via ${selectedChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'}`}
          </p>
        </div>

        {step === 'phone' ? (
          <PhoneInput 
            onSubmit={handleSendOTP}
            loading={loading}
          />
        ) : (
          <OTPForm
            onSubmit={handleVerifyOTP}
            loading={loading}
            phoneNumber={phoneNumber}
            countryCode={countryCode}
            channel={selectedChannel}
          />
        )}

        {step === 'otp' && (
          <button
            onClick={() => setStep('phone')}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 w-full text-center"
          >
            ← Change phone number
          </button>
        )}
      </div>
    </main>
  );
}