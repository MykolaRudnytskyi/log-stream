import { rmSync } from 'fs'
import { checkFileExists } from './check-file-exists'
import { createEmptyFile } from './create-empty-file'

describe('"createEmptyFile" helper', () => {
  const dir = 'storage_test'
  const file = 'test_file.log'
  const path = `${dir}/${file}`
  const nestedPath = `${dir}/very/nested/path/${file}`

  beforeEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it('should create file with path', async () => {
    await createEmptyFile(path)
    expect(await checkFileExists(path)).toBe(true)
  })

  it('should create file with nested path', async () => {
    await createEmptyFile(nestedPath)
    expect(await checkFileExists(nestedPath)).toBe(true)
  })
})
