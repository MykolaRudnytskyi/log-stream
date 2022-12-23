import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { createReadStream } from 'fs'
import * as request from 'supertest'
import { LogSeverity } from '../src/common/enums'
import { createLogFiles, getLogFilePath } from '../src/helpers'
import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    await createLogFiles()
  })

  it('"collectLog" mutation should return "true"', async () => {
    const mutation = () => `
      mutation collectLog($data: JSONObject!, $options: CollctOptionsInput!) {
        collectLog(data: $data, options: $options)
      }
    `

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: mutation(),
        variables: {
          data: { msg: 'test' },
          options: { logSeverity: LogSeverity.DEFAULT },
        },
      })

    expect(body).toHaveProperty('data')
    expect(body.data).toHaveProperty('collectLog')
    expect(body.data.collectLog).toBe(true)
  })

  it('"collectLog" mutation should write data to file', async () => {
    const logSeverity = LogSeverity.CRITICAL
    const msg = LogSeverity.CRITICAL
    const path = getLogFilePath(logSeverity)
    const readStream = createReadStream(path)

    const mutation = () => `
      mutation collectLog($data: JSONObject!, $options: CollctOptionsInput!) {
        collectLog(data: $data, options: $options)
      }
    `

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: mutation(),
        variables: {
          data: { msg },
          options: { logSeverity },
        },
      })

    const data = await new Promise<string>((r) => {
      readStream.on('data', (c) => r(c?.toString('utf-8')))
    })
    const logs = data?.trim?.().split?.('\n')
    expect(logs?.length).toBe(1)
    const log = JSON.parse(logs[0])
    expect(log).toHaveProperty('timestamp')
    expect(new Date(log.timestamp).toString()).not.toBe('Invalid Date')
    expect(log).toHaveProperty('data')
    expect(log.data).toHaveProperty('msg')
    expect(log.data.msg).toBe(msg)
  })

  it('"collectLog" mutation should write data to file multiply times', async () => {
    const logSeverity = LogSeverity.CRITICAL
    const path = getLogFilePath(logSeverity)
    const readStream = createReadStream(path)

    const mutation = () => `
      mutation collectLog(
        $data1: JSONObject!
        $data2: JSONObject!
        $data3: JSONObject!
        $options: CollctOptionsInput!
      ) {
        test1: collectLog(data: $data1, options: $options)
        test2: collectLog(data: $data2, options: $options)
        test3: collectLog(data: $data3, options: $options)
      }
    `

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: mutation(),
        variables: {
          data1: { msg: 1 },
          data2: { msg: 2 },
          data3: { msg: 3 },
          options: { logSeverity },
        },
      })

    const logs = await new Promise<string[]>((r) => {
      readStream.on('data', (c) => {
        const logs: string[] = c.toString('utf-8').trim().split('\n')
        if (logs.length === 3) r(logs)
      })
    })

    expect(logs?.length).toBe(3)
    const parsed = logs.map((log) => JSON.parse(log))
    expect(parsed.some((log) => log.data.msg === 1)).toBe(true)
    expect(parsed.some((log) => log.data.msg === 2)).toBe(true)
    expect(parsed.some((log) => log.data.msg === 3)).toBe(true)
  })
})
