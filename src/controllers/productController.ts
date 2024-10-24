import { Request, Response } from 'express';
import Product from '../models/productModel';
import { extractKeywordsFromDescription } from '../utils/keywordExtraction';
import { handleCSVUpload } from '../utils/csvUpload';
import {
  performDbOperation,
  handleError,
  handleSuccess,
} from '../utils/responseUtils';

// Get all products with pagination
export const getProducts = (req: Request, res: Response): void => {
  const { page = 1, limit = 12 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  performDbOperation(
    res,
    async () => await Product.find({}).skip(offset).limit(Number(limit)),
    'Products fetched successfully'
  );
};

// Add a new product
export const addProduct = (req: Request, res: Response): void => {
  const keywords = extractKeywordsFromDescription(req.body.description);
  const newProduct = new Product({ ...req.body, ...keywords });

  performDbOperation(
    res,
    async () => await newProduct.save(),
    'Product added successfully'
  );
};

// Update an existing product
export const updateProduct = (req: Request, res: Response): void => {
  const keywords = extractKeywordsFromDescription(req.body.description);

  performDbOperation(
    res,
    async () =>
      await Product.findByIdAndUpdate(
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
    async () => await Product.findByIdAndDelete(req.params.id),
    'Product deleted successfully'
  );
};

// Fetch a single product by its ID
export const getProductById = (req: Request, res: Response): void => {
  performDbOperation(
    res,
    async () => await Product.findById(req.params.id),
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
    await handleCSVUpload(regularCSV, premiereCSV);
    handleSuccess(res, 'CSV files processed successfully');
  } catch (error) {
    handleError(res, error as Error, 'Error processing CSV files');
  }
};


MacBook-Pro:v2v abiezerreyes$ npm run tree

> v2v@1.0.0 tree
> tree -L 3 -I 'node_modules|.git|package-lock.json|dist|.DS_Store' --noreport -a

.
├── .env
├── .gitignore
├── jest.config.js
├── package.json
├── src
│   ├── constants
│   │   ├── AppConstants.ts
│   │   └── PathConstants.ts
│   ├── controllers
│   │   ├── authController.ts
│   │   └── userController.ts
│   ├── db.ts
│   ├── middleware
│   │   ├── authMiddleware.ts
│   │   └── logger.ts
│   ├── models
│   │   └── userModel.ts
│   ├── server.ts
│   ├── services
│   │   ├── authService.ts
│   │   ├── configService.ts
│   │   └── userService.ts
│   └── utils
│       ├── dbUtils.ts
│       ├── envUtils.ts
│       ├── responseUtils.ts
│       └── validationUtils.ts
├── tests
│   ├── e2e
│   ├── integration
│   └── unit
│       ├── authController.test.ts
│       ├── authMiddleware.test.ts
│       ├── authService.test.ts
│       ├── configService.test.ts
│       ├── envUtils.test.ts
│       ├── responseUtils.test.ts
│       ├── server.test.ts
│       ├── userController.test.ts
│       ├── userService.test.ts
│       └── validationUtils.test.ts
└── tsconfig.json
MacBook-Pro:v2v abiezerreyes$ 







Explain problem: Cannot find module '../models/productModel' or its corresponding type declarations. @productController.ts:2:21

Codeium
2:44 pm, Oct 24, 2024
The error "Cannot find module '../models/productModel' or its corresponding type declarations" typically occurs when the TypeScript compiler cannot find the module or type declarations for the specified file.

In your case, the error is occurring because the TypeScript compiler cannot find the module '../models/productModel'.

To resolve this issue, you can try the following steps:

Make sure that the file 'productModel.ts' exists in the '../models' directory relative to the current file.
Check if there are any typos or case sensitivity issues in the file path. The file path should be exactly '../models/productModel.ts' (including the file extension).
Verify that the file 'productModel.ts' has the correct export statement. It should have a default export or a named export for the 'Product' class.
If the file 'productModel.ts' is located in a different directory or has a different name, update the import statement accordingly.
If you are using a module bundler like Webpack or Rollup, make sure that the file is being included in the bundle.
If you are using a module system like CommonJS or ES modules, ensure that the module is properly configured and accessible.
By following these steps, you should be able to resolve the "Cannot find module '../models/productModel' or its corresponding type declarations" error.










Explain problem: Cannot find module '../utils/keywordExtraction' or its corresponding type declarations. @productController.ts:3:48

Codeium
2:45 pm, Oct 24, 2024
The issue "Cannot find module '../utils/keywordExtraction' or its corresponding type declarations" in TypeScript typically occurs when the compiler is unable to locate the specified module or its type definitions.

In this case, the error message is complaining about the line:

typescript
CopyInsert
import { extractKeywordsFromDescription } from '../utils/keywordExtraction';
The compiler is looking for a file named keywordExtraction.ts (or keywordExtraction.js if you're using JavaScript) in the ../utils directory relative to the current file. However, it seems that this file does not exist or is not properly configured.

To resolve this issue, you need to ensure that the keywordExtraction.ts file exists in the correct location and that it exports the extractKeywordsFromDescription function.

Here are a few possible solutions:

Create the missing file: If the keywordExtraction.ts file does not exist, create it in the ../utils directory and define the extractKeywordsFromDescription function inside it.
typescript
CopyInsert
// ../utils/keywordExtraction.ts
export function extractKeywordsFromDescription(description: string) {
  // implementation goes here
}
Check the file path: Verify that the file path ../utils/keywordExtraction is correct. Make sure that the file is located in the correct directory relative to the current file.
Check for typos: Double-check that the file name and the function name are spelled correctly.
Check for missing type declarations: If you're using a third-party library, ensure that you have installed the corresponding type declarations using npm or yarn.
If none of these solutions work, please provide more information about your project structure and the keywordExtraction file, and I'll be happy to help you further.







28 Sources
productController.ts
CURRENT
Advanced
