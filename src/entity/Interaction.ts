import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Campaign } from './Campaign';

@Entity()
export class Interaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  campaignId: number;

  @Column()
  userId: number;

  @Column()
  interactionType: string;

  @Column({ type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Campaign)
  @JoinColumn({ name: 'campaignId' })
  campaign!: Campaign;

  constructor(campaignId: number, userId: number, interactionType: string, timestamp?: Date) {
    this.campaignId = campaignId;
    this.userId = userId;
    this.interactionType = interactionType;
    this.timestamp = timestamp || new Date();
  }
}
