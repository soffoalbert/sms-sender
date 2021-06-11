import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SMS {
  @IsNotEmpty()
  @IsPhoneNumber()
  receiverPhoneNumber: string;

  @IsNotEmpty()
  message: string;
}
