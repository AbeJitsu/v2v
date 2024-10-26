import express from 'express';
import { asyncHandler } from '../middleware/errorHandling';
import * as searchController from '../controllers/searchController';

const router = express.Router();

// Common Swagger parameters and responses
const swaggerParameters = [
  {
    in: 'query',
    name: 'q',
    schema: { type: 'string' },
    required: true,
    description: 'Search query',
  },
];

const swaggerResponses = {
  200: {
    description: 'Items found',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { $ref: '#/components/schemas/Product' }, // or Category based on route
        },
      },
    },
  },
  400: { description: 'Invalid query' },
  500: { description: 'Internal server error' },
};

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Search operations
 */

// Route definitions
const routes = [
  {
    path: '/products',
    handler: searchController.searchProducts,
    swaggerTag: 'Products',
    schemaRef: '#/components/schemas/Product',
  },
  {
    path: '/categories',
    handler: searchController.searchCategories,
    swaggerTag: 'Categories',
    schemaRef: '#/components/schemas/Category',
  },
];

// Register routes with swagger documentation
routes.forEach(({ path, handler, swaggerTag, schemaRef }) => {
  /**
   * @swagger
   * /api/search${path}:
   *   get:
   *     summary: Search for ${swaggerTag.toLowerCase()}
   *     tags: [Search]
   *     parameters: ${JSON.stringify(swaggerParameters)}
   *     responses: ${JSON.stringify({
   *       ...swaggerResponses,
   *       200: {
   *         ...swaggerResponses[200],
   *         content: {
   *           'application/json': {
   *             schema: {
   *               type: 'array',
   *               items: { $ref: schemaRef },
   *             },
   *           },
   *         },
   *       },
   *     })}
   */
  router.get(path, asyncHandler(handler));
});

export default router;
