/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: [
    '**/?(*.)+(spec|test).[tj]s?(x)', // Matches any .test.ts or .spec.ts files
  ],
};
