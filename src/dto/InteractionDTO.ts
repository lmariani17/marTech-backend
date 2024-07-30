import { IsString, IsNotEmpty, IsOptional, IsInt, IsDateString } from 'class-validator';

export class InteractionDTO {
  @IsInt()
  @IsNotEmpty()
  campaignId!: number;

  @IsInt()
  @IsNotEmpty()
  userId!: number;

  @IsString()
  @IsNotEmpty()
  interactionType!: string;

  @IsOptional()
  @IsDateString()
  timestamp?: Date;
}
