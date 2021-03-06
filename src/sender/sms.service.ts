import {Inject, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {SMS} from './sms.entity';
import {Repository} from 'typeorm';
import {SNSClientFactoryReturnType, SNS_CLIENT} from './sns.factory';

@Injectable()
export class SmsService {

  private readonly logger = new Logger(SmsService.name);

  constructor(
    @InjectRepository(SMS)
    private readonly smsRepository: Repository<SMS>,
    @Inject(SNS_CLIENT)
    private readonly snsClient: SNSClientFactoryReturnType,
  ) {
  }

  async sendSMS(sms: SMS): Promise<SMS> {
    this.logger.log(`sending this sms: ${JSON.stringify(sms)}`);
    const params = {
      Message: sms.message,
      PhoneNumber: sms.receiverPhoneNumber,
    };
    const messageResponse = await this.snsClient.SNSClient.publish(
      params,
    ).promise();
    this.logger.log(`sms sent: ${JSON.stringify(sms)}`);
    sms.externalMessageId = messageResponse.MessageId;
    return await this.smsRepository.save(sms);
  }

  async findSMSByRecipient(receiverPhoneNumber: string): Promise<SMS> {
    this.logger.log(`looking up the sms(s) with this phone number: ${receiverPhoneNumber}`);
    const smsFound = await this.smsRepository.createQueryBuilder("sms")
      .where("sms.receiverPhoneNumber = :receiverPhoneNumber", {receiverPhoneNumber})
      .select(["sms.id", "sms.receiverPhoneNumber", "sms.message", "sms.externalMessageId"])
      .execute();
    if (!smsFound) {
      this.logger.debug(` could not find the sms(s) with this phone number: ${receiverPhoneNumber}`);
      throw new NotFoundException(
        `No SMS found for phone number ${receiverPhoneNumber}`,
      );
    }
    this.logger.log(` found the following sms(s) with this phone number: ${receiverPhoneNumber} - ${JSON.stringify(smsFound)}`);
    return smsFound;
  }
}
