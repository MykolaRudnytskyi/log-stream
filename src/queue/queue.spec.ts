import { Item } from './item'
import { Queue } from './queue'

describe(Queue, () => {
  const queue = new Queue()
  let item: Item

  const action = async () => {
    return 'test'
  }

  test('queue should be defined', () => {
    expect(queue).toBeDefined()
  })

  test('queue should wrap action into Item', () => {
    expect(item).toBeUndefined()
    item = Queue.wrapToItem(action)
    expect(item instanceof Item).toBeTruthy()
  })

  test('queue.push should return void', () => {
    expect(queue.push(item)).toBeUndefined()
  })

  test('queue.push should iterate value', (done) => {
    let value = 1
    function iterate(n: number) {
      return n + 1
    }
    expect(value).toBe(1)
    expect(iterate(1)).toBe(2)

    const item = Queue.wrapToItem(async () => {
      value = iterate(value)
      done()
    })
    queue.push(item)

    expect(value).toBe(2)
  })

  test('queue.push should throw an error in background', (done) => {
    const err = new Error('test')
    const spy = jest.fn()
    const item = Queue.wrapToItem(async () => {
      try {
        throw err
      } catch (e) {
        spy()
        throw e
      } finally {
        done()
      }
    })
    expect(queue.push(item)).toBeUndefined()
    expect(spy).toBeCalled()
  })

  test('queue.pushAndWait should return string "test"', () => {
    expect(queue.pushAndWait(item)).resolves.toBe('test')
  })

  test('queue.pushAndWait should rethrow an error', () => {
    const err = new Error('test')
    const item = Queue.wrapToItem(async () => {
      throw err
    })
    expect(queue.pushAndWait(item)).rejects.toBe(err)
  })
})
