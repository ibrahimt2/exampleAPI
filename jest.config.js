module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node', // or 'jsdom' for browser-like testing
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageThreshold: {
      global: {
        branches: 0,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    // Optionally, specify which files to collect coverage from:
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "node-client/**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!node-client/index.ts",
        "!node-client/**/*.d.ts"
    ],    
    // Specify file patterns for tests.
    testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  };