module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
  testRegex: '.+.test.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['src/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', 'src/types.d.ts'],
};
