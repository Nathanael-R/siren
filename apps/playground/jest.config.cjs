module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
  testMatch: ["**/test/**/*.test.ts?(x)"],
  moduleNameMapper: {
    "^@siren-ui/core/(.*)$": "<rootDir>/../../packages/core/src/$1.ts",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(.pnpm|(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|react-native-gesture-handler|react-native-reanimated))",
  ],
};
