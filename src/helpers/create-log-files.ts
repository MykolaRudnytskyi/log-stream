import { LogSeverity } from '../common/enums'
import type { CreateFileOptions } from '../common/types'
import { createEmptyFile } from './create-empty-file'

export const createLogFiles = async (dir = 'storage', options?: CreateFileOptions): Promise<void> => {
  const severityLevels = Object.values(LogSeverity)
  await Promise.all(severityLevels.map((severity) => createEmptyFile(`${dir}/${severity}.log`, options)))
}
