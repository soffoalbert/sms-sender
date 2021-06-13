import {Test, TestingModule} from '@nestjs/testing';
import {SmsController} from './sms.controller';
import {SmsService} from "./sms.service";
import {Repository} from "typeorm";
import {SMS} from "./sms.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {SNS} from "aws-sdk";
import {SNS_CLIENT, SNSClientFactory} from "./sns.factory";

export type SMSRepositoryMock<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => SMSRepositoryMock<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn(entity => entity),
}));

// @ts-ignore
export const snsMockFactory: () => SMSRepositoryMock<SNS<any>> = jest.fn(() => ({
  publish: jest.fn(sms => sms),
}));

describe('SenderController', () => {
  let controller: SmsController;
  let service: SmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmsController],
      providers: [SmsService, {provide: getRepositoryToken(SMS), useFactory: repositoryMockFactory},
        SNSClientFactory, {provide: SNS_CLIENT, useFactory: snsMockFactory}]
    }).compile();

    service = module.get<SmsService>(SmsService);
    controller = module.get<SmsController>(SmsController);
  });

  it('sending sms - happy path', async () => {
    const smsToSend = {message: 'test', receiverPhoneNumber: '0610230203'};
    jest.spyOn(service, 'sendSMS').mockImplementation(() => Promise.resolve(smsToSend))
    expect(await controller.sendSMS(smsToSend)).toEqual(
      smsToSend
    );
    expect(service.sendSMS).toHaveBeenCalled();
  });

  it('sending sms - unhappy path', async () => {
    const error = new Error('An error occurred');
    const smsToSend = {message: 'test', receiverPhoneNumber: '0610230203'};
    jest.spyOn(service, 'sendSMS').mockRejectedValue(error);
    await expect(controller.sendSMS(smsToSend)).rejects.toThrow(error)
  });

  it('finding an sms - happy path', async () => {
    const receiverPhoneNumber = '0610230203';
    const foundSms = {message: 'test', receiverPhoneNumber: '0610230203'};

    jest.spyOn(service, 'findSMSByRecipient').mockImplementation(() => Promise.resolve(foundSms))
    expect(await controller.findSMSByPhoneNumber(receiverPhoneNumber)).toEqual(
      foundSms
    );
    expect(service.findSMSByRecipient).toHaveBeenCalled();
  });

  it('finding an sms - unhappy path', async () => {
    const error = new Error('An error occurred');
    const receiverPhoneNumber = '0610230203';
    jest.spyOn(service, 'findSMSByRecipient').mockRejectedValue(error);
    await expect(controller.findSMSByPhoneNumber(receiverPhoneNumber)).rejects.toThrow(error)
  });
});
