import { EventEmitter } from 'events'
import { Item } from './item'

enum Events {
  PROCESS = 'process',
}

export class Queue extends EventEmitter {
  private queue: Item[] = []

  constructor(...args: ConstructorParameters<typeof EventEmitter>) {
    super(...args)
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

  private spawnNewItemListener(): void {
    this.once(Events.PROCESS, async () => {
      await this.processRecurrently()
      this.spawnNewItemListener()
    })
  }

  static wrapToItem<T>(action: Item<T>['action']): Item<T> {
    return new Item<T>(action)
  }

  push(item: Item) {
    this.queue.push(item)
    this.emit(Events.PROCESS)
  }

  pushAndWait<T>(item: Item<T>) {
    type Result = Awaited<ReturnType<typeof item['action']>>
    return new Promise<Result>((resolve, reject) => {
      item.executor = { resolve, reject }
      this.queue.push(item)
      this.emit(Events.PROCESS)
    })
  }
}
