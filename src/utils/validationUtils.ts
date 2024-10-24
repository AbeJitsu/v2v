import validator from 'validator';

// Helper function to check if a string is empty or only whitespace
const isEmptyString = (str: string) => !str || validator.isEmpty(str.trim());

// General validation helper to format validation results
const generateValidationResult = (valid: boolean, error?: string) => ({
  valid,
  error,
});

// Validate email and password inputs with validator and custom logic
export const validateEmailAndPassword = (
  email: string,
  password: string
): { valid: boolean; error?: string } => {
  if (!validator.isEmail(email)) {
    return generateValidationResult(false, 'Invalid email format');
  }

  if (password.length < 8) {
    return generateValidationResult(
      false,
      'Password must be at least 8 characters long'
    );
  }

  return generateValidationResult(true);
};

// Validate search query for proper length and non-emptiness
export const validateSearchQuery = (
  query: string
): { valid: boolean; error?: string } => {
  if (isEmptyString(query)) {
    return generateValidationResult(false, 'Search query cannot be empty');
  }

  if (query.length < 2) {
    return generateValidationResult(
      false,
      'Search query must be at least 2 characters long'
    );
  }

  return generateValidationResult(true);
};

// Validate product input with multiple fields
export const validateProductInput = (product: {
  name: string;
  price: number;
  category: string;
}): { valid: boolean; errors?: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (isEmptyString(product.name)) {
    errors.name = 'Product name is required';
  }

  if (!validator.isFloat(product.price.toString(), { min: 0 })) {
    errors.price = 'Valid product price is required';
  }

  if (isEmptyString(product.category)) {
    errors.category = 'Product category is required';
  }

  return Object.keys(errors).length > 0
    ? { valid: false, errors }
    : { valid: true };
};

// Validate pagination parameters (page and limit)
export const validatePaginationParams = (
  page: number,
  limit: number
): { valid: boolean; errors?: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!validator.isInt(page.toString(), { min: 1 })) {
    errors.page = 'Page must be a positive integer';
  }

  if (!validator.isInt(limit.toString(), { min: 1, max: 100 })) {
    errors.limit = 'Limit must be a positive integer between 1 and 100';
  }

  return Object.keys(errors).length > 0
    ? { valid: false, errors }
    : { valid: true };
};

// General input validator for auth (email and password)
export const validateInput = (input: { email?: string; password?: string }) => {
  if (!input.email || !input.password) {
    return generateValidationResult(false, 'Email and password are required');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(input.email)) {
    return generateValidationResult(false, 'Invalid email format');
  }

  if (input.password.length < 6) {
    return generateValidationResult(
      false,
      'Password must be at least 6 characters'
    );
  }

  return generateValidationResult(true);
};
