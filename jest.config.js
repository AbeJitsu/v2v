/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest', // Use ts-jest for TypeScript support
  testEnvironment: 'node', // Node environment for backend/server-side tests
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'], // Allow testing both TypeScript and JavaScript files
  testMatch: ['**/tests/**/*.test.(ts|js)'], // Matches test files in tests directory with .ts or .js extensions
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}], // Transforms both .ts and .tsx files using ts-jest
  },
  globals: {
    'ts-jest': {
      isolatedModules: true, // Speeds up compilation by avoiding type-checking
    },
  },
};
