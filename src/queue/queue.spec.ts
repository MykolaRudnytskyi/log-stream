import { Queue } from './queue'
import { Task } from './task'

describe(Queue, () => {
  const queue = new Queue()
  let task: Task

  const action = async () => {
    return 'test'
  }

  test('queue should be defined', () => {
    expect(queue).toBeDefined()
  })

  test('queue should wrap action into Task', () => {
    expect(task).toBeUndefined()
    task = Queue.wrapActionIntoTask(action)
    expect(task instanceof Task).toBeTruthy()
  })

  test('queue.push should return void', () => {
    expect(queue.push(task)).toBeUndefined()
  })

  test('queue.push should iterate value', (done) => {
    let value = 1
    function iterate(n: number) {
      return n + 1
    }
    expect(value).toBe(1)
    expect(iterate(1)).toBe(2)

    const task = Queue.wrapActionIntoTask(async () => {
      value = iterate(value)
      done()
    })
    queue.push(task)

    expect(value).toBe(2)
  })

  test('queue.push should throw an error in background', (done) => {
    const err = new Error('test')
    const spy = jest.fn()
    const task = Queue.wrapActionIntoTask(async () => {
      try {
        throw err
      } catch (e) {
        spy()
        throw e
      } finally {
        done()
      }
    })
    expect(queue.push(task)).toBeUndefined()
    expect(spy).toBeCalled()
  })

  test('queue.pushAndWait should return string "test"', () => {
    expect(queue.pushAndWait(task)).resolves.toBe('test')
  })

  test('queue.pushAndWait should rethrow an error', () => {
    const err = new Error('test')
    const task = Queue.wrapActionIntoTask(async () => {
      throw err
    })
    expect(queue.pushAndWait(task)).rejects.toBe(err)
  })
})
