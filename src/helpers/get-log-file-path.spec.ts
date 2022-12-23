import { LogSeverity } from '../common/enums'
import { getLogFilePath } from './get-log-file-path'

describe('"getLogFilePath" helper', () => {
  const oldEnv = process.env.NODE_ENV
  afterAll(() => {
    process.env.NODE_ENV = oldEnv
  })

  it('should return path', async () => {
    expect(getLogFilePath(LogSeverity.DEFAULT)).toBe('storage_test/DEFAULT.log')
  })

  it('should return path in non-testing ', async () => {
    process.env.NODE_ENV = 'not_test'
    expect(getLogFilePath(LogSeverity.DEFAULT)).toBe('storage/DEFAULT.log')
  })
})
