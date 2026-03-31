/**
 * Normalize phone number to a consistent format
 * Input: +919910815304 or 919910815304
 * Output: 919910815304 (without +)
 */
export function normalizePhoneNumber(countryCode: string, phoneNumber: string): string {
  const cleanCountryCode = countryCode.replace('+', '');
  return `${cleanCountryCode}${phoneNumber}`;
}

/**
 * Normalize a full phone number (with or without +)
 */
export function normalizeFullPhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace('+', '');
}