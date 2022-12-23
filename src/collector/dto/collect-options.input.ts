import { Field, InputType } from '@nestjs/graphql'
import { LogSeverity } from '../../common/enums'

@InputType()
export class CollctOptionsInput {
  @Field(() => LogSeverity, { defaultValue: LogSeverity.DEFAULT, nullable: true })
  logSeverity: LogSeverity
}
