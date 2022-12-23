import { Test, TestingModule } from '@nestjs/testing'
import { LogSeverity } from '../common/enums'
import type { JSONObject } from '../common/types'
import { createLogFiles } from '../helpers'
import { CollectorResolver } from './collector.resolver'
import { CollectorService } from './collector.service'

const collectorServiceMock = {
  push: jest.fn((_data: JSONObject, _logSeverity: LogSeverity, _date: Date): boolean => true),
}

describe('CollectorResolver', () => {
  let resolver: CollectorResolver

  beforeAll(async () => {
    await createLogFiles()
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectorResolver, { provide: CollectorService, useValue: collectorServiceMock }],
    }).compile()

    resolver = module.get<CollectorResolver>(CollectorResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  it('"root" mutation should be defined', () => {
    expect(resolver.root).toBeDefined()
  })

  it('"root" mutation should return retult from "CollectorService" directly', () => {
    expect(resolver.root()).toBe(true)
  })

  it('"collectLog" mutation should be defined', () => {
    expect(resolver.collectLog).toBeDefined()
  })

  it('"collectLog" mutation should return retult from "CollectorService" directly', () => {
    expect(resolver.collectLog({}, { logSeverity: LogSeverity.DEFAULT })).toBe(true)
  })
})
