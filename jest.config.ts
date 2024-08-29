import type { Config } from 'jest'

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  testMatch: ['<rootDir>/spec/**/*.ts'],
  testPathIgnorePatterns: ['__setup'],
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
