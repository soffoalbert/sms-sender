import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SMS } from './sms.entity';
import { SNSClientFactory } from './sns.factory';
import { SmsController } from './sms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SMS])],
  providers: [SmsService, SNSClientFactory],
  controllers: [SmsController],
})
export class SmsModule {}
