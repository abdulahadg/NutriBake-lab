/**
 * NutriBake Smart Validation & Normalization Utility
 * Provides user-friendly, robust validation and automatic helpers
 * across the public catalog and Admin Panel.
 */

/**
 * Capitalizes a single word or hyphenated word segment.
 * e.g. "chocolate" -> "Chocolate"
 * e.g. "nutri-ball" -> "Nutri-Ball"
 * e.g. "RS2" -> "RS2"
 */
export const capitalizeWordSegment = (segment: string): string => {
  if (!segment) return '';
  // If the segment is already an acronym/all-caps like RS2, keep it
  if (segment.length > 1 && segment === segment.toUpperCase() && /^[A-Z0-9]+$/.test(segment)) {
    return segment;
  }
  // Normalization: capitalize first char, lowercase the rest if it was all lowercase or mixed up
  const first = segment.charAt(0).toUpperCase();
  const rest = segment.slice(1);
  return first + rest;
};

/**
 * Normalizes a product name so that the first letter of EVERY WORD is uppercase.
 * Handles spaces, hyphens, and common punctuation.
 * e.g. "chocolate almond cake" -> "Chocolate Almond Cake"
 * e.g. "whole wheat bread" -> "Whole Wheat Bread"
 * e.g. "vanilla-protein muffin" -> "Vanilla-Protein Muffin"
 */
export const formatToTitleCase = (text: string): string => {
  if (!text) return '';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (!trimmed) return '';

  return trimmed
    .split(' ')
    .map(word => {
      if (!word) return '';
      // Handle hyphenated words e.g. "gluten-free" -> "Gluten-Free"
      return word
        .split('-')
        .map(part => {
          if (!part) return '';
          // If part is wrapped in parentheses like "(RS2)", handle inner character
          if (part.startsWith('(') && part.length > 1) {
            return '(' + part.charAt(1).toUpperCase() + part.slice(2);
          }
          return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join('-');
    })
    .join(' ');
};

/**
 * Validates that every word in the product name begins with an uppercase letter.
 * Allows numbers, symbols like &, parentheses, and hyphens.
 */
export const validateEveryWordCapitalized = (text: string): { isValid: boolean; message?: string } => {
  const trimmed = text.trim();
  if (!trimmed) {
    return { isValid: false, message: 'Product name is required.' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, message: 'Product name must be at least 2 characters.' };
  }

  const words = trimmed.split(/\s+/);
  for (const word of words) {
    // Check hyphenated parts
    const parts = word.split('-');
    for (let part of parts) {
      // Strip leading punctuation like ( or [ or "
      part = part.replace(/^[^a-zA-Z0-9]+/, '');
      if (!part) continue;

      const firstChar = part.charAt(0);
      // If the first character is an alphabet, it MUST be uppercase
      if (/[a-z]/.test(firstChar)) {
        return {
          isValid: false,
          message: 'Each word in the product name must start with an uppercase letter.'
        };
      }
    }
  }

  return { isValid: true };
};

/**
 * Validates email format with clear message
 */
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, message: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, message: 'Please enter a valid email address.' };
  }
  return { isValid: true };
};

/**
 * Validates phone numbers (flexible for local and international formats)
 */
export const validatePhone = (phone: string, required = false): { isValid: boolean; message?: string } => {
  const trimmed = phone.trim();
  if (!trimmed) {
    if (required) {
      return { isValid: false, message: 'Phone number is required.' };
    }
    return { isValid: true };
  }
  // Must have at least 7 digits, allowed chars +, -, (, ), spaces
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return { isValid: false, message: 'Please enter a valid phone number (7–15 digits).' };
  }
  if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(trimmed)) {
    return { isValid: false, message: 'Invalid phone number characters.' };
  }
  return { isValid: true };
};

/**
 * Validates price field (PKR or currency)
 */
export const validatePrice = (val: any): { isValid: boolean; value: number; message?: string } => {
  if (val === '' || val === null || val === undefined) {
    return { isValid: false, value: 0, message: 'Price is required.' };
  }
  const num = Number(val);
  if (isNaN(num)) {
    return { isValid: false, value: 0, message: 'Please enter a valid price.' };
  }
  if (num < 0) {
    return { isValid: false, value: num, message: 'Price cannot be negative.' };
  }
  // Decimal precision check: max 2 decimal places
  const parts = val.toString().split('.');
  if (parts.length > 1 && parts[1].length > 2) {
    return { isValid: false, value: num, message: 'Price cannot have more than 2 decimal places.' };
  }
  return { isValid: true, value: num };
};

/**
 * Validates non-negative numerical fields (nutrition, servings, etc.)
 */
export const validateNumericField = (
  val: any,
  fieldName: string,
  min = 0,
  max = 100000
): { isValid: boolean; value: number; message?: string } => {
  if (val === '' || val === null || val === undefined) {
    return { isValid: false, value: 0, message: `${fieldName} is required.` };
  }
  const num = Number(val);
  if (isNaN(num)) {
    return { isValid: false, value: 0, message: `Please enter a valid number for ${fieldName.toLowerCase()}.` };
  }
  if (num < min) {
    return { isValid: false, value: num, message: `${fieldName} cannot be less than ${min}.` };
  }
  if (num > max) {
    return { isValid: false, value: num, message: `${fieldName} cannot exceed ${max}.` };
  }
  return { isValid: true, value: num };
};

/**
 * Validates required text fields (preventing whitespace-only submissions)
 */
export const validateRequiredText = (
  val: string,
  fieldName: string,
  minLen = 1,
  maxLen = 5000
): { isValid: boolean; value: string; message?: string } => {
  const trimmed = (val || '').trim();
  if (!trimmed) {
    return { isValid: false, value: '', message: `${fieldName} is required.` };
  }
  if (trimmed.length < minLen) {
    return { isValid: false, value: trimmed, message: `${fieldName} must be at least ${minLen} characters.` };
  }
  if (trimmed.length > maxLen) {
    return { isValid: false, value: trimmed, message: `${fieldName} cannot exceed ${maxLen} characters.` };
  }
  return { isValid: true, value: trimmed };
};

/**
 * Validates optional text fields (trims and checks max length)
 */
export const sanitizeOptionalText = (
  val: string | undefined | null,
  maxLen = 5000
): { isValid: boolean; value: string; message?: string } => {
  if (!val) return { isValid: true, value: '' };
  const trimmed = val.trim();
  if (trimmed.length > maxLen) {
    return { isValid: false, value: trimmed, message: `Text cannot exceed ${maxLen} characters.` };
  }
  return { isValid: true, value: trimmed };
};

/**
 * Validates image references (URLs, relative paths, or data URLs)
 */
export const validateImageSource = (val: string): { isValid: boolean; value: string; message?: string } => {
  const trimmed = (val || '').trim();
  if (!trimmed) {
    return { isValid: false, value: '', message: 'Product image is required.' };
  }
  // Check if starts with valid scheme or path
  const isValidScheme = 
    trimmed.startsWith('http://') || 
    trimmed.startsWith('https://') || 
    trimmed.startsWith('/') || 
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:');

  if (!isValidScheme) {
    return { isValid: false, value: trimmed, message: 'Please provide a valid image URL or asset path.' };
  }
  return { isValid: true, value: trimmed };
};
