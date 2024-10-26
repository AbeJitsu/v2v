// src/controllers/searchController.ts
import { Request, Response } from 'express';
import * as searchService from '../services/searchService';
import { validateSearchQuery } from '../utils/validationUtils';

const handleSearch = async (
  res: Response,
  searchFunction: (...args: any[]) => Promise<any>,
  options: any,
  errorMessage: string
) => {
  try {
    const searchResults = await searchFunction(...options);
    res.status(200).json({
      results: searchResults.products || searchResults,
      totalResults: searchResults.total,
      currentPage: searchResults.page,
      totalPages: searchResults.totalPages,
    });
  } catch (error) {
    console.error(errorMessage, error);
    res.status(500).json({ error: `An error occurred: ${errorMessage}` });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  const { query, page = 1, limit = 10, category, sortBy, order } = req.query;
  const validationError = validateSearchQuery(query);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  await handleSearch(
    res,
    searchService.searchProductsByName,
    [query, { page: +page, limit: +limit, category, sortBy, order }],
    'Error in searchProducts'
  );
};

export const searchCategories = async (req: Request, res: Response) => {
  const { query } = req.query;
  const validationError = validateSearchQuery(query);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  await handleSearch(
    res,
    searchService.searchCategories,
    [query],
    'Error in searchCategories'
  );
};

export const searchProductsByCategory = async (req: Request, res: Response) => {
  const { category, page = 1, limit = 10, sortBy, order } = req.query;
  await handleSearch(
    res,
    searchService.searchProductsByCategory,
    [category, { page: +page, limit: +limit, sortBy, order }],
    'Error in searchProductsByCategory'
  );
};
