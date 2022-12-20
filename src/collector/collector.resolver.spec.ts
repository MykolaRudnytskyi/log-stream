import { Test, TestingModule } from '@nestjs/testing'
import { CollectorResolver } from './collector.resolver'
import { CollectorService } from './collector.service'

describe('CollectorResolver', () => {
  let resolver: CollectorResolver

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
