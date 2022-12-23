import { EventEmitter } from 'events'
import { Task } from './task'

enum Events {
  PROCESS = 'process',
}

export class Queue {
  private ee = new EventEmitter()
  private queue: Task[] = []

  constructor() {
    this.spawnNewTaskListener()
  }

  private async processTasksRecurrently(): Promise<void> {
    const task = this.queue.shift()

    if (task) {
      try {
        const res = await task.action()
        task.executor?.resolve?.(res)
      } catch (e) {
        task.executor?.reject?.(e)
      }

      return this.processTasksRecurrently()
    }
  }

  private spawnNewTaskListener() {
    this.ee.once(Events.PROCESS, async () => {
      await this.processTasksRecurrently()
      this.spawnNewTaskListener()
    })
  }

  static wrapActionIntoTask<T>(action: Task<T>['action']) {
    return new Task<T>(action)
  }

  /**
   * @description push a task to the queue with will be executed asynchronously in the background
   */
  push(task: Task) {
    this.queue.push(task)
    this.ee.emit(Events.PROCESS)
  }

  /**
   * @description push a task to the queue with will be executed asynchronously and return a result of the execution
   */
  pushAndWait<T>(task: Task<T>) {
    type Result = Awaited<ReturnType<typeof task['action']>>
    return new Promise<Result>((resolve, reject) => {
      task.executor = { resolve, reject }
      this.queue.push(task)
      this.ee.emit(Events.PROCESS)
    })
  }
}
