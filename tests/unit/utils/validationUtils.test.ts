import {
  validateEmailAndPassword,
  validateSearchQuery,
  validateProductInput,
  validatePaginationParams,
} from '../../../src/utils/validationUtils';

describe('ValidationUtils Unit Tests', () => {
  test('should validate email and password successfully', () => {
    const result = validateEmailAndPassword('test@example.com', 'password123');
    expect(result).toEqual({ valid: true });

    const invalidEmail = validateEmailAndPassword(
      'invalid-email',
      'password123'
    );
    expect(invalidEmail).toEqual({
      valid: false,
      error: 'Invalid email format',
    });

    const shortPassword = validateEmailAndPassword('test@example.com', 'short');
    expect(shortPassword).toEqual({
      valid: false,
      error: 'Password must be at least 8 characters long',
    });
  });

  test('should validate search query successfully', () => {
    const validQuery = validateSearchQuery('search term');
    expect(validQuery).toEqual({ valid: true });

    const emptyQuery = validateSearchQuery('');
    expect(emptyQuery).toEqual({
      valid: false,
      error: 'Search query cannot be empty',
    });

    const shortQuery = validateSearchQuery('a');
    expect(shortQuery).toEqual({
      valid: false,
      error: 'Search query must be at least 2 characters long',
    });
  });

  test('should validate product input successfully', () => {
    const validProduct = validateProductInput({
      name: 'Test Product',
      price: 100,
      category: 'Category1',
    });
    expect(validProduct).toEqual({ valid: true });

    const invalidProduct = validateProductInput({
      name: '',
      price: -10,
      category: '',
    });
    expect(invalidProduct).toEqual({
      valid: false,
      errors: {
        name: 'Product name is required',
        price: 'Valid product price is required',
        category: 'Product category is required',
      },
    });
  });

  test('should validate pagination parameters successfully', () => {
    const validParams = validatePaginationParams(1, 10);
    expect(validParams).toEqual({ valid: true });

    const invalidPage = validatePaginationParams(-1, 10);
    expect(invalidPage).toEqual({
      valid: false,
      errors: { page: 'Page must be a positive integer' },
    });

    const invalidLimit = validatePaginationParams(1, 200);
    expect(invalidLimit).toEqual({
      valid: false,
      errors: { limit: 'Limit must be a positive integer between 1 and 100' },
    });
  });
});
