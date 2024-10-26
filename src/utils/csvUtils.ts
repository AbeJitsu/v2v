import { parse } from 'csv-parse';
import fs from 'fs';

interface CSVRow {
  'Variant Price': string;
  'Body (HTML)': string;
  [key: string]: string; // Allow for other properties
}

// Function to parse a CSV file
const parseCSV = (filePath: string): Promise<CSVRow[]> => {
  return new Promise((resolve, reject) => {
    const results: CSVRow[] = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true })) // Use csv-parse
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// Function to determine the product type based on price and description
const determineProductType = (
  row: CSVRow
): 'zi' | 'fashion-fix' | 'everyday-glam' => {
  const price = parseFloat(row['Variant Price']);
  const description = row['Body (HTML)'].toLowerCase();

  if (price === 25) {
    return 'zi';
  } else if (price === 20 || description.includes('fashion fix')) {
    return 'fashion-fix';
  } else {
    return 'everyday-glam';
  }
};

export {
  parseCSV,
  determineProductType,
  CSVRow, // Export the interface if you need to use it elsewhere
};
