import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'
import type { JSONObject } from '../common/types'
import { CollectorService } from './collector.service'
import { CollctOptionsInput } from './dto/collect-options.input'

@Resolver()
export class CollectorResolver {
  constructor(private readonly collectorService: CollectorService) {}

  // Added temporarily to fix "GraphQLError: Query root type must be provided."
  // TODO please, remove this when some "feature" query is added
  @Query(/* istanbul ignore next */ () => Boolean, {
    deprecationReason: 'to be removed',
  })
  root() {
    return true
  }

  @Mutation(/* istanbul ignore next */ () => Boolean)
  collectLog(
    @Args('data', { type: /* istanbul ignore next */ () => GraphQLJSONObject }) data: JSONObject,
    @Args('options', { type: /* istanbul ignore next */ () => CollctOptionsInput }) { logSeverity }: CollctOptionsInput,
  ): boolean | Promise<boolean> {
    return this.collectorService.push(data, logSeverity, new Date())
  }
}
