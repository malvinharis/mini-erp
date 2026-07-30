import nextJest from 'next/jest.js';

// next/jest wires SWC transform, CSS/asset mocks, and env for App Router.
const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/*.test.@(ts|tsx)'],
};

export default createJestConfig(config);
