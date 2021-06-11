import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class SMS {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @IsNotEmpty()
  receiverPhoneNumber: string;

  @Column()
  @IsNotEmpty()
  message: string;

  @Column()
  @IsNotEmpty()
  externalMessageId?: string;
}
