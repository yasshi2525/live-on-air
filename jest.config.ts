import type { Config } from 'jest'

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'tmp/coverage',
  coverageProvider: 'babel',
  coveragePathIgnorePatterns: ['spec'],
  testMatch: ['<rootDir>/spec/**/*.ts'],
  testPathIgnorePatterns: ['__setup', '__helper.ts'],
  transform: {
    '^.+.tsx?$': [
      'ts-jest', { tsconfig: '<rootDir>/spec/tsconfig.json' }
    ]
  },
  testEnvironment: '@yasshi2525/jest-environment-akashic',
  globalSetup: '<rootDir>/spec/__setup/setup.ts',
  globalTeardown: '<rootDir>/spec/__setup/teardown.ts',
  setupFilesAfterEnv: ['<rootDir>/spec/__setup/mock.ts']
}

export default config
