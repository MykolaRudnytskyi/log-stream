import type { LogSeverity } from '../common/enums'

export const getLogFilePath = (severity: LogSeverity) => {
  const postfix = process.env.NODE_ENV === 'test' ? '_test' : ''
  return `storage${postfix}/${severity}.log`
}
