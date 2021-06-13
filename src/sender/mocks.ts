import {Repository} from "typeorm";
import {SNS} from "aws-sdk";

export const repositoryMockFactory: () => SMSRepositoryMock<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn(entity => entity),
}));

// @ts-ignore
export const snsMockFactory: () => SMSRepositoryMock<SNS<any>> = jest.fn(() => ({
  publish: jest.fn(sms => sms),
}));

export type SMSRepositoryMock<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const happyPathRepoFn = {
  createQueryBuilder: jest.fn(() => {
    return {
      where: function ({}, {}) {
        return {
          select([]) {
            return {
              execute() {
                return {message: 'test', receiverPhoneNumber: '0610230203', externalMessageId: "test"}
              }
            }
          }
        }
      }
    }
  })
  ,
  save: jest.fn().mockResolvedValue({message: 'test', receiverPhoneNumber: '0610230203', externalMessageId: "test"}),
};


export const happyPathRepositoryMockFactory: () => SMSRepositoryMock<Repository<any>> = jest.fn().mockResolvedValue(happyPathRepoFn);

export const error = new Error('an error occurred');

export const unHappyPathRepoFn = {
  createQueryBuilder: jest.fn(() => {
  return {
    where: function ({}, {}) {
      return {
        select([]) {
          return {
            execute : jest.fn().mockRejectedValue(error)
          }
        }
      }
    }
  }
}),
  save: jest.fn().mockRejectedValue(error),
};

export const unhappyPathRepositoryMockFactory: () => SMSRepositoryMock<Repository<any>> = jest.fn(() => (unHappyPathRepoFn));

// @ts-ignore
export const snsMockFactory: () => SMSRepositoryMock<SNS<any>> = jest.fn(() => ({
  SNSClient: {
    publish(sms) {
      return {promise: jest.fn().mockReturnValue({MessageId: 'test'})}
    }
  },
}));
