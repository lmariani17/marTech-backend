import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column()
  budget: number;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  constructor(name: string, startDate: Date, endDate: Date, budget: number) {
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.budget = budget;
  }
}
