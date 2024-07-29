import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  budget: number;

  constructor(name: string, startDate: Date, endDate: Date, budget: number) {
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.budget = budget;
  }
}
