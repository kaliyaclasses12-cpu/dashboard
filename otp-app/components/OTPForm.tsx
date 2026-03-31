'use client';
import { useState, useEffect } from 'react';
import { OTPFormProps } from '@/types'; // 👈 Import types

export default function OTPForm({ onSubmit, loading, phoneNumber, countryCode, channel }: OTPFormProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']); // 👈 Add type
  const [timer, setTimer] = useState<number>(60); // 👈 Add type
  const [canResend, setCanResend] = useState<boolean>(false); // 👈 Add type

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t: number) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => { // 👈 Add types
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => { // 👈 Add types
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { // 👈 Add type
    e.preventDefault();
    const code = otp.join('');
    if (code.length === 6) onSubmit(code);
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600">
          Enter 6-digit code sent via{' '}
          <span className="font-semibold">
            {channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}
          </span>{' '}
          to <br />
          <strong>{countryCode} {phoneNumber}</strong>
        </p>
        
        {/* Channel-specific tip */}
        {channel === 'whatsapp' ? (
          <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">
            💚 Check your WhatsApp messages
          </div>
        ) : (
          <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
            📱 Check your SMS inbox
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2">
          {otp.map((digit: string, index: number) => ( // 👈 Add types
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || otp.join('').length !== 6}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>

      <div className="text-center">
        {!canResend ? (
          <p className="text-sm text-gray-500">Resend in {timer} seconds</p>
        ) : (
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Resend Code via {channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}
          </button>
        )}
      </div>
    </div>
  );
}