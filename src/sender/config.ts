import { Schema } from '@hapi/joi';
import * as Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import { ConfigFactory, ConfigService, registerAs } from '@nestjs/config';

const createConfigFactory = (
  namespace: string,
  schema: Schema,
): ConfigFactory =>
  registerAs(namespace, () => {
    const { error, value: validatedConfig } = schema.validate(process.env, {
      allowUnknown: true,
    });

    if (error) {
      throw new Error(
        `Environment variable validation error: ${error.message}`,
      );
    }

    return validatedConfig;
  });

@Injectable()
export class GlobalConfig {
  static ValidationSchema = Joi.object({
    AWS_REGION: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    APP_PORT: Joi.string().default('8000'),
  });

  static factory: ConfigFactory = createConfigFactory(
    'global',
    GlobalConfig.ValidationSchema,
  );

  constructor(private readonly configService: ConfigService) {}

  get AWSRegion(): string {
    return this.configService.get<string>(
      'global.AWS_REGION',
      'eu-central-1',
    ) as string;
  }

  get AWSAccessKeyId(): string {
    return this.configService.get<string>('global.AWS_ACCESS_KEY_ID') as string;
  }

  get AWSSecretAccessKey(): string {
    return this.configService.get<string>(
      'global.AWS_SECRET_ACCESS_KEY',
    ) as string;
  }

  get port(): string {
    return this.configService.get<string>('global.APP_PORT') as string;
  }
}
