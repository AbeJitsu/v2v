// src/utils/validationUtils.ts

import validator from 'validator';

interface AuthRequestBody {
  email: string;
  password: string;
  preferredFirstName?: string;
}

export const validateInput = (
  input: Partial<AuthRequestBody>
): { valid: boolean; error?: string } => {
  if (!input.email || !validator.isEmail(input.email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  if (!input.password || input.password.length < 8) {
    return {
      valid: false,
      error: 'Password must be at least 8 characters long',
    };
  }
  return { valid: true };
};
