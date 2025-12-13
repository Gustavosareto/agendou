export const cleanDigits = (val: string) => {
  if (!val) return '';
  return val.replace(/\D/g, '');
};

/**
 * Normalizes a phone number for API/WhatsApp use.
 * Removes non-digits.
 * Adds '55' (Brazil) country code if missing from a valid length number.
 */
export const normalizeForWhatsApp = (phone: string): string => {
  const clean = cleanDigits(phone);
  if (!clean) return '';
  
  // If starts with 55 and looks like a full number (12-13 chars), return it as is.
  if (clean.startsWith('55') && clean.length >= 12) return clean;
  
  // If it looks like a local number with DDD (10-11 chars), add 55.
  // 10 = (11) 1234-5678 (Landline)
  // 11 = (11) 91234-5678 (Mobile)
  if (clean.length >= 10 && clean.length <= 11) return `55${clean}`;
  
  // Return clean (fallback for other formats or incomplete)
  return clean;
};

/**
 * Formats a phone number for display in input fields (Masking).
 * Handles stripping the country code visually if it exists for cleaner UI.
 * Format: (11) 99999-9999
 */
export const formatPhoneInput = (val: string): string => {
  let clean = cleanDigits(val);

  // Heuristic: If it's stored with 55, strip it for the input display so user edits the local part
  if (clean.startsWith('55') && clean.length >= 12) {
     clean = clean.substring(2);
  }
  
  // Limit to 11 chars (DDD + 9 digits) for standard BR mobile
  clean = clean.substring(0, 11);

  if (clean.length > 10) { // (11) 91234-5678
    return clean.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  } else if (clean.length > 6) {
    return clean.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
  } else if (clean.length > 2) {
    return clean.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
  } else {
    return clean.length > 0 ? `(${clean}` : '';
  }
};

export const isValidPhone = (phone: string): boolean => {
  const norm = normalizeForWhatsApp(phone);
  // Expecting at least 55 + 10 digits (12 total)
  return norm.length >= 12;
}