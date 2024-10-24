import { Request, Response } from 'express';
// Rename the Product import to avoid conflicts
import ProductModel from '../models/productModel';
import { extractKeywordsFromDescription } from '../utils/keywordExtraction';
import {
  performDbOperation,
  handleSuccess,
  handleError,
} from '../utils/responseUtils';
import { handleCSVUpload } from '../utils/csvUpload';

// Get all products with pagination
export const getProducts = (req: Request, res: Response): void => {
  const { page = 1, limit = 12 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  performDbOperation(
    res,
    () => ProductModel.find({}).skip(offset).limit(Number(limit)),
    'Products fetched successfully'
  );
};

// Add a new product
export const addProduct = (req: Request, res: Response): void => {
  const keywords = extractKeywordsFromDescription(req.body.description);
  const newProduct = new ProductModel({ ...req.body, ...keywords });

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
      ProductModel.findByIdAndUpdate(
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
    () => ProductModel.findByIdAndDelete(req.params.id),
    'Product deleted successfully'
  );
};

// Fetch a single product by its ID
export const getProductById = (req: Request, res: Response): void => {
  performDbOperation(
    res,
    () => ProductModel.findById(req.params.id),
    'Product fetched successfully'
  );
};

// Upload CSV and process it
export const uploadCSV = async (req: Request, res: Response): Promise<void> => {
  const multerReq = req as any; // Simplified to match basic types in multer
  if (
    !multerReq.files ||
    !multerReq.files.regular ||
    !multerReq.files.premiere
  ) {
    res.status(400).send({ message: 'Both CSV files are required.' });
    return;
  }

  const regularCSV = multerReq.files.regular[0];
  const premiereCSV = multerReq.files.premiere[0];

  try {
    await handleCSVUpload(regularCSV, premiereCSV); // Assuming you have a method to handle the CSV upload logic
    handleSuccess(res, 'CSV files processed successfully');
  } catch (error) {
    handleError(res, error as Error, 'Error processing CSV files');
  }
};
