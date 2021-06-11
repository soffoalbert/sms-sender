import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SMSDTO {
  @IsNotEmpty()
  @IsPhoneNumber()
  receiverPhoneNumber: string;

  @IsNotEmpty()
  message: string;
}
