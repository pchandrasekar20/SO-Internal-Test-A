export const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Stocks API',
    version: '1.0.0',
    description: 'API for retrieving stocks with low PE ratios and largest declines',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  paths: {
    '/api/stocks/low-pe': {
      get: {
        tags: ['Stocks'],
        summary: 'Get stocks with lowest PE ratios',
        description: 'Returns top 25 stocks sorted by lowest PE ratio with pagination and filtering',
        parameters: [
          {
            name: 'page',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 1, minimum: 1 },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 25, minimum: 1, maximum: 100 },
            description: 'Number of results per page',
          },
          {
            name: 'sortBy',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: ['peRatio', 'symbol', 'name'],
              default: 'peRatio',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'asc',
            },
            description: 'Sort order',
          },
          {
            name: 'sector',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Filter by sector',
          },
          {
            name: 'industry',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Filter by industry',
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          symbol: { type: 'string' },
                          name: { type: 'string' },
                          sector: { type: 'string', nullable: true },
                          industry: { type: 'string', nullable: true },
                          peRatio: { type: 'number' },
                        },
                      },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                        totalPages: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad request - validation error',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
    '/api/stocks/largest-declines': {
      get: {
        tags: ['Stocks'],
        summary: 'Get stocks with largest price declines',
        description: 'Returns top 25 stocks with largest price declines with pagination and filtering',
        parameters: [
          {
            name: 'page',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 1, minimum: 1 },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 25, minimum: 1, maximum: 100 },
            description: 'Number of results per page',
          },
          {
            name: 'sortBy',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: ['priceChange', 'symbol', 'name'],
              default: 'priceChange',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'asc',
            },
            description: 'Sort order',
          },
          {
            name: 'sector',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Filter by sector',
          },
          {
            name: 'industry',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Filter by industry',
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          symbol: { type: 'string' },
                          name: { type: 'string' },
                          sector: { type: 'string', nullable: true },
                          industry: { type: 'string', nullable: true },
                          priceChange: { type: 'number' },
                        },
                      },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                        totalPages: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad request - validation error',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
  },
};
