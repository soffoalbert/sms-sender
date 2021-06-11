import {Inject, Injectable, Logger, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SMS } from './sms.entity';
import { Repository } from 'typeorm';
import { SNSClientFactoryReturnType, SNS_CLIENT } from './sns.factory';

@Injectable()
export class SmsService {

  private readonly logger = new Logger(SmsService.name);

  constructor(
    @InjectRepository(SMS)
    private readonly smsRepository: Repository<SMS>,
    @Inject(SNS_CLIENT)
    private readonly snsClient: SNSClientFactoryReturnType,
  ) {}

  async sendSMS(sms: SMS): Promise<SMS> {
    const params = {
      Message: sms.message,
      PhoneNumber: sms.receiverPhoneNumber,
    };
    const messageResponse = await this.snsClient.SNSClient.publish(
      params,
    ).promise();
    this.logger.debug(`the sns response: ${JSON.stringify(messageResponse)}`);
    sms.externalMessageId = messageResponse.MessageId;
    return await this.smsRepository.save(sms);
  }

  async findSMSByRecipient(receiverPhoneNumber: string): Promise<SMS> {
    const smsFound = await this.smsRepository.findOne(receiverPhoneNumber);
    if (!smsFound) {
      throw new NotFoundException(
        `No SMS found for phone number ${receiverPhoneNumber}`,
      );
    }
    return smsFound;
  }
}
