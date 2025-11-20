/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  preset: 'ts-jest',
  transform: {
    "^.+\\.(ts|tsx)$": ['ts-jest', {
      tsconfig: {
        jsx: 'react',
      },
    }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
