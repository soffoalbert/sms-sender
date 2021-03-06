import { SNS, Config } from 'aws-sdk';
import { GlobalConfig } from './config';

export const SNS_CLIENT = 'SNS_CLIENT';
export const SNSClientFactory = {
  provide: SNS_CLIENT,
  useFactory: (globalConfig: GlobalConfig) => {
    return {
      SNSClient: new SNS({ region: globalConfig.AWSRegion,
        accessKeyId: globalConfig.AWSAccessKeyId,
        secretAccessKey: globalConfig.AWSSecretAccessKey}),
    };
  },
  inject: [GlobalConfig],
};

export type SNSClientFactoryReturnType = ReturnType<
  typeof SNSClientFactory.useFactory
>;
