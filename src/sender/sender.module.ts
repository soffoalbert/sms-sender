import { Module } from '@nestjs/common';
import { SenderService } from './sender.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SMS } from './sms.entity';
import { SNSClientFactory } from './sns.factory';

@Module({
  imports: [TypeOrmModule.forFeature([SMS])],
  providers: [SenderService, SNSClientFactory],
})
export class SenderModule {}
