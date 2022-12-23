import { Test, TestingModule } from '@nestjs/testing'
import { createLogFiles } from '../helpers'
import { CollectorService } from './collector.service'

describe('CollectorService', () => {
  let service: CollectorService

  beforeAll(async () => {
    await createLogFiles()
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectorService],
    }).compile()

    service = module.get<CollectorService>(CollectorService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
