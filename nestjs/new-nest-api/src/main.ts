require('module-alias/register');
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { SharedModule } from './shared/shared.module';

async function bootstrap() {
  const app = await NestFactory.create(SharedModule);

  const config = new DocumentBuilder()
    .setTitle('Car Reports API')
    .setDescription(
      'Search across a large variety of vehicles based on your needs',
    )
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('/', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
