import { Args, Query, Resolver } from '@nestjs/graphql'
import { LogSeverity } from '../common/enums'
import { CollectorService } from './collector.service'

@Resolver()
export class CollectorResolver {
  constructor(private readonly collectorService: CollectorService) {}

  @Query(() => String)
  helloWorld(@Args('level', { type: () => LogSeverity }) logSeverity: LogSeverity) {
    return 'Hello, world! ' + logSeverity
  }
}
