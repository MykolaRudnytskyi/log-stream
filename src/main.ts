import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { createLogFiles } from './helpers/create-log-files'
import { Queue } from './queue'

async function bootstrap() {
  const q = new Queue()
  const a = await q.pushAndWait(
    Queue.wrapToItem(async () => {
      return 1
    }),
  )

  console.log(a)

  await createLogFiles()
  const app = await NestFactory.create(AppModule)
  await app.listen(3000)
}

bootstrap()
