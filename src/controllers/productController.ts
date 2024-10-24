import { Request, Response } from 'express';
import Product from '../models/productModel';
import { extractKeywordsFromDescription } from '../utils/keywordExtraction';
import { performDbOperation } from '../utils/responseUtils';

// Get all products with pagination
export const getProducts = (req: Request, res: Response): void => {
  const { page = 1, limit = 12 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  performDbOperation(
    res,
    () => Product.find({}).skip(offset).limit(Number(limit)),
    'Products fetched successfully'
  );
};

// Add a new product
export const addProduct = (req: Request, res: Response): void => {
  const keywords = extractKeywordsFromDescription(req.body.description);
  const newProduct = new Product({ ...req.body, ...keywords });

  performDbOperation(
    res,
    () => newProduct.save(),
    'Product added successfully'
  );
};

// Update an existing product
export const updateProduct = (req: Request, res: Response): void => {
  const keywords = extractKeywordsFromDescription(req.body.description);

  performDbOperation(
    res,
    () =>
      Product.findByIdAndUpdate(
        req.params.id,
        { ...req.body, ...keywords },
        { new: true }
      ),
    'Product updated successfully'
  );
};

// Delete a product
export const deleteProduct = (req: Request, res: Response): void => {
  performDbOperation(
    res,
    () => Product.findByIdAndDelete(req.params.id),
    'Product deleted successfully'
  );
};

// Fetch a single product by its ID
export const getProductById = (req: Request, res: Response): void => {
  performDbOperation(
    res,
    () => Product.findById(req.params.id),
    'Product fetched successfully'
  );
};
