import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SMS {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  receiverPhoneNumber: string;

  @Column()
  message: string;

  @Column()
  externalMessageId: string;
}
