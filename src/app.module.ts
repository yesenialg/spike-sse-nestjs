import { Module } from '@nestjs/common';
import { UnicoCanalController } from './app-controllers/unico-canal.controller';
import { DiferentesCanalesController } from './app-controllers/diferentes-canales.controller';

@Module({
  imports: [],
  controllers: [UnicoCanalController, DiferentesCanalesController],
  providers: [],
})
export class AppModule {}
