import {Test, TestingModule} from '@nestjs/testing';
import {SmsService} from "./sms.service";
import {SMS} from "./sms.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {SNS_CLIENT, SNSClientFactory} from "./sns.factory";
import {
  error,
  happyPathRepoFn,
  happyPathRepositoryMockFactory,
  snsMockFactory,
  unhappyPathRepositoryMockFactory
} from "./mocks";



describe('SenderService', () => {
  let happyPathService: SmsService;
  let unHappyPathService: SmsService;

  beforeEach(async () => {
    const happyPathmodule: TestingModule = await Test.createTestingModule({
      providers: [SmsService, {provide: getRepositoryToken(SMS), useFactory: happyPathRepositoryMockFactory},
        SNSClientFactory, {provide: SNS_CLIENT, useFactory: snsMockFactory}]
    }).compile();

    happyPathService = happyPathmodule.get<SmsService>(SmsService);

    const unHappyPathmodule: TestingModule = await Test.createTestingModule({
      providers: [SmsService, {provide: getRepositoryToken(SMS), useFactory: unhappyPathRepositoryMockFactory},
        SNSClientFactory, {provide: SNS_CLIENT, useFactory: snsMockFactory}]
    }).compile();

    unHappyPathService = unHappyPathmodule.get<SmsService>(SmsService);
  });

  it('sending sms - happy path', async () => {
    const smsToSend = {message: 'test', receiverPhoneNumber: '0610230203'};
    expect(await happyPathService.sendSMS(smsToSend)).toEqual(
      smsToSend
    );
    expect(happyPathRepoFn.save).toHaveBeenCalled();
  });

  it('sending sms - unhappy path', async () => {
    const smsToSend = {message: 'test', receiverPhoneNumber: '0610230203'};
    await expect(unHappyPathService.sendSMS(smsToSend)).rejects.toThrow(error)
  });

  it('finding an sms - happy path', async () => {
    const receiverPhoneNumber = '0610230203';
    const foundSms = {message: 'test', receiverPhoneNumber: '0610230203', externalMessageId: "test",};

    expect(await happyPathService.findSMSByRecipient(receiverPhoneNumber)).toEqual(
      foundSms
    );
    expect(happyPathRepoFn.createQueryBuilder).toHaveBeenCalled();
  });

  it('finding an sms - unhappy path', async () => {
    const receiverPhoneNumber = '0610230203';
    await expect(unHappyPathService.findSMSByRecipient(receiverPhoneNumber)).rejects.toThrow(error)
  });
});
