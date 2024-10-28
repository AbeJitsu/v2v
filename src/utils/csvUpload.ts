import fs from 'fs';
import Product from '../models/productModel';

// Use `require` for the csv-parser since it doesn't have types.
const csvParser = require('csv-parser') as any;

interface CSVItem {
  title: string;
  handle: string;
  bodyHtml: string;
  vendor: string;
  variantSKU: string;
  variantPrice: string;
  imageSrc: string;
  imagePosition: string;
  quantity: string;
  status: string;
  colors?: string;
  materials?: string;
  looks?: string;
  styles?: string;
}

interface CSVFile {
  path: string;
}

/**
 * Handles the CSV upload process for regular and premiere products.
 * @param regularCSV - CSV file containing regular products.
 * @param premiereCSV - CSV file containing premiere products.
 */
export const handleCSVUpload = async (
  regularCSV: CSVFile,
  premiereCSV: CSVFile
): Promise<void> => {
  await processCSV(regularCSV, 'regular');
  await processCSV(premiereCSV, 'premiere');
};

/**
 * Processes the CSV file by parsing it and saving the data to the database.
 * @param file - CSV file to be processed.
 * @param type - The product type (e.g., 'regular', 'premiere').
 */
const processCSV = (file: CSVFile, type: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const results: CSVItem[] = [];

    fs.createReadStream(file.path)
      .pipe(csvParser())
      .on('data', (data: CSVItem) => results.push(data))
      .on('end', async () => {
        try {
          for (const item of results) {
            await saveProduct(item, type);
          }
          resolve();
        } catch (error) {
          console.error(`Error saving products from ${type} CSV:`, error);
          reject(error);
        }
      })
      .on('error', (error: Error) => {
        console.error(`Error reading ${type} CSV file:`, error);
        reject(error);
      });
  });
};

/**
 * Saves a product to the database after parsing it from the CSV file.
 * @param item - The product item parsed from the CSV file.
 * @param type - The type of the product (e.g., 'regular', 'premiere').
 */
const saveProduct = async (item: CSVItem, type: string): Promise<void> => {
  const product = new Product({
    title: item.title,
    handle: item.handle,
    bodyHtml: item.bodyHtml,
    vendor: item.vendor,
    type,
    variantSKU: item.variantSKU,
    variantPrice: parseFloat(item.variantPrice),
    imageSrc: item.imageSrc.split('|'),
    imagePosition: item.imagePosition.split('|').map(Number),
    quantity: parseInt(item.quantity),
    status: item.status,
    colors: item.colors ? item.colors.split('|') : [],
    materials: item.materials ? item.materials.split('|') : [],
    looks: item.looks ? item.looks.split('|') : [],
    styles: item.styles ? item.styles.split('|') : [],
  });

  await product.save();
};
