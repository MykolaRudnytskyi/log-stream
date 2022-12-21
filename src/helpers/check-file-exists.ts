import { access } from 'fs/promises'

export const checkFileExists = async (...args: Parameters<typeof access>): Promise<boolean> => {
  try {
    await access(...args)
    return true
  } catch {
    return false
  }
}
