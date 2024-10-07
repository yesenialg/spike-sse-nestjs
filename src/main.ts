import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('sse example')
    .setDescription('sse API description')
    .setVersion('1.0')
    .addTag('sse')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = 3000;

  app.enableCors()
  await app.listen(port);
  console.log(`Disponible en http://localhost:${port}/api`)
  console.log(`Disponible en http://localhost:${port}/healthy/single-channel/automatic-scores`)
  console.log(`Disponible en http://localhost:${port}/healthy/different-channels/subscription-scores/:id`)
}
bootstrap();