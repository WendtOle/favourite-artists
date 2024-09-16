
export default {
  clearMocks: true,
  coverageDirectory: "v8",
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  roots: ["<rootDir>"],
  testMatch: ["**/__tests__/*.spec.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
}