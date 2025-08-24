import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from './logger/logger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false
  });
  app.useLogger(app.get(Logger));
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
