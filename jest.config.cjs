/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            useESM: true,
        }],
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
}; 