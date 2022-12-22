import EventEmitter from 'events'

type ItemCallback<T> = () => Promise<T>
type Resolve = Parameters<ConstructorParameters<typeof Promise>['0']>['0']
type Reject = Parameters<ConstructorParameters<typeof Promise>['0']>['1']

interface Executor {
  readonly resolve: Resolve
  readonly reject: Reject
}

export class Item<T = unknown> {
  executor?: Executor

  constructor(readonly action: ItemCallback<T>) {}
}

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

  static wrapToItem<T>(action: Item<T>['action']) {
    return new Item(action)
  }

  push(item: Item) {
    this.queue.push(item)
    this.emit(Events.PROCESS)
  }

  _pushAndWait(item: Item): ReturnType<typeof item['action']> {
    return item.action()
  }

  pushAndWait(item: Item) {
    return new Promise<Awaited<ReturnType<typeof item['action']>>>((resolve, reject) => {
      item.executor = { resolve, reject }
      this.queue.push(item)
      this.emit(Events.PROCESS)
    })
  }
}
