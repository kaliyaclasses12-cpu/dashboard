'use client';
import { useState } from 'react';
import { PhoneInputProps } from '@/types'; // 👈 Import types

export default function PhoneInput({ onSubmit, loading }: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState<string>('+91'); // 👈 Add type
  const [phoneNumber, setPhoneNumber] = useState<string>(''); // 👈 Add type
  const [channel, setChannel] = useState<string>('whatsapp'); // 👈 Add type

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { // 👈 Add type
    e.preventDefault();
    if (phoneNumber) {
      onSubmit(phoneNumber, countryCode, channel);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Country Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country Code
        </label>
        <select
          value={countryCode}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCountryCode(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          disabled={loading}
        >
          <option value="+91">🇮🇳 India (+91)</option>
          <option value="+1">🇺🇸 USA (+1)</option>
          <option value="+44">🇬🇧 UK (+44)</option>
          <option value="+61">🇦🇺 Australia (+61)</option>
        </select>
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          placeholder="9876543210"
          value={phoneNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          disabled={loading}
          required
        />
      </div>

      {/* Radio Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Receive Code Via
        </label>
        <div className="flex gap-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="whatsapp"
              checked={channel === 'whatsapp'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChannel(e.target.value)}
              className="mr-2 w-4 h-4"
              disabled={loading}
            />
            <span className="flex items-center gap-1">
              <span>💚</span> WhatsApp
            </span>
          </label>
          
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="sms"
              checked={channel === 'sms'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChannel(e.target.value)}
              className="mr-2 w-4 h-4"
              disabled={loading}
            />
            <span className="flex items-center gap-1">
              <span>📱</span> SMS
            </span>
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {channel === 'whatsapp' 
            ? '✓ Free WhatsApp message with code' 
            : '✓ SMS text message with code'}
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? 'Sending...' : `Send Code via ${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}`}
      </button>
    </form>
  );
}