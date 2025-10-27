module.exports = {
  preset: "ts-jest/presets/default-esm", // use ESM preset with ts-jest v27
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleNameMapper: {
    "^swiper/react$": "<rootDir>/src/test-utils/mockSwiperReact.tsx",
    "^swiper/modules$": "<rootDir>/src/test-utils/mockSwiperReact.tsx",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$":
      "<rootDir>/src/test-utils/mocks/fileMock.ts",
  },
  modulePathIgnorePatterns: ["./src/mocks"],
  transformIgnorePatterns: [
    "/node_modules/(?!(?:@bundled-es-modules|tough-cookie|swiper|ssr-window|dom7)/)", // transpile these ESM modules
  ],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }], // ts-jest for TS/TSX files
    "^.+\\.js$": "babel-jest", // babel-jest for JS files including ESM modules
    "^.+\\.mjs$": "babel-jest",
  },
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"], // treat TypeScript files as ESM
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "mjs", "json", "node"],
};
