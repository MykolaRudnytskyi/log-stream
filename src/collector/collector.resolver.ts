import { Query, Resolver } from '@nestjs/graphql'
import { CollectorService } from './collector.service'

@Resolver()
export class CollectorResolver {
  constructor(private readonly collectorService: CollectorService) {}

  @Query(() => String)
  helloWorld() {
    return 'Hello, world!'
  }
}
