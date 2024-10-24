import {
  validateEmailAndPassword,
  validateSearchQuery,
  validateProductInput,
  validatePaginationParams,
} from '../../src/utils/validationUtils';

describe('ValidationUtils Unit Tests', () => {
  test('should validate email and password successfully', () => {
    const result = validateEmailAndPassword('test@example.com', 'password123');
    expect(result).toBeNull();

    const invalidEmail = validateEmailAndPassword(
      'invalid-email',
      'password123'
    );
    expect(invalidEmail).toBe('Invalid email format');

    const shortPassword = validateEmailAndPassword('test@example.com', 'short');
    expect(shortPassword).toBe('Password must be at least 8 characters long');
  });

  test('should validate search query successfully', () => {
    const validQuery = validateSearchQuery('search term');
    expect(validQuery).toBeNull();

    const emptyQuery = validateSearchQuery('');
    expect(emptyQuery).toBe('Search query cannot be empty');

    const shortQuery = validateSearchQuery('a');
    expect(shortQuery).toBe('Search query must be at least 2 characters long');
  });

  test('should validate product input successfully', () => {
    const validProduct = validateProductInput({
      name: 'Test Product',
      price: 100,
      category: 'Category1',
    });
    expect(validProduct).toBeNull();

    const invalidProduct = validateProductInput({
      name: '',
      price: -10,
      category: '',
    });
    expect(invalidProduct).toEqual({
      name: 'Product name is required',
      price: 'Valid product price is required',
      category: 'Product category is required',
    });
  });

  test('should validate pagination parameters successfully', () => {
    const validParams = validatePaginationParams(1, 10);
    expect(validParams).toBeNull();

    const invalidPage = validatePaginationParams(-1, 10);
    expect(invalidPage).toEqual({
      page: 'Page must be a positive integer',
    });

    const invalidLimit = validatePaginationParams(1, 200);
    expect(invalidLimit).toEqual({
      limit: 'Limit must be a positive integer between 1 and 100',
    });
  });
});
