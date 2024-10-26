// tests/unit/utils/csvUtils.test.ts
import { parseCSV, determineProductType } from '../../../src/utils/csvUtils';
import { Readable } from 'stream';
import { parse } from 'csv-parse';

describe('CSV Utilities', () => {
  test('should determine product type correctly', () => {
    const row1 = { 'Variant Price': '25', 'Body (HTML)': 'Sample' };
    const row2 = { 'Variant Price': '20', 'Body (HTML)': 'Fashion Fix Item' };
    const row3 = { 'Variant Price': '15', 'Body (HTML)': 'Regular Item' };

    expect(determineProductType(row1)).toBe('zi');
    expect(determineProductType(row2)).toBe('fashion-fix');
    expect(determineProductType(row3)).toBe('everyday-glam');
  });

  test('should parse CSV file correctly', async () => {
    // Create a mock CSV data
    const mockCSVData = `Variant Price,Body (HTML)\n25,Sample Item\n20,Fashion Fix Item\n15,Regular Item`;

    // Create a readable stream from the mock CSV data
    const stream = Readable.from([mockCSVData]);

    // Use a Promise to handle the parsing
    const results: any[] = await new Promise((resolve, reject) => {
      const parsedResults: any[] = [];
      stream
        .pipe(parse({ columns: true })) // Ensure correct parsing options
        .on('data', (row: any) => parsedResults.push(row)) // Explicitly define type for row
        .on('end', () => resolve(parsedResults))
        .on('error', (error: Error) => reject(error)); // Explicitly define type for error
    });

    expect(results).toHaveLength(3);
    expect(results[0]['Body (HTML)']).toBe('Sample Item');
  });
});
