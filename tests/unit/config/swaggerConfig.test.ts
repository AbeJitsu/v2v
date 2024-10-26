import express, { Express } from 'express';
import request from 'supertest';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

describe('SwaggerConfig', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    // Setup Swagger without external dependencies
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Jewelry Website API',
          version: '1.0.0',
          description: 'API documentation for the Jewelry Website',
        },
        servers: [{ url: '/api' }],
      },
      apis: ['./src/api/routes/*.ts'],
    };

    const swaggerSpec = swaggerJsdoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  });

  it('should setup Swagger UI at /api-docs', async () => {
    const response = await request(app).get('/api-docs').redirects(1);
    expect(response.status).toBe(200);
    expect(response.text).toContain('Swagger UI');
  });
});
