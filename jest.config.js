module.exports = {
  preset: "ts-jest/presets/default-esm", // use ESM preset with ts-jest v27
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/__mocks__/fileMock.js",
  },
  modulePathIgnorePatterns: ["./src/mocks"],
  transformIgnorePatterns: [
    "/node_modules/(?!(?:@bundled-es-modules|tough-cookie)/)", // transpile these ESM modules
  ],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }], // ts-jest for TS/TSX files
    "^.+\\.js$": "babel-jest", // babel-jest for JS files including ESM modules
  },
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"], // treat TypeScript files as ESM
};
