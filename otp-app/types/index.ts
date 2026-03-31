// User types
export interface User {
  phoneNumber: string;
  isVerified: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

// OTP types
export interface OTP {
  phoneNumber: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Request types
export interface SendOTPRequest {
  phoneNumber: string;
  countryCode: string;
  channel: 'whatsapp' | 'sms';
}

export interface VerifyOTPRequest {
  phoneNumber: string;
  countryCode: string;
  otp: string;
}

export interface SendWhatsAppRequest {
  phoneNumber: string;
  countryCode: string;
  otp: string;
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface SendOTPResponse extends APIResponse {
  messageId?: string;
}

export interface VerifyOTPResponse extends APIResponse {
  user?: {
    phoneNumber: string;
    verified: boolean;
    createdAt?: Date;
  };
}

// Component Props types
export interface PhoneInputProps {
  onSubmit: (phoneNumber: string, countryCode: string, channel: string) => void;
  loading: boolean;
}

export interface OTPFormProps {
  onSubmit: (otp: string) => void;
  loading: boolean;
  phoneNumber: string;
  countryCode: string;
  channel: string;
}
// Country code type
export interface CountryCode {
  code: string;
  country: string;
}