import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { createLogFiles } from './helpers/create-log-files'

async function bootstrap() {
  await createLogFiles()
  const app = await NestFactory.create(AppModule)
  await app.listen(3000)
}

bootstrap()
