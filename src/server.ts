import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap() {
  const PORT = process.env.PORT || 7071
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder()
    .setTitle('WBChat-api')
    .setDescription('Documentation')
    .setVersion('1.0.0')
    .build()

  const documentation = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, documentation)

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
}

bootstrap()
