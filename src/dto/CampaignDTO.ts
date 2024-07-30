import { IsString, IsNumber, IsNotEmpty, IsDateString } from 'class-validator';

export class CampaignDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate!: Date;

  @IsNumber()
  @IsNotEmpty()
  budget!: number;
}
