module.exports = {
  preset: "ts-jest/presets/default-esm", // use ESM preset
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  modulePathIgnorePatterns: ["./src/mocks"],
  transformIgnorePatterns: [
    "/node_modules/(?!(?:@bundled-es-modules|tough-cookie)/)",
  ],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
