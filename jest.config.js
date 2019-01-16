module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests/"],
  collectCoverage: true,
  coverageDirectory: "./tests/coverage"
};
