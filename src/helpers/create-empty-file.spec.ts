import { checkFileExists } from './check-file-exists'

describe('"checkFileExists" helper', () => {
  it('should return true for existing file path', async () => {
    expect(await checkFileExists(__filename)).toBe(true)
  })

  it('should return true for non-existing file path', async () => {
    expect(await checkFileExists(__filename + '_some_text')).toBe(false)
  })
})
