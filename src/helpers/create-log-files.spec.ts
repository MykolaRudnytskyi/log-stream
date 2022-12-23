import { rmSync } from 'fs'
import { LogSeverity } from '../common/enums'
import { checkFileExists } from './check-file-exists'
import { createLogFiles } from './create-log-files'
import { getLogFilePath } from './get-log-file-path'

describe('"createLogFiles" helper', () => {
  beforeAll(() => {
    rmSync('storage_test', { recursive: true, force: true })
  })

  it('should return void', async () => {
    const result = await createLogFiles()
    expect(result).toBe(void 0)
  })

  const paths = Object.values(LogSeverity).map(getLogFilePath)
  test.each(paths)('should create %s file', (path) => {
    expect(checkFileExists(path)).resolves.toBe(true)
  })
})
