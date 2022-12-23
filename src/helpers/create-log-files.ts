import { LogSeverity } from '../common/enums'
import type { CreateFileOptions } from '../common/types'
import { createEmptyFile } from './create-empty-file'
import { getLogFilePath } from './get-log-file-path'

export const createLogFiles = async (options?: CreateFileOptions): Promise<void> => {
  const severityLevels = Object.values(LogSeverity)
  await Promise.all(severityLevels.map((severity) => createEmptyFile(getLogFilePath(severity), options)))
}
