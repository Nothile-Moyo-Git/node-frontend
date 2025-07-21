module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  modulePathIgnorePatterns: ["./src/mocks"],
  transformIgnorePatterns: [
    "/node_modules/(?!@bundled-es-modules/tough-cookie)",
  ],
};
