module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node', // or 'jsdom' for browser-like testing
    coverageProvider: "v8", // 👈 Use V8 instead of babel for better ts support
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
      "node_client/**/*.{ts,tsx}",
      "!node_client/**/*.d.ts",
      "!node_client/index.ts",
      "!node_client/types.gen.ts",
    ],
    // Specify file patterns for tests.
    testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  };