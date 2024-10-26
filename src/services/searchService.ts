// src/services/searchService.ts
import Product, { IProduct } from '../models/productModel';
import { logger } from '../middleware/logger';
import { FilterQuery } from 'mongoose';

type SearchOptions = {
  query?: string;
  category?: string;
  keywords?: string[];
};

const logAndSearch = async (
  filter: FilterQuery<IProduct>,
  logMessage: string,
  errorMessage: string
): Promise<IProduct[]> => {
  try {
    logger.debug(logMessage);
    return await Product.find(filter);
  } catch (error) {
    logger.error(errorMessage, error);
    throw new Error(errorMessage);
  }
};

export const searchProductsByName = (query: string): Promise<IProduct[]> =>
  logAndSearch(
    { name: new RegExp(query, 'i') } as FilterQuery<IProduct>,
    `Searching products with query: ${query}`,
    'Error searching products by name'
  );

export const searchProductsByCategory = (
  category: string
): Promise<IProduct[]> =>
  logAndSearch(
    { category } as FilterQuery<IProduct>,
    `Searching products in category: ${category}`,
    'Error searching products by category'
  );

export const searchProductsByKeywords = (
  keywords: string[]
): Promise<IProduct[]> =>
  logAndSearch(
    { $text: { $search: keywords.join(' ') } } as FilterQuery<IProduct>,
    `Searching products with keywords: ${keywords}`,
    'Error searching products by keywords'
  );
