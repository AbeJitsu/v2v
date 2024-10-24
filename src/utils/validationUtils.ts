import validator from 'validator';

export const validateEmailAndPassword = (
  email: string,
  password: string
): string | null => {
  if (!validator.isEmail(email)) {
    return 'Invalid email format';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  return null;
};

export const validateSearchQuery = (query: string): string | null => {
  if (!query || validator.isEmpty(query.trim())) {
    return 'Search query cannot be empty';
  }
  if (query.length < 2) {
    return 'Search query must be at least 2 characters long';
  }
  return null;
};

export const validateProductInput = (product: {
  name: string;
  price: number;
  category: string;
}): Record<string, string> | null => {
  const errors: Record<string, string> = {};

  if (!product.name || validator.isEmpty(product.name.trim())) {
    errors.name = 'Product name is required';
  }

  if (
    !product.price ||
    !validator.isFloat(product.price.toString(), { min: 0 })
  ) {
    errors.price = 'Valid product price is required';
  }

  if (!product.category || validator.isEmpty(product.category.trim())) {
    errors.category = 'Product category is required';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const validatePaginationParams = (
  page: number,
  limit: number
): Record<string, string> | null => {
  const errors: Record<string, string> = {};

  if (!validator.isInt(page.toString(), { min: 1 })) {
    errors.page = 'Page must be a positive integer';
  }

  if (!validator.isInt(limit.toString(), { min: 1, max: 100 })) {
    errors.limit = 'Limit must be a positive integer between 1 and 100';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};
