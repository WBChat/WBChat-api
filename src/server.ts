import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { FilterModel, SearchModel } from './types/gridParams'

async function bootstrap(): Promise<void> {
  const PORT = process.env.PORT ?? 7071
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
  })

  app.useGlobalPipes(new ValidationPipe())
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('WBChat-api')
    .setDescription('Documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build()

  const documentation = SwaggerModule.createDocument(app, config, {
    extraModels: [SearchModel, FilterModel],
  })
  SwaggerModule.setup('/api/docs', app, documentation)

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
}

bootstrap()
