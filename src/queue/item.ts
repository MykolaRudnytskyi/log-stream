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
