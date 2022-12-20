import { Module } from '@nestjs/common'
import { CollectorService } from './collector.service'
import { CollectorResolver } from './collector.resolver'

@Module({
  providers: [CollectorResolver, CollectorService],
})
export class CollectorModule {}
