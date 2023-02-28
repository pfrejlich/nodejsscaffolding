import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsOptional()
  password: string;

  @IsNumber()
  @Min(18)
  @Max(120)
  @IsOptional()
  age: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;
}
