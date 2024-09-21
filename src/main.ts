import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  //swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NestJs With TypeORM.')
    .setDescription('Use the base API URL as http://localhost:3000')
    .setTermsOfService('http://localhost:3000/terms-of-serivce')
    .setLicense(
      'MIT License',
      'https://github.com/git-scm/com/blob/main/MIT_SICENSE.txt',
    )
    .addServer('http://localhost:3000')

    .setVersion('1.0')
    .build();

  // instantiate Document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // listen the app
  await app.listen(3000);
}
bootstrap();
