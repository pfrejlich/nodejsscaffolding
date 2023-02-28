import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class ReportFilterDto {
  @IsString()
  @MaxLength(50)
  make: string;

  @IsString()
  @MaxLength(50)
  model: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear())
  year: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1000 * 1000)
  mileage: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;
}
