import { Injectable } from '@nestjs/common'
import type { WriteStream } from 'fs'
import { createWriteStream } from 'fs'
import { LogSeverity } from '../common/enums'
import { JSONObject } from '../common/types'
import { getLogFilePath } from '../helpers'
import { Queue } from '../queue'

// creating of singletones for queues
const getQueues = () => {
  const entries = Object.values(LogSeverity).map((severity): [LogSeverity, InstanceType<typeof Queue>] => {
    return [severity, new Queue()]
  })

  return new Map(entries)
}

// creating of singletones for write streams
const getWriteStreams = () => {
  const entries = Object.values(LogSeverity).map((severity): [LogSeverity, WriteStream] => {
    return [severity, createWriteStream(getLogFilePath(severity), { flags: 'a' })]
  })

  return new Map(entries)
}

@Injectable()
export class CollectorService {
  private readonly queues = getQueues()
  private readonly writeStreams = getWriteStreams()

  private getLogRow<T extends JSONObject>(data: T) {
    return `${JSON.stringify(data)}\n`
  }

  push(data: JSONObject, logSeverity: LogSeverity, date: Date) {
    const queue = this.queues.get(logSeverity)
    const writeStream = this.writeStreams.get(logSeverity)
    const action = async () => {
      writeStream.write(this.getLogRow({ timestamp: date.getTime(), data }))
    }
    queue.push(Queue.wrapToItem(action))
    return true
  }
}
