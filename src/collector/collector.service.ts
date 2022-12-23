import { Injectable } from '@nestjs/common'
import type { WriteStream } from 'fs'
import { createWriteStream } from 'fs'
import { LogSeverity } from '../common/enums'
import { JSONObject } from '../common/types'
import { getLogFilePath } from '../helpers'
import { Queue } from '../queue'

type QueueWithStream = { queue: Queue; writeStream: WriteStream }

const getQueues = () => {
  const entries = Object.values(LogSeverity).map((severity): [LogSeverity, QueueWithStream] => {
    const queueWithStream = {
      queue: new Queue(),
      writeStream: createWriteStream(getLogFilePath(severity), { flags: 'a' }),
    }
    return [severity, queueWithStream]
  })

  return new Map(entries)
}

@Injectable()
export class CollectorService {
  private readonly queues = getQueues()

  private getLogRow<T extends JSONObject>(data: T) {
    return `${JSON.stringify(data)}\n`
  }

  push(data: JSONObject, logSeverity: LogSeverity, date: Date) {
    const { queue, writeStream } = this.queues.get(logSeverity)
    const action = async () => {
      writeStream.write(this.getLogRow({ timestamp: date.getTime(), data }))
    }
    queue.push(Queue.wrapToItem(action))
    return true
  }
}
