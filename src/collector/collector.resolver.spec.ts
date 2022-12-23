import { Test, TestingModule } from '@nestjs/testing'
import { createLogFiles } from '../helpers'
import { CollectorResolver } from './collector.resolver'
import { CollectorService } from './collector.service'

describe('CollectorResolver', () => {
  let resolver: CollectorResolver

  beforeAll(async () => {
    await createLogFiles()
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectorResolver, CollectorService],
    }).compile()

    resolver = module.get<CollectorResolver>(CollectorResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
