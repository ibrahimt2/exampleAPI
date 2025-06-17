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
      "node-client/**/*.{ts,tsx}",
      "!node-client/**/*.d.ts",
      "!node-client/index.ts",
      "!node-client/types.gen.ts",
    ],
    // Specify file patterns for tests.
    testMatch: ["**/?(*.)+(test).[tj]s?(x)"],
  };