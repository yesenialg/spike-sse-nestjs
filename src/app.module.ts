import { Module } from '@nestjs/common';
import { SingleChannelController } from './app-controllers/single-channel.controller';
import { DifferentChannelsController } from './app-controllers/different-channels.controller';

@Module({
  imports: [],
  controllers: [SingleChannelController, DifferentChannelsController],
  providers: [],
})
export class AppModule {}
