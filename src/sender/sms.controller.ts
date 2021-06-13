import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SMSDTO } from './sms.dto';
import { SMS } from './sms.entity';

@Controller('v1/sender')
export class SmsController {
  constructor(private readonly senderService: SmsService) {}

  @Post('/newSMS')
  async sendSMS(@Body() smsdto: SMSDTO): Promise<SMSDTO> {
    const smsEntity: SMS = {
      receiverPhoneNumber: smsdto.receiverPhoneNumber,
      message: smsdto.message,
    };
    const sentSMS = await this.senderService.sendSMS(smsEntity);

    return {
      message: sentSMS.message,
      receiverPhoneNumber: sentSMS.receiverPhoneNumber,
    };
  }

  @Get(':phoneNumber')
  async findSMSByPhoneNumber(@Param('phoneNumber') phoneNumber: string) : Promise<SMS> {
    return await this.senderService.findSMSByRecipient(phoneNumber);
  }
}
