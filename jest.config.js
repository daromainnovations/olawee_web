module.exports = {
    testEnvironment: "jsdom",
    moduleNameMapper: {
      "\\.(css|scss)$": "identity-obj-proxy",
    },
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
    moduleDirectories: ["node_modules", "src"],
  };
  