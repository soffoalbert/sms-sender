import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SMS } from './sms.entity';
import { SNSClientFactory } from './sns.factory';
import { SmsController } from './sms.controller';
import { GlobalConfig } from './config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([SMS])],
  providers: [SmsService, SNSClientFactory, GlobalConfig, ConfigService],
  controllers: [SmsController],
})
export class SmsModule {}
