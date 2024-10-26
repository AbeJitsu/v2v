import express, { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jewelry Website API',
      version: '1.0.0',
      description: 'API documentation for the Jewelry Website',
    },
    servers: [
      {
        url: '/api', // Adjust if necessary
      },
    ],
  },
  apis: ['./src/api/routes/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwaggerDocs = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwaggerDocs;
