import { mkdir, writeFile } from 'fs/promises'
import { parse } from 'path'
import type { CreateFileOptions } from '../common/types'
import { checkFileExists } from './check-file-exists'

export const createEmptyFile = async (path: string, { rewrite = false }: CreateFileOptions = {}): Promise<void> => {
  const fileExists = await checkFileExists(path)

  if (!fileExists || rewrite) {
    const { dir } = parse(path)
    if (dir?.length > 0) {
      await mkdir(dir, { recursive: true })
    }
    await writeFile(path, '', { encoding: 'utf-8' })
  }
}
