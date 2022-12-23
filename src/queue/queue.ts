import { EventEmitter } from 'events'
import { Item } from './item'

enum Events {
  PROCESS = 'process',
}

export class Queue {
  private ee = new EventEmitter()
  private queue: Item[] = []

  constructor() {
    this.spawnNewItemListener()
  }

  private async processRecurrently(): Promise<void> {
    const item = this.queue.shift()

    if (item) {
      try {
        const res: unknown = await item.action()
        item.executor?.resolve?.(res)
      } catch (e) {
        item.executor?.reject?.(e)
      }

      return this.processRecurrently()
    }
  }

  private spawnNewItemListener() {
    this.ee.once(Events.PROCESS, async () => {
      await this.processRecurrently()
      this.spawnNewItemListener()
    })
  }

  static wrapToItem<T>(action: Item<T>['action']) {
    return new Item<T>(action)
  }

  /**
   * @description push a task to the queue with will be executed asynchronously in the background
   */
  push(item: Item) {
    this.queue.push(item)
    this.ee.emit(Events.PROCESS)
  }

  /**
   * @description push a task to the queue with will be executed asynchronously and return a result of execution
   */
  pushAndWait<T>(item: Item<T>) {
    type Result = Awaited<ReturnType<typeof item['action']>>
    return new Promise<Result>((resolve, reject) => {
      item.executor = { resolve, reject }
      this.queue.push(item)
      this.ee.emit(Events.PROCESS)
    })
  }
}
